"use client";

import { useState } from "react";
import { useLocale } from "~~/contexts/LocaleContext";

/**
 * 安全性证明组件
 * 展示加密数据的不可读性，证明隐私保护的有效性
 */
export function SecurityProof() {
  const { t } = useLocale();
  const [selectedProof, setSelectedProof] = useState<"encrypted" | "decrypted">("encrypted");

  const encryptedData = "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890";
  const decryptedData = "50000 ETH";

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            🔒 {t.locale === "en" ? "Security Proof" : "安全性证明"}
          </h3>
          <p className="text-sm text-gray-600">
            {t.locale === "en"
              ? "Demonstrates the unreadability of encrypted data and proves the effectiveness of privacy protection"
              : "展示加密数据的不可读性，证明隐私保护的有效性"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedProof("encrypted")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedProof === "encrypted"
                ? "bg-red-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t.locale === "en" ? "Encrypted Data" : "加密数据"}
          </button>
          <button
            onClick={() => setSelectedProof("decrypted")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              selectedProof === "decrypted"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {t.locale === "en" ? "Decrypted Data (Authorized Users Only)" : "解密数据（仅授权用户）"}
          </button>
        </div>
      </div>

      {selectedProof === "encrypted" && (
        <div className="bg-white rounded-lg p-6 border-2 border-red-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔐</span>
            <div>
              <h4 className="font-bold text-gray-900">
                {t.locale === "en" ? "Encrypted Data on Blockchain" : "区块链上的加密数据"}
              </h4>
              <p className="text-sm text-gray-600">
                {t.locale === "en" ? "Anyone can see it, but cannot read it" : "任何人都可以看到，但无法读取"}
              </p>
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 break-all">{encryptedData}</div>
          <div className="mt-4 p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>❌ {t.locale === "en" ? "Cannot Read:" : "无法读取："}</strong>{" "}
              {t.locale === "en"
                ? "Even if you see this data, you cannot know the original salary. Only authorized users with the decryption key can view it."
                : "即使您看到这个数据，也无法知道原始薪资是多少。只有拥有解密密钥的授权用户才能解密查看。"}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-gray-900">{t.locale === "en" ? "Smart Contract" : "智能合约"}</div>
              <div className="text-red-600 mt-1">❌ {t.locale === "en" ? "Cannot Read" : "无法读取"}</div>
            </div>
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-gray-900">
                {t.locale === "en" ? "Unauthorized User" : "未授权用户"}
              </div>
              <div className="text-red-600 mt-1">❌ {t.locale === "en" ? "Cannot Read" : "无法读取"}</div>
            </div>
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-gray-900">{t.locale === "en" ? "Database Leak" : "数据库泄露"}</div>
              <div className="text-green-600 mt-1">✅ {t.locale === "en" ? "Still Encrypted" : "仍然加密"}</div>
            </div>
          </div>
        </div>
      )}

      {selectedProof === "decrypted" && (
        <div className="bg-white rounded-lg p-6 border-2 border-green-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔓</span>
            <div>
              <h4 className="font-bold text-gray-900">
                {t.locale === "en"
                  ? "Decrypted Data (Visible to Authorized Users Only)"
                  : "解密后的数据（仅授权用户可见）"}
              </h4>
              <p className="text-sm text-gray-600">
                {t.locale === "en" ? "Only users with permissions can see it" : "只有拥有权限的用户才能看到"}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 text-center border-2 border-green-300">
            <div className="text-4xl font-bold text-green-700 mb-2">{decryptedData}</div>
            <p className="text-sm text-gray-600">
              {t.locale === "en" ? "Employee Salary (Decrypted)" : "员工薪资（已解密）"}
            </p>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>✅ {t.locale === "en" ? "Visible to Authorized Users Only:" : "仅授权用户可见："}</strong>{" "}
              {t.locale === "en"
                ? "Only the employee themselves, HR, or Manager (based on permissions) can decrypt and view. Smart contracts and unauthorized users cannot see this data."
                : "只有员工本人、HR 或 Manager（根据权限）才能解密查看。智能合约和未授权用户无法看到这个数据。"}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-gray-900">{t.locale === "en" ? "Employee" : "员工本人"}</div>
              <div className="text-green-600 mt-1">✅ {t.locale === "en" ? "Can View" : "可以查看"}</div>
            </div>
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-gray-900">HR/Manager</div>
              <div className="text-green-600 mt-1">✅ {t.locale === "en" ? "Can View" : "可以查看"}</div>
            </div>
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-gray-900">{t.locale === "en" ? "Other Users" : "其他用户"}</div>
              <div className="text-red-600 mt-1">❌ {t.locale === "en" ? "Cannot View" : "无法查看"}</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 {t.locale === "en" ? "Key Point:" : "关键点："}</strong>{" "}
          {t.locale === "en"
            ? 'FHE technology ensures data is computed in an encrypted state, so even smart contracts cannot see the original data, achieving true "computation without leakage".'
            : 'FHE 技术确保数据在加密状态下进行计算，即使智能合约也无法看到原始数据，实现了真正的"计算而不泄露"。'}
        </p>
      </div>
    </div>
  );
}
