"use client";

import { useFhevm } from "@fhevm-sdk";
import { useAccount, useChainId } from "wagmi";
import { useMemo, useState, useEffect } from "react";

/**
 * 状态徽章组件
 * 展示 FHEVM 就绪状态和 Zama 关联
 */
export function StatusBadges() {
  const { address } = useAccount();
  const wagmiChainId = useChainId();
  
  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, [address]);

  // 使用 wagmi 的 chainId，如果没有则使用 Sepolia
  const chainId = wagmiChainId || 11155111;

  // 检查是否是 mock chain（本地开发）
  const isMockChain = chainId === 31337;
  
  // 对于真实网络（Sepolia），需要 relayer SDK
  // 对于 mock chain，使用本地 Hardhat 节点
  const initialMockChains = isMockChain ? { 31337: "http://localhost:8545" } : {};

  // 检查 Relayer SDK 是否已加载（用于 Sepolia）
  const [relayerSDKReady, setRelayerSDKReady] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined" && chainId === 11155111) {
      const checkRelayerSDK = () => {
        const win = window as any;
        if (win.relayerSDK && typeof win.relayerSDK.initSDK === "function") {
          setRelayerSDKReady(true);
        } else {
          setRelayerSDKReady(false);
        }
      };
      
      checkRelayerSDK();
      // 定期检查（因为 SDK 是异步加载的）
      const interval = setInterval(checkRelayerSDK, 1000);
      return () => clearInterval(interval);
    } else {
      setRelayerSDKReady(true); // Mock chain 不需要 Relayer SDK
    }
  }, [chainId]);

  // 只有在条件满足时才启用 FHEVM，避免初始化错误
  const shouldEnableFhevm = useMemo(() => {
    if (!provider) return false;
    if (!address) return false;
    if (isMockChain) return true; // Mock chain 总是可以启用
    return relayerSDKReady; // Sepolia 需要 SDK 就绪
  }, [provider, address, isMockChain, relayerSDKReady]);

  const { status: fhevmStatus } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: shouldEnableFhevm,
  });

  return (
    <div className="absolute top-4 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: FHEVM Ready Badge */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm border ${
        fhevmStatus === "ready"
          ? "bg-green-500/20 border-green-400/50 text-green-100"
          : fhevmStatus === "loading"
          ? "bg-yellow-500/20 border-yellow-400/50 text-yellow-100"
          : fhevmStatus === "error"
          ? "bg-red-500/20 border-red-400/50 text-red-100"
          : "bg-gray-500/20 border-gray-400/50 text-gray-100"
      }`}>
        {fhevmStatus === "ready" ? (
          <>
            <span className="text-lg">✓</span>
            <span className="text-sm font-semibold">FHEVM Ready</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </>
        ) : fhevmStatus === "loading" ? (
          <>
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">FHEVM Loading</span>
          </>
        ) : fhevmStatus === "error" ? (
          <>
            <span className="text-lg">⚠</span>
            <span className="text-sm font-semibold">FHEVM Error</span>
          </>
        ) : (
          <>
            <span className="text-lg">○</span>
            <span className="text-sm font-semibold">FHEVM Idle</span>
          </>
        )}
      </div>

      {/* Center: Zama FHEVM Powered Badge */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm bg-gray-800/40 border border-gray-600/50 text-white">
        <span className="text-lg">🎨</span>
        <span className="text-xs font-bold uppercase tracking-wide">ZAMA FHEVM POWERED</span>
      </div>

      {/* Right: Wallet Icon (if connected) */}
      {address && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm bg-blue-500/30 border border-blue-400/60 text-blue-50">
          <span className="text-lg">🦊</span>
          <span className="text-sm font-semibold">Wallet Connected</span>
        </div>
      )}
    </div>
  );
}

