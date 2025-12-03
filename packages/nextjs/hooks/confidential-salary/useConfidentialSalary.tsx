"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useFhevm, useFHEEncryption, useFHEDecrypt } from "@fhevm-sdk";
import { ethers } from "ethers";
import { notification } from "~~/utils/helper/notification";

// 合约 ABI（简化版，实际应从部署的合约获取）
const CONFIDENTIAL_SALARY_ABI = [
  "function createDepartment(string memory name, bytes calldata encryptedBudget) public returns (uint256)",
  "function addEmployee(address employeeAddress, string memory name, uint8 role, uint256 departmentId) public",
  "function submitSalary(address employeeAddress, bytes calldata encryptedSalary) public",
  "function getDepartmentTotalSalary(uint256 departmentId) public view returns (bytes memory)",
  "function getDepartmentAverageSalary(uint256 departmentId) public view returns (bytes memory)",
  "function checkBudgetCompliance(uint256 departmentId) public view returns (bytes memory)",
  "function getEncryptedSalary(address employeeAddress) public view returns (bytes memory)",
  "function assignRole(address user, uint8 role) public",
  "function roles(address) public view returns (uint8)",
  "event DepartmentCreated(uint256 indexed departmentId, string name)",
  "event EmployeeAdded(address indexed employee, string name, uint8 role, uint256 departmentId)",
  "event SalarySubmitted(address indexed employee, uint256 departmentId)",
] as const;

// 合约地址（部署后更新）
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

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

  // FHEVM 实例
  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, [address]);

  const { instance: fhevmInstance, status: fhevmStatus } = useFhevm({
    provider,
    chainId: chainId || 11155111,
    enabled: !!provider && !!address,
  });

  // FHE 加密和解密
  const { encrypt } = useFHEEncryption({ instance: fhevmInstance });
  const { decrypt } = useFHEDecrypt({ instance: fhevmInstance });

  // ============ 部门管理 ============

  /**
   * 创建部门
   */
  const createDepartment = useCallback(
    async (name: string, budget: number) => {
      if (!fhevmInstance || !address) {
        notification.error("请先连接钱包并初始化 FHEVM", { duration: 3000 });
        return;
      }

      try {
        const loadingId = notification.loading("正在加密预算并创建部门...", { duration: Infinity });

        // 加密预算
        const encryptedBudget = await encrypt(budget, "uint32");

        // 调用合约
        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONFIDENTIAL_SALARY_ABI,
          functionName: "createDepartment",
          args: [name, encryptedBudget],
        });

        notification.remove(loadingId);
        notification.success("部门创建交易已提交，等待确认...", { duration: 3000 });
      } catch (error: any) {
        notification.error(`创建部门失败: ${error.message}`, { duration: 5000 });
        throw error;
      }
    },
    [fhevmInstance, address, encrypt, writeContract]
  );

  /**
   * 添加员工
   */
  const addEmployee = useCallback(
    async (employeeAddress: string, name: string, role: number, departmentId: number) => {
      if (!address) {
        notification.error("请先连接钱包", { duration: 3000 });
        return;
      }

      try {
        const loadingId = notification.loading("正在添加员工...", { duration: Infinity });

        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONFIDENTIAL_SALARY_ABI,
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
    [address, writeContract]
  );

  /**
   * 提交加密薪资
   */
  const submitSalary = useCallback(
    async (employeeAddress: string, amount: number) => {
      if (!fhevmInstance || !address) {
        notification.error("请先连接钱包并初始化 FHEVM", { duration: 3000 });
        return;
      }

      try {
        const loadingId = notification.loading("正在加密薪资并提交...", { duration: Infinity });

        // 加密薪资
        const encryptedSalary = await encrypt(amount, "uint32");

        // 调用合约
        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONFIDENTIAL_SALARY_ABI,
          functionName: "submitSalary",
          args: [employeeAddress, encryptedSalary],
        });

        notification.remove(loadingId);
        notification.success("薪资提交交易已提交，等待确认...", { duration: 3000 });
      } catch (error: any) {
        notification.error(`提交薪资失败: ${error.message}`, { duration: 5000 });
        throw error;
      }
    },
    [fhevmInstance, address, encrypt, writeContract]
  );

  /**
   * 分配角色
   */
  const assignRole = useCallback(
    async (userAddress: string, role: number) => {
      if (!address) {
        notification.error("请先连接钱包", { duration: 3000 });
        return;
      }

      try {
        const loadingId = notification.loading("正在分配角色...", { duration: Infinity });

        await writeContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: CONFIDENTIAL_SALARY_ABI,
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
    [address, writeContract]
  );

  // ============ 查询功能 ============

  /**
   * 获取部门总薪资（加密）
   */
  const getDepartmentTotalSalary = useCallback(
    async (departmentId: number) => {
      if (!fhevmInstance) {
        notification.error("FHEVM 未初始化", { duration: 3000 });
        return null;
      }

      try {
        // 这里需要使用 ethers 直接调用合约
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONFIDENTIAL_SALARY_ABI, signer);

        const encryptedTotal = await contract.getDepartmentTotalSalary(departmentId);
        return encryptedTotal;
      } catch (error: any) {
        notification.error(`获取部门总薪资失败: ${error.message}`, { duration: 5000 });
        return null;
      }
    },
    [fhevmInstance]
  );

  /**
   * 解密薪资
   */
  const decryptSalary = useCallback(
    async (encryptedSalary: string) => {
      if (!fhevmInstance) {
        notification.error("FHEVM 未初始化", { duration: 3000 });
        return null;
      }

      try {
        const decrypted = await decrypt(encryptedSalary, "uint32");
        return Number(decrypted);
      } catch (error: any) {
        notification.error(`解密薪资失败: ${error.message}`, { duration: 5000 });
        return null;
      }
    },
    [fhevmInstance, decrypt]
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

    // 功能
    createDepartment,
    addEmployee,
    submitSalary,
    assignRole,
    getDepartmentTotalSalary,
    decryptSalary,
  };
}

