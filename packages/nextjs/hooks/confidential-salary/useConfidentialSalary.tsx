"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { 
  useFhevm, 
  useFHEEncryption, 
  useFHEDecrypt,
  useInMemoryStorage,
  FhevmInstance 
} from "@fhevm-sdk";
import { ethers } from "ethers";
import { notification } from "~~/utils/helper/notification";
import { useWagmiEthers } from "../wagmi/useWagmiEthers";
import { useDeployedContractInfo } from "../helper";
import type { AllowedChainIds } from "~~/utils/helper/networks";

// 合约地址（从环境变量或部署信息获取）
const getContractAddress = (): `0x${string}` | undefined => {
  const envAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (envAddress && envAddress !== "0x0000000000000000000000000000000000000000") {
    return envAddress as `0x${string}`;
  }
  return undefined;
};

/**
 * useConfidentialSalary Hook
 * 
 * 提供与 ConfidentialSalary 智能合约交互的所有功能
 */
export function useConfidentialSalary() {
  const { address, chainId } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // 获取合约信息
  const allowedChainId = typeof chainId === "number" ? (chainId as AllowedChainIds) : undefined;
  const { data: contractInfo } = useDeployedContractInfo({ 
    contractName: "ConfidentialSalary", 
    chainId: allowedChainId 
  });

  // 合约地址（优先使用部署信息，其次使用环境变量）
  const contractAddress = useMemo(() => {
    if (contractInfo?.address) {
      return contractInfo.address as `0x${string}`;
    }
    return getContractAddress();
  }, [contractInfo?.address]);

  // 合约 ABI
  const contractABI = useMemo(() => {
    return contractInfo?.abi || [];
  }, [contractInfo?.abi]);

  // FHEVM 实例
  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, [address]);

  const isMockChain = chainId === 31337;
  const initialMockChains = isMockChain ? { 31337: "http://localhost:8545" } : undefined;

  const { instance: fhevmInstance, status: fhevmStatus } = useFhevm({
    provider,
    chainId: chainId || 11155111,
    initialMockChains,
    enabled: !!provider && !!address,
  });

  // Wagmi + ethers 互操作
  const { ethersSigner, ethersReadonlyProvider } = useWagmiEthers(initialMockChains);

  // FHE 加密和解密存储
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  // FHE 加密
  const { encryptWith } = useFHEEncryption({ 
    instance: fhevmInstance, 
    ethersSigner: ethersSigner as any, 
    contractAddress: contractAddress 
  });

  // ============ 部门管理 ============

  /**
   * 创建部门
   */
  const createDepartment = useCallback(
    async (name: string, budget: number) => {
      if (!fhevmInstance || !address || !contractAddress || !ethersSigner) {
        notification.error("请先连接钱包并初始化 FHEVM", { duration: 3000 });
        return;
      }

      try {
        const loadingId = notification.loading("正在加密预算并创建部门...", { duration: Infinity });

        // 使用 FHEVM SDK 加密预算
        const encryptionMethod = await encryptWith(budget, "uint32");
        if (!encryptionMethod) {
          throw new Error("加密失败");
        }

        // 调用合约
        await writeContract({
          address: contractAddress,
          abi: contractABI as any,
          functionName: "createDepartment",
          args: [name, encryptionMethod.encryptedData],
        });

        notification.remove(loadingId);
        notification.success("部门创建交易已提交，等待确认...", { duration: 3000 });
      } catch (error: any) {
        notification.error(`创建部门失败: ${error.message}`, { duration: 5000 });
        throw error;
      }
    },
    [fhevmInstance, address, contractAddress, ethersSigner, encryptWith, writeContract, contractABI]
  );

  /**
   * 添加员工
   */
  const addEmployee = useCallback(
    async (employeeAddress: string, name: string, role: number, departmentId: number) => {
      if (!address || !contractAddress) {
        notification.error("请先连接钱包", { duration: 3000 });
        return;
      }

      try {
        const loadingId = notification.loading("正在添加员工...", { duration: Infinity });

        await writeContract({
          address: contractAddress,
          abi: contractABI as any,
          functionName: "addEmployee",
          args: [employeeAddress, name, role, departmentId],
        });

        notification.remove(loadingId);
        notification.success("员工添加交易已提交，等待确认...", { duration: 3000 });
      } catch (error: any) {
        notification.error(`添加员工失败: ${error.message}`, { duration: 5000 });
        throw error;
      }
    },
    [address, contractAddress, writeContract, contractABI]
  );

  /**
   * 提交加密薪资
   */
  const submitSalary = useCallback(
    async (employeeAddress: string, amount: number) => {
      if (!fhevmInstance || !address || !contractAddress || !ethersSigner) {
        notification.error("请先连接钱包并初始化 FHEVM", { duration: 3000 });
        return;
      }

      try {
        const loadingId = notification.loading("正在加密薪资并提交...", { duration: Infinity });

        // 使用 FHEVM SDK 加密薪资
        const encryptionMethod = await encryptWith(amount, "uint32");
        if (!encryptionMethod) {
          throw new Error("加密失败");
        }

        // 调用合约
        await writeContract({
          address: contractAddress,
          abi: contractABI as any,
          functionName: "submitSalary",
          args: [employeeAddress, encryptionMethod.encryptedData],
        });

        notification.remove(loadingId);
        notification.success("薪资提交交易已提交，等待确认...", { duration: 3000 });
      } catch (error: any) {
        notification.error(`提交薪资失败: ${error.message}`, { duration: 5000 });
        throw error;
      }
    },
    [fhevmInstance, address, contractAddress, ethersSigner, encryptWith, writeContract, contractABI]
  );

  /**
   * 分配角色
   */
  const assignRole = useCallback(
    async (userAddress: string, role: number) => {
      if (!address || !contractAddress) {
        notification.error("请先连接钱包", { duration: 3000 });
        return;
      }

      try {
        const loadingId = notification.loading("正在分配角色...", { duration: Infinity });

        await writeContract({
          address: contractAddress,
          abi: contractABI as any,
          functionName: "assignRole",
          args: [userAddress, role],
        });

        notification.remove(loadingId);
        notification.success("角色分配交易已提交，等待确认...", { duration: 3000 });
      } catch (error: any) {
        notification.error(`分配角色失败: ${error.message}`, { duration: 5000 });
        throw error;
      }
    },
    [address, contractAddress, writeContract, contractABI]
  );

  // ============ 查询功能 ============

  /**
   * 获取部门总薪资（加密）
   */
  const getDepartmentTotalSalary = useCallback(
    async (departmentId: number): Promise<string | null> => {
      if (!contractAddress || !ethersReadonlyProvider) {
        notification.error("合约未配置或 Provider 未就绪", { duration: 3000 });
        return null;
      }

      try {
        const contract = new ethers.Contract(
          contractAddress,
          contractABI as any,
          ethersReadonlyProvider
        );

        const encryptedTotal = await contract.getDepartmentTotalSalary(departmentId);
        return encryptedTotal;
      } catch (error: any) {
        notification.error(`获取部门总薪资失败: ${error.message}`, { duration: 5000 });
        return null;
      }
    },
    [contractAddress, contractABI, ethersReadonlyProvider]
  );

  /**
   * 获取加密薪资
   */
  const getEncryptedSalary = useCallback(
    async (employeeAddress: string): Promise<string | null> => {
      if (!contractAddress || !ethersReadonlyProvider) {
        notification.error("合约未配置或 Provider 未就绪", { duration: 3000 });
        return null;
      }

      try {
        const contract = new ethers.Contract(
          contractAddress,
          contractABI as any,
          ethersReadonlyProvider
        );

        const encryptedSalary = await contract.getEncryptedSalary(employeeAddress);
        return encryptedSalary;
      } catch (error: any) {
        notification.error(`获取加密薪资失败: ${error.message}`, { duration: 5000 });
        return null;
      }
    },
    [contractAddress, contractABI, ethersReadonlyProvider]
  );

  /**
   * 解密薪资
   * 注意：实际解密需要在组件中使用 useFHEDecrypt Hook
   * 这里提供一个辅助函数用于准备解密请求
   */
  const prepareDecryptRequest = useCallback(
    (encryptedSalaryHandle: string) => {
      if (!encryptedSalaryHandle || encryptedSalaryHandle === ethers.ZeroHash || !contractAddress) {
        return undefined;
      }
      return [{ handle: encryptedSalaryHandle, contractAddress } as const];
    },
    [contractAddress]
  );

  // 监听交易确认
  useEffect(() => {
    if (isConfirmed) {
      notification.success("交易已确认！", { duration: 4000 });
    }
  }, [isConfirmed]);

  return {
    // 状态
    fhevmStatus,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    contractAddress,
    contractABI,
    hasContract: !!contractAddress && contractABI.length > 0,

    // 功能
    createDepartment,
    addEmployee,
    submitSalary,
    assignRole,
    getDepartmentTotalSalary,
    getEncryptedSalary,
    prepareDecryptRequest,
    
    // FHEVM 实例（供组件使用）
    fhevmInstance,
    ethersSigner,
    fhevmDecryptionSignatureStorage,
    chainId: chainId || 11155111,
  };
}
