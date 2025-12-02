"use client";

import { useFhevm } from "@fhevm-sdk";
import { useAccount } from "wagmi";
import { useMemo } from "react";

/**
 * 状态徽章组件
 * 展示 FHEVM 就绪状态和 Zama 关联
 */
export function StatusBadges() {
  const { address } = useAccount();
  
  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, [address]);

  const { status: fhevmStatus } = useFhevm({
    provider,
    chainId: 11155111,
    initialMockChains: {},
    enabled: !!provider && !!address,
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
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm bg-blue-500/20 border border-blue-400/50 text-blue-100">
          <span className="text-lg">🦊</span>
          <span className="text-sm font-semibold">Wallet Connected</span>
        </div>
      )}
    </div>
  );
}

