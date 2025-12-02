"use client";

/**
 * 合规性徽章组件
 * 展示符合数据保护法规（GDPR、CCPA等）
 */
export function ComplianceBadge() {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">✅</div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">合规性认证</h3>
          <p className="text-sm text-gray-600">符合国际数据保护法规要求</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇪🇺</span>
            <h4 className="font-semibold text-gray-900">GDPR 合规</h4>
          </div>
          <p className="text-xs text-gray-600">
            符合欧盟《通用数据保护条例》，确保数据主体权利
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>✓ 数据最小化原则</li>
            <li>✓ 加密存储和处理</li>
            <li>✓ 访问控制</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇺🇸</span>
            <h4 className="font-semibold text-gray-900">CCPA 合规</h4>
          </div>
          <p className="text-xs text-gray-600">
            符合加州《消费者隐私法案》，保护消费者数据隐私
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>✓ 数据加密保护</li>
            <li>✓ 用户数据控制权</li>
            <li>✓ 透明度要求</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔐</span>
            <h4 className="font-semibold text-gray-900">零知识证明</h4>
          </div>
          <p className="text-xs text-gray-600">
            使用 FHE 技术，实现"计算而不泄露"
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>✓ 数据全程加密</li>
            <li>✓ 计算不解密</li>
            <li>✓ 完全隐私保护</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg p-4 border border-green-300">
        <p className="text-sm text-gray-700">
          <strong>为什么 FHE 技术符合法规要求？</strong>
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4 list-disc">
          <li>数据以加密形式存储，即使泄露也无法读取</li>
          <li>计算过程不暴露原始数据，满足数据最小化原则</li>
          <li>只有授权用户才能解密，确保访问控制</li>
          <li>区块链提供可审计性，满足透明度要求</li>
        </ul>
      </div>
    </div>
  );
}

