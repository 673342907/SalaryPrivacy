"use client";

/**
 * Zama/FHEVM 关联展示组件
 * 展示项目与 Zama FHEVM 的关联，突出技术来源
 */
export function ZamaConnection() {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">🔬</div>
        <div>
          <h3 className="text-2xl font-bold mb-1">基于 Zama FHEVM 技术</h3>
          <p className="text-indigo-100">Powered by Zama's Fully Homomorphic Encryption Virtual Machine</p>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <p className="text-sm text-white/90 mb-3">
          <strong>关于 Zama：</strong> Zama 是 FHE（全同态加密）技术的领先开发者，
          致力于让隐私保护成为默认设置。
        </p>
        <div className="flex items-center gap-4 text-sm">
          <a
            href="https://www.zama.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors underline"
          >
            <span>🌐</span>
            <span>zama.ai</span>
          </a>
          <a
            href="https://x.com/zama"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors underline"
          >
            <span>🐦</span>
            <span>@zama</span>
          </a>
          <a
            href="https://github.com/zama-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors underline"
          >
            <span>💻</span>
            <span>GitHub</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-semibold mb-2">🔐 FHEVM 核心能力</h4>
          <ul className="text-sm text-white/90 space-y-1">
            <li>• 在加密数据上直接计算</li>
            <li>• 无需解密即可进行统计分析</li>
            <li>• 完全保护数据隐私</li>
            <li>• 支持复杂的同态运算</li>
          </ul>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-semibold mb-2">🚀 技术优势</h4>
          <ul className="text-sm text-white/90 space-y-1">
            <li>• 企业级安全标准</li>
            <li>• 区块链原生集成</li>
            <li>• 开发者友好 API</li>
            <li>• 活跃的开源社区</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 bg-white/20 rounded-lg p-3 text-center">
        <p className="text-sm text-white/90">
          <strong>使命：</strong> 让隐私保护成为默认设置，而不是可选项
        </p>
      </div>
    </div>
  );
}

