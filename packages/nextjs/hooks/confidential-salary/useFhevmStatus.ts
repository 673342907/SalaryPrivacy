"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import { useFhevm } from "@fhevm-sdk";

interface UseFhevmStatusOptions {
  chainId: number;
  isMockChain: boolean;
}

interface UseFhevmStatusReturn {
  relayerSDKReady: boolean;
  relayerSDKLoading: boolean;
  shouldEnableFhevm: boolean;
  fhevmStatus: "idle" | "loading" | "ready" | "error";
  fhevmError: Error | null;
  refreshFhevm: (() => void) | undefined;
  handleRetryFhevm: () => void;
}

/**
 * 自定义 Hook：管理 FHEVM 状态和初始化逻辑
 * 统一处理 Relayer SDK 检查、FHEVM 启用时机等复杂逻辑
 */
export function useFhevmStatus({ chainId, isMockChain }: UseFhevmStatusOptions): UseFhevmStatusReturn {
  const { address, chainId: wagmiChainId } = useAccount();
  const [relayerSDKReady, setRelayerSDKReady] = useState(false);
  const [relayerSDKLoading, setRelayerSDKLoading] = useState(false);
  const [shouldEnableFhevm, setShouldEnableFhevm] = useState(false);

  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, [address]);

  const initialMockChains = useMemo(() => {
    return isMockChain ? ({ 31337: "http://localhost:8545" } as const) : undefined;
  }, [isMockChain]);

  // 检查 Relayer SDK 状态（仅用于 Sepolia）
  useEffect(() => {
    if (typeof window === "undefined" || chainId !== 11155111) {
      setRelayerSDKReady(true);
      setRelayerSDKLoading(false);
      return;
    }

    const checkRelayerSDK = () => {
      const win = window as any;
      const isReady = !!(win.relayerSDK && typeof win.relayerSDK.initSDK === "function");

      setRelayerSDKReady((prev) => {
        if (isReady && !prev) {
          console.log("[useFhevmStatus] Relayer SDK is ready");
        } else if (!isReady && prev) {
          console.log("[useFhevmStatus] Relayer SDK became unavailable");
        }
        return isReady;
      });
      setRelayerSDKLoading(!isReady);
    };

    checkRelayerSDK();
    const interval = setInterval(checkRelayerSDK, 1000);
    return () => clearInterval(interval);
  }, [chainId]);

  // 控制 FHEVM 启用时机
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (!provider || !address) {
      setShouldEnableFhevm(false);
    } else if (isMockChain) {
      setShouldEnableFhevm(true);
    } else if (chainId === 11155111) {
      if (relayerSDKReady) {
        console.log("[useFhevmStatus] Relayer SDK ready, waiting 5 seconds before enabling FHEVM...");
        timer = setTimeout(() => {
          console.log("[useFhevmStatus] Enabling FHEVM for Sepolia");
          setShouldEnableFhevm(true);
        }, 5000);
      } else {
        setShouldEnableFhevm(false);
      }
    } else {
      setShouldEnableFhevm(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [provider, address, isMockChain, relayerSDKReady, chainId]);

  // 初始化 FHEVM
  const fhevmResult = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: shouldEnableFhevm,
  });

  const { status: fhevmStatus, error: fhevmError, refresh: refreshFhevm } = fhevmResult;

  // 手动重试 FHEVM 连接
  const handleRetryFhevm = () => {
    console.log("[useFhevmStatus] Manual retry FHEVM initialization");
    setShouldEnableFhevm(false);

    if (chainId === 11155111) {
      const win = window as any;
      if (!(win.relayerSDK && typeof win.relayerSDK.initSDK === "function")) {
        console.log("[useFhevmStatus] Relayer SDK not ready, waiting...");
        const checkSDK = setInterval(() => {
          if (win.relayerSDK && typeof win.relayerSDK.initSDK === "function") {
            clearInterval(checkSDK);
            console.log("[useFhevmStatus] Relayer SDK ready, enabling FHEVM in 5 seconds...");
            setTimeout(() => {
              setShouldEnableFhevm(true);
              refreshFhevm?.();
            }, 5000);
          }
        }, 500);

        setTimeout(() => {
          clearInterval(checkSDK);
          if (win.relayerSDK && typeof win.relayerSDK.initSDK === "function") {
            setShouldEnableFhevm(true);
            refreshFhevm?.();
          } else {
            console.error("[useFhevmStatus] Relayer SDK still not ready after timeout");
          }
        }, 10000);
      } else {
        setTimeout(() => {
          setShouldEnableFhevm(true);
          refreshFhevm?.();
        }, 5000);
      }
    } else {
      setTimeout(() => {
        setShouldEnableFhevm(true);
        refreshFhevm?.();
      }, 1000);
    }
  };

  return {
    relayerSDKReady,
    relayerSDKLoading,
    shouldEnableFhevm,
    fhevmStatus,
    fhevmError: fhevmError || null,
    refreshFhevm,
    handleRetryFhevm,
  };
}



