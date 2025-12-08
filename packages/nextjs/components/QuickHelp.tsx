"use client";

import { useState } from "react";
import { useLocale } from "~~/contexts/LocaleContext";

export function QuickHelp() {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const faqs = [
    {
      q: t.locale === "en" ? "How do I get started?" : "如何开始使用？",
      a:
        t.locale === "en"
          ? "1. Connect your wallet (MetaMask recommended)\n2. Switch to Sepolia testnet or local Hardhat network\n3. Click 'Generate Demo Data' in Dashboard to quickly experience all features"
          : "1. 连接钱包（推荐使用 MetaMask）\n2. 切换到 Sepolia 测试网或本地 Hardhat 网络\n3. 在 Dashboard 中点击「一键生成演示数据」快速体验所有功能",
    },
    {
      q: t.locale === "en" ? "Which network should I use?" : "应该使用哪个网络？",
      a:
        t.locale === "en"
          ? "For development: Use local Hardhat network (Chain ID: 31337). For testing: Use Sepolia testnet (Chain ID: 11155111). Sepolia requires Relayer SDK and may take longer to initialize."
          : "开发环境：使用本地 Hardhat 网络（Chain ID: 31337）。测试环境：使用 Sepolia 测试网（Chain ID: 11155111）。Sepolia 需要 Relayer SDK，初始化可能需要更长时间。",
    },
    {
      q: t.locale === "en" ? "What if FHEVM connection fails?" : "FHEVM 连接失败怎么办？",
      a:
        t.locale === "en"
          ? "1. Check your network connection\n2. For Sepolia: Wait 10-15 seconds for Relayer SDK to load, then click 'Retry FHEVM Connection'\n3. For local: Make sure Hardhat node is running (pnpm chain)"
          : "1. 检查网络连接\n2. Sepolia：等待 10-15 秒让 Relayer SDK 加载，然后点击「重试 FHEVM 连接」\n3. 本地：确保 Hardhat 节点正在运行（pnpm chain）",
    },
    {
      q: t.locale === "en" ? "How does encrypted salary work?" : "加密薪资是如何工作的？",
      a:
        t.locale === "en"
          ? "Salaries are encrypted using FHE (Fully Homomorphic Encryption) before storage. Only authorized users can decrypt. Statistical calculations can be performed without decrypting raw data."
          : "薪资使用 FHE（全同态加密）在存储前进行加密。只有授权用户可以解密。可以在不解密原始数据的情况下进行统计计算。",
    },
    {
      q: t.locale === "en" ? "What are the user roles?" : "有哪些用户角色？",
      a:
        t.locale === "en"
          ? "Admin: Full permissions\nHR: Can create departments, manage employees, submit salaries\nManager: Can view department data and statistics\nEmployee: Can only view own salary"
          : "Admin：完整权限\nHR：可以创建部门、管理员工、提交薪资\nManager：可以查看部门数据和统计\nEmployee：只能查看自己的薪资",
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl hover:scale-110"
        title={t.locale === "en" ? "Quick Help" : "快速帮助"}
      >
        ?
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>💡</span>
              {t.locale === "en" ? "Quick Help" : "快速帮助"}
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-all hover:scale-110"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">Q{index + 1}:</span>
                  {faq.q}
                </h3>
                <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>🔗</span>
              {t.locale === "en" ? "Quick Links" : "快速链接"}
            </h3>
            <div className="space-y-2 text-sm">
              <a
                href="https://docs.zama.ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                📚 {t.locale === "en" ? "FHEVM Documentation" : "FHEVM 文档"}
              </a>
              <a
                href="https://github.com/zama-ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 hover:underline"
              >
                🔧 {t.locale === "en" ? "FHEVM GitHub" : "FHEVM GitHub"}
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            {t.locale === "en" ? "Got it, thanks!" : "明白了，谢谢！"}
          </button>
        </div>
      </div>
    </div>
  );
}
