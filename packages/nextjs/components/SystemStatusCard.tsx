"use client";

import { useAccount } from "wagmi";
import { useLocale } from "~~/contexts/LocaleContext";

interface SystemStatusCardProps {
  fhevmStatus: "idle" | "loading" | "ready" | "error";
  fhevmError: Error | null;
  chainId: number;
  relayerSDKReady: boolean;
  relayerSDKLoading: boolean;
  onRetry?: () => void;
}

/**
 * 系统状态卡片组件
 * 显示 FHEVM 连接、钱包地址、网络状态等信息
 */
export function SystemStatusCard({
  fhevmStatus,
  fhevmError,
  chainId,
  relayerSDKReady,
  relayerSDKLoading,
  onRetry,
}: SystemStatusCardProps) {
  const { t } = useLocale();
  const { address } = useAccount();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "loading":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return t.locale === "en" ? "✓ Connected" : "✓ 已连接";
      case "error":
        return t.locale === "en" ? "❌ Error" : "❌ 错误";
      case "loading":
        return t.locale === "en" ? "⏳ Connecting" : "⏳ 连接中";
      default:
        return t.locale === "en" ? "⏸️ Not Started" : "⏸️ 未启动";
    }
  };

  const getStatusMessage = () => {
    if (fhevmStatus === "ready") {
      return t.locale === "en" ? "FHEVM instance ready" : "FHEVM 实例已就绪";
    }
    if (fhevmStatus === "error") {
      return fhevmError?.message || (t.locale === "en" ? "FHEVM initialization failed" : "FHEVM 初始化失败");
    }
    if (fhevmStatus === "loading") {
      return t.locale === "en" ? "Initializing FHEVM..." : "正在初始化 FHEVM...";
    }
    if (!address) {
      return t.locale === "en" ? "Please connect wallet first" : "请先连接钱包";
    }
    if (chainId === 11155111 && relayerSDKLoading && !relayerSDKReady) {
      return t.locale === "en" ? "Loading Relayer SDK..." : "正在加载 Relayer SDK...";
    }
    return t.locale === "en" ? "Waiting for initialization..." : "等待初始化...";
  };

  const isRelayerError =
    fhevmError?.message &&
    (fhevmError.message.includes("relayerSDK") ||
      fhevmError.message.includes("Relayer") ||
      fhevmError.message.includes("Bad JSON") ||
      fhevmError.message.includes("response correctly") ||
      fhevmError.message.includes("didn't response"));

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-6 border border-white/20">
      <h3 className="text-xl font-bold text-white mb-4">{t.locale === "en" ? "System Status" : "系统状态"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* FHEVM 连接状态 */}
        <div className="p-4 border-2 border-white/20 rounded-lg bg-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-200">{t.locale === "en" ? "FHEVM Connection" : "FHEVM 连接"}</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fhevmStatus)}`}>
              {getStatusText(fhevmStatus)}
            </span>
          </div>
          <p className="text-xs text-gray-300">{getStatusMessage()}</p>

          {chainId === 11155111 && relayerSDKLoading && !relayerSDKReady && (
            <div className="mt-2 p-2 bg-yellow-50/50 border border-yellow-200/50 rounded text-xs">
              <p className="text-yellow-700">
                ⏳ {t.locale === "en" ? "Relayer SDK is loading. Please wait..." : "Relayer SDK 正在加载，请稍候..."}
              </p>
            </div>
          )}

          {fhevmError && (
            <div className="mt-2 p-3 bg-red-50/90 border-2 border-red-300 rounded-lg text-xs">
              <p className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span>{t.locale === "en" ? "Error Details:" : "错误详情:"}</span>
              </p>
              <p className="text-red-700 mb-3 font-medium">{fhevmError.message}</p>

              {isRelayerError && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <span>💡</span>
                    <span>{t.locale === "en" ? "Solution:" : "解决方案："}</span>
                  </p>
                  <div className="space-y-2 text-yellow-800">
                    <div className="font-semibold">
                      {t.locale === "en"
                        ? "Option 1 (Recommended): Use Local Hardhat Node"
                        : "方案 1（推荐）：使用本地 Hardhat 节点"}
                    </div>
                    <ol className="list-decimal list-inside ml-2 space-y-1 text-sm">
                      <li>
                        {t.locale === "en" ? "Start local Hardhat node:" : "启动本地 Hardhat 节点："}
                        <code className="ml-1 px-1.5 py-0.5 bg-yellow-100 rounded text-xs font-mono">pnpm chain</code>
                      </li>
                      <li>
                        {t.locale === "en"
                          ? "Switch MetaMask to Localhost network (Chain ID: 31337)"
                          : "在 MetaMask 中切换到本地网络（Chain ID: 31337）"}
                      </li>
                      <li>{t.locale === "en" ? "Refresh this page" : "刷新此页面"}</li>
                    </ol>

                    <div className="font-semibold mt-3">
                      {t.locale === "en"
                        ? "Option 2: Use Sepolia Testnet (Requires Relayer SDK)"
                        : "方案 2：使用 Sepolia 测试网（需要 Relayer SDK）"}
                    </div>
                    <ol className="list-decimal list-inside ml-2 space-y-1 text-sm">
                      <li>
                        {t.locale === "en"
                          ? "Click the 'Retry FHEVM Connection' button below"
                          : "点击下方的「重试 FHEVM 连接」按钮"}
                      </li>
                      <li>
                        {t.locale === "en"
                          ? "Wait 5-10 seconds for Relayer service to respond"
                          : "等待 5-10 秒让 Relayer 服务响应"}
                      </li>
                      <li>
                        {t.locale === "en" ? "If error persists, refresh the page" : "如果错误仍然存在，请刷新页面"}
                      </li>
                      <li>
                        {t.locale === "en"
                          ? "Check browser console (F12) for detailed logs"
                          : "检查浏览器控制台（F12）查看详细日志"}
                      </li>
                    </ol>
                  </div>

                  {onRetry && (
                    <div className="mt-3 pt-2 border-t border-yellow-300">
                      <button
                        onClick={onRetry}
                        disabled={fhevmStatus === "loading"}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors text-sm"
                      >
                        {fhevmStatus === "loading"
                          ? t.locale === "en"
                            ? "⏳ Retrying..."
                            : "⏳ 重试中..."
                          : t.locale === "en"
                            ? "🔄 Retry FHEVM Connection"
                            : "🔄 重试 FHEVM 连接"}
                      </button>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-yellow-300">
                    <p className="text-xs text-yellow-700">
                      <strong>{t.locale === "en" ? "Current Network:" : "当前网络:"}</strong>{" "}
                      {chainId === 31337
                        ? t.locale === "en"
                          ? "✅ Local Development (Recommended)"
                          : "✅ 本地开发（推荐）"
                        : chainId === 11155111
                          ? `⚠️ Sepolia (${chainId}) - ${t.locale === "en" ? "Requires Relayer SDK" : "需要 Relayer SDK"}`
                          : `❓ Chain ${chainId} - ${t.locale === "en" ? "Please switch to Localhost or Sepolia" : "请切换到本地网络或 Sepolia"}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 钱包地址 */}
        <div className="p-4 border-2 border-white/20 rounded-lg bg-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-100 font-medium">
              {t.locale === "en" ? "Wallet Address" : "钱包地址"}
            </span>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/40 text-blue-50 border border-blue-400/60">
              {address
                ? t.locale === "en"
                  ? "✓ Connected"
                  : "✓ 已连接"
                : t.locale === "en"
                  ? "Not Connected"
                  : "未连接"}
            </span>
          </div>
          <p className="text-xs text-gray-100 font-mono break-all font-medium">
            {address
              ? `${address.slice(0, 10)}...${address.slice(-8)}`
              : t.locale === "en"
                ? "Please connect wallet"
                : "请连接钱包"}
          </p>
        </div>

        {/* 网络状态 */}
        <div className="p-4 border-2 border-white/20 rounded-lg bg-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-200">{t.locale === "en" ? "Network" : "网络"}</span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                chainId === 11155111
                  ? "bg-purple-100 text-purple-800"
                  : chainId === 31337
                    ? "bg-green-100 text-green-800"
                    : "bg-orange-100 text-orange-800"
              }`}
            >
              {chainId === 11155111 ? "Sepolia" : chainId === 31337 ? "Localhost" : `Chain ${chainId}`}
            </span>
          </div>
          <p className="text-xs text-gray-300">
            {chainId === 11155111
              ? t.locale === "en"
                ? "Test Network (Requires Relayer SDK)"
                : "测试网络（需要 Relayer SDK）"
              : chainId === 31337
                ? t.locale === "en"
                  ? "Local Development Network (Hardhat)"
                  : "本地开发网络（Hardhat）"
                : t.locale === "en"
                  ? `Chain ${chainId} (Please switch to Sepolia or local network)`
                  : `Chain ${chainId}（请切换到 Sepolia 或本地网络）`}
          </p>
          {chainId === 11155111 && (
            <div className="mt-2 space-y-1">
              {relayerSDKLoading && !relayerSDKReady && (
                <p className="text-xs text-yellow-400 font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  {t.locale === "en" ? "Loading Relayer SDK..." : "正在加载 Relayer SDK..."}
                </p>
              )}
              {relayerSDKReady && (
                <p className="text-xs text-green-400 font-medium flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  {t.locale === "en" ? "Relayer SDK ready" : "Relayer SDK 已就绪"}
                </p>
              )}
              {fhevmStatus === "error" && (
                <p className="text-xs text-orange-400 font-medium">
                  ⚠️{" "}
                  {t.locale === "en"
                    ? "Sepolia requires Relayer SDK. If error persists, try refreshing the page or use local Hardhat node"
                    : "Sepolia 需要 Relayer SDK。如果错误持续，请尝试刷新页面或使用本地 Hardhat 节点"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
