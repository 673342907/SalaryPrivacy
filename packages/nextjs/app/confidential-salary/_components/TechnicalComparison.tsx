"use client";

import { useState } from "react";
import { useLocale } from "~~/contexts/LocaleContext";

export function TechnicalComparison() {
  const { t } = useLocale();
  const [selectedView, setSelectedView] = useState<"traditional" | "fhe">("fhe");

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        🔬{" "}
        {t.locale === "en"
          ? "Technical Comparison: Traditional Method vs FHE Method"
          : "技术对比：传统方式 vs FHE 方式"}
      </h3>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedView("traditional")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedView === "traditional"
              ? "bg-red-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t.locale === "en" ? "Traditional Method" : "传统方式"}
        </button>
        <button
          onClick={() => setSelectedView("fhe")}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            selectedView === "fhe" ? "bg-green-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t.locale === "en" ? "FHE Method" : "FHE 方式"}
        </button>
      </div>

      {selectedView === "traditional" && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">❌</span>
            <h4 className="text-lg font-bold text-red-900">
              {t.locale === "en" ? "Problems with Traditional Method" : "传统方式的问题"}
            </h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-900 mb-1">1. {t.locale === "en" ? "Data Storage" : "数据存储"}</p>
              <p className="text-gray-700">
                {t.locale === "en"
                  ? "Salary data is stored in plaintext in database or blockchain"
                  : "薪资数据以明文形式存储在数据库或区块链上"}
              </p>
              <p className="text-red-600 mt-1">
                ⚠️{" "}
                {t.locale === "en"
                  ? "Anyone with database access can see all salaries"
                  : "任何能访问数据库的人都能看到所有薪资"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-900 mb-1">
                2. {t.locale === "en" ? "Statistical Analysis" : "统计分析"}
              </p>
              <p className="text-gray-700">
                {t.locale === "en"
                  ? "Need to decrypt all data first, then calculate"
                  : "需要先解密所有数据，然后进行计算"}
              </p>
              <p className="text-red-600 mt-1">
                ⚠️{" "}
                {t.locale === "en"
                  ? "Decryption process exposes all employees' privacy data"
                  : "解密过程暴露了所有员工的隐私数据"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-900 mb-1">
                3. {t.locale === "en" ? "Permission Control" : "权限控制"}
              </p>
              <p className="text-gray-700">
                {t.locale === "en"
                  ? "Relies on application-layer permission control, data itself is not encrypted"
                  : "依赖应用层权限控制，数据本身未加密"}
              </p>
              <p className="text-red-600 mt-1">
                ⚠️ {t.locale === "en" ? "Database leak will expose all data" : "数据库泄露会导致所有数据暴露"}
              </p>
            </div>
            <div className="bg-red-100 rounded-lg p-3 mt-4">
              <p className="font-semibold text-red-900">
                {t.locale === "en"
                  ? "Summary: Insufficient privacy protection, data leakage risk exists"
                  : "总结：隐私保护不足，存在数据泄露风险"}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedView === "fhe" && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">✅</span>
            <h4 className="text-lg font-bold text-green-900">
              {t.locale === "en" ? "Advantages of FHE Method" : "FHE 方式的优势"}
            </h4>
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-900 mb-1">1. {t.locale === "en" ? "Data Storage" : "数据存储"}</p>
              <p className="text-gray-700">
                {t.locale === "en"
                  ? "Salary data is stored in encrypted form on blockchain"
                  : "薪资数据以加密形式存储在区块链上"}
              </p>
              <p className="text-green-600 mt-1">
                ✅{" "}
                {t.locale === "en"
                  ? "Even if database is leaked, data remains encrypted"
                  : "即使数据库泄露，数据仍然是加密的"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-900 mb-1">
                2. {t.locale === "en" ? "Statistical Analysis" : "统计分析"}
              </p>
              <p className="text-gray-700">
                {t.locale === "en"
                  ? "Calculate directly on encrypted data, no need to decrypt raw data"
                  : "直接在加密数据上进行计算，无需解密原始数据"}
              </p>
              <p className="text-green-600 mt-1">
                ✅{" "}
                {t.locale === "en"
                  ? "No individual employee's salary is exposed during calculation"
                  : "计算过程中不暴露任何单个员工的薪资"}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-900 mb-1">
                3. {t.locale === "en" ? "Permission Control" : "权限控制"}
              </p>
              <p className="text-gray-700">
                {t.locale === "en"
                  ? "Data itself is encrypted, only authorized users can decrypt and view"
                  : "数据本身加密，只有授权用户才能解密查看"}
              </p>
              <p className="text-green-600 mt-1">
                ✅{" "}
                {t.locale === "en"
                  ? "Even if data is leaked, unauthorized users cannot decrypt"
                  : "即使数据泄露，未授权用户也无法解密"}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3 mt-4">
              <p className="font-semibold text-green-900">
                {t.locale === "en"
                  ? "Summary: Complete privacy protection, compliant with data protection regulations"
                  : "总结：完全隐私保护，符合数据保护法规"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Comparison */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-2">
            {t.locale === "en" ? "Traditional Method Process" : "传统方式流程"}
          </h5>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center">1</span>
              <span>{t.locale === "en" ? "Store plaintext salary data" : "存储明文薪资数据"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center">2</span>
              <span>{t.locale === "en" ? "Decrypt all data when statistics needed" : "需要统计时解密所有数据"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center">3</span>
              <span>{t.locale === "en" ? "Calculate statistics" : "计算统计结果"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center">4</span>
              <span className="text-red-600">❌ {t.locale === "en" ? "Privacy Leakage" : "隐私泄露"}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-2">
            {t.locale === "en" ? "FHE Method Process" : "FHE 方式流程"}
          </h5>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">1</span>
              <span>{t.locale === "en" ? "Store encrypted salary data" : "存储加密薪资数据"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">2</span>
              <span>{t.locale === "en" ? "Calculate directly on encrypted data" : "直接在加密数据上计算"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">3</span>
              <span>
                {t.locale === "en" ? "Decrypt statistics result (not raw data)" : "解密统计结果（不解密原始数据）"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">4</span>
              <span className="text-green-600">
                ✅ {t.locale === "en" ? "Complete Privacy Protection" : "完全隐私保护"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
