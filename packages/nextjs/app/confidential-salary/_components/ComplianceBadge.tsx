"use client";

import { useLocale } from "~~/contexts/LocaleContext";

/**
 * 合规性徽章组件
 * 展示符合数据保护法规（GDPR、CCPA等）
 */
export function ComplianceBadge() {
  const { t } = useLocale();
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl">✅</div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t.locale === "en" ? "Compliance Certification" : "合规性认证"}</h3>
          <p className="text-sm text-gray-600">{t.locale === "en" ? "Meets international data protection regulatory requirements" : "符合国际数据保护法规要求"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇪🇺</span>
            <h4 className="font-semibold text-gray-900">GDPR {t.locale === "en" ? "Compliance" : "合规"}</h4>
          </div>
          <p className="text-xs text-gray-600">
            {t.locale === "en" ? "Complies with EU General Data Protection Regulation, ensuring data subject rights" : "符合欧盟《通用数据保护条例》，确保数据主体权利"}
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>✓ {t.locale === "en" ? "Data minimization principle" : "数据最小化原则"}</li>
            <li>✓ {t.locale === "en" ? "Encrypted storage and processing" : "加密存储和处理"}</li>
            <li>✓ {t.locale === "en" ? "Access control" : "访问控制"}</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🇺🇸</span>
            <h4 className="font-semibold text-gray-900">CCPA {t.locale === "en" ? "Compliance" : "合规"}</h4>
          </div>
          <p className="text-xs text-gray-600">
            {t.locale === "en" ? "Complies with California Consumer Privacy Act, protecting consumer data privacy" : "符合加州《消费者隐私法案》，保护消费者数据隐私"}
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>✓ {t.locale === "en" ? "Data encryption protection" : "数据加密保护"}</li>
            <li>✓ {t.locale === "en" ? "User data control rights" : "用户数据控制权"}</li>
            <li>✓ {t.locale === "en" ? "Transparency requirements" : "透明度要求"}</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔐</span>
            <h4 className="font-semibold text-gray-900">{t.locale === "en" ? "Zero-Knowledge Proof" : "零知识证明"}</h4>
          </div>
          <p className="text-xs text-gray-600">
            {t.locale === "en" ? "Uses FHE technology to achieve \"computation without leakage\"" : "使用 FHE 技术，实现\"计算而不泄露\""}
          </p>
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>✓ {t.locale === "en" ? "End-to-end data encryption" : "数据全程加密"}</li>
            <li>✓ {t.locale === "en" ? "Computation without decryption" : "计算不解密"}</li>
            <li>✓ {t.locale === "en" ? "Complete privacy protection" : "完全隐私保护"}</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg p-4 border border-green-300">
        <p className="text-sm text-gray-700">
          <strong>{t.locale === "en" ? "Why does FHE technology meet regulatory requirements?" : "为什么 FHE 技术符合法规要求？"}</strong>
        </p>
        <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4 list-disc">
          <li>{t.locale === "en" ? "Data is stored in encrypted form, unreadable even if leaked" : "数据以加密形式存储，即使泄露也无法读取"}</li>
          <li>{t.locale === "en" ? "Computation process does not expose raw data, satisfying the data minimization principle" : "计算过程不暴露原始数据，满足数据最小化原则"}</li>
          <li>{t.locale === "en" ? "Only authorized users can decrypt, ensuring access control" : "只有授权用户才能解密，确保访问控制"}</li>
          <li>{t.locale === "en" ? "Blockchain provides auditability, satisfying transparency requirements" : "区块链提供可审计性，满足透明度要求"}</li>
        </ul>
      </div>
    </div>
  );
}
