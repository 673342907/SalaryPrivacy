"use client";

import { useState } from "react";
import { useLocale } from "~~/contexts/LocaleContext";

/**
 * 技术架构图组件
 * 可视化展示 FHEVM 的技术架构和数据流
 */
export function ArchitectureDiagram() {
  const { t } = useLocale();
  const [selectedLayer, setSelectedLayer] = useState<"frontend" | "fhevm" | "blockchain">("fhevm");

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        🏗️ {t.locale === "en" ? "Technical Architecture" : "技术架构"}
      </h3>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedLayer("frontend")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedLayer === "frontend"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t.locale === "en" ? "Frontend Layer" : "前端层"}
        </button>
        <button
          onClick={() => setSelectedLayer("fhevm")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedLayer === "fhevm"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t.locale === "en" ? "FHEVM Layer" : "FHEVM 层"}
        </button>
        <button
          onClick={() => setSelectedLayer("blockchain")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedLayer === "blockchain"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {t.locale === "en" ? "Blockchain Layer" : "区块链层"}
        </button>
      </div>

      <div className="space-y-4">
        {/* Frontend Layer */}
        {selectedLayer === "frontend" && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💻</span>
              <h4 className="text-lg font-bold text-blue-900">
                {t.locale === "en" ? "Frontend Layer (React + Next.js)" : "前端层（React + Next.js）"}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  {t.locale === "en" ? "User Interface" : "用户界面"}
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t.locale === "en" ? "Department Management Interface" : "部门管理界面"}</li>
                  <li>• {t.locale === "en" ? "Employee Management Interface" : "员工管理界面"}</li>
                  <li>• {t.locale === "en" ? "Salary Submission Interface" : "薪资提交界面"}</li>
                  <li>• {t.locale === "en" ? "Statistical Analysis Interface" : "统计分析界面"}</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  {t.locale === "en" ? "Wallet Integration" : "钱包集成"}
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t.locale === "en" ? "RainbowKit Wallet Connection" : "RainbowKit 钱包连接"}</li>
                  <li>• {t.locale === "en" ? "Wagmi State Management" : "Wagmi 状态管理"}</li>
                  <li>• {t.locale === "en" ? "Transaction Signing" : "交易签名"}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FHEVM Layer */}
        {selectedLayer === "fhevm" && (
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🔐</span>
              <h4 className="text-lg font-bold text-purple-900">
                {t.locale === "en" ? "FHEVM Layer (Zama FHEVM)" : "FHEVM 层（Zama FHEVM）"}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  {t.locale === "en" ? "Encryption/Decryption" : "加密/解密"}
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t.locale === "en" ? "Use FHE to encrypt salary data" : "使用 FHE 加密薪资数据"}</li>
                  <li>• {t.locale === "en" ? "Authorized users decrypt and view" : "授权用户解密查看"}</li>
                  <li>• {t.locale === "en" ? "Key management" : "密钥管理"}</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  {t.locale === "en" ? "Homomorphic Computation" : "同态计算"}
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t.locale === "en" ? "Encrypted data addition operations" : "加密数据加法运算"}</li>
                  <li>• {t.locale === "en" ? "Encrypted data statistical computation" : "加密数据统计计算"}</li>
                  <li>• {t.locale === "en" ? "No need to decrypt raw data" : "无需解密原始数据"}</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>{t.locale === "en" ? "Key Features:" : "关键特性："}</strong>{" "}
                {t.locale === "en"
                  ? 'FHEVM is a fully homomorphic encryption virtual machine developed by Zama, allowing direct computation on encrypted data, achieving privacy protection of "computation without leakage".'
                  : 'FHEVM 是 Zama 开发的全同态加密虚拟机，允许在加密数据上直接进行计算，实现了"计算而不泄露"的隐私保护。'}
              </p>
            </div>
          </div>
        )}

        {/* Blockchain Layer */}
        {selectedLayer === "blockchain" && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⛓️</span>
              <h4 className="text-lg font-bold text-green-900">
                {t.locale === "en" ? "Blockchain Layer (Ethereum/Sepolia)" : "区块链层（Ethereum/Sepolia）"}
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">
                  {t.locale === "en" ? "Smart Contract" : "智能合约"}
                </h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t.locale === "en" ? "Store encrypted salary data" : "存储加密薪资数据"}</li>
                  <li>• {t.locale === "en" ? "Permission management (RBAC)" : "权限管理（RBAC）"}</li>
                  <li>• {t.locale === "en" ? "Homomorphic computation execution" : "同态计算执行"}</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">{t.locale === "en" ? "Data Storage" : "数据存储"}</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t.locale === "en" ? "Encrypted data permanent storage" : "加密数据永久存储"}</li>
                  <li>• {t.locale === "en" ? "Immutable" : "不可篡改"}</li>
                  <li>• {t.locale === "en" ? "Auditable" : "可审计性"}</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>{t.locale === "en" ? "Important:" : "重要："}</strong>{" "}
                {t.locale === "en"
                  ? "Smart contracts can only see encrypted data, cannot read any individual employee's original salary, ensuring complete privacy protection."
                  : "智能合约只能看到加密后的数据，无法读取任何单个员工的原始薪资，确保了完全的隐私保护。"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Data Flow */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">📊 {t.locale === "en" ? "Data Flow" : "数据流"}</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {t.locale === "en" ? "User Input Salary Data" : "用户输入薪资数据"}
              </p>
              <p className="text-xs text-gray-600">
                {t.locale === "en" ? "Frontend interface collects data" : "前端界面收集数据"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {t.locale === "en" ? "FHEVM Encrypts Data" : "FHEVM 加密数据"}
              </p>
              <p className="text-xs text-gray-600">
                {t.locale === "en" ? "Encrypts using FHE technology" : "使用 FHE 技术加密"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {t.locale === "en" ? "Store to Blockchain" : "存储到区块链"}
              </p>
              <p className="text-xs text-gray-600">
                {t.locale === "en" ? "Smart contract stores encrypted data" : "智能合约存储加密数据"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {t.locale === "en" ? "Homomorphic Computation" : "同态计算"}
              </p>
              <p className="text-xs text-gray-600">
                {t.locale === "en" ? "Directly compute statistics on encrypted data" : "在加密数据上直接计算统计"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
              5
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {t.locale === "en" ? "Authorized Decryption" : "授权解密"}
              </p>
              <p className="text-xs text-gray-600">
                {t.locale === "en" ? "Only authorized users can decrypt and view" : "只有授权用户才能解密查看"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
