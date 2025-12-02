"use client";

import { useState } from "react";

/**
 * 技术架构图组件
 * 可视化展示 FHEVM 的技术架构和数据流
 */
export function ArchitectureDiagram() {
  const [selectedLayer, setSelectedLayer] = useState<"frontend" | "fhevm" | "blockchain">("fhevm");

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🏗️ 技术架构</h3>
      
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedLayer("frontend")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedLayer === "frontend"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          前端层
        </button>
        <button
          onClick={() => setSelectedLayer("fhevm")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedLayer === "fhevm"
              ? "bg-purple-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          FHEVM 层
        </button>
        <button
          onClick={() => setSelectedLayer("blockchain")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            selectedLayer === "blockchain"
              ? "bg-green-600 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          区块链层
        </button>
      </div>

      <div className="space-y-4">
        {/* Frontend Layer */}
        {selectedLayer === "frontend" && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💻</span>
              <h4 className="text-lg font-bold text-blue-900">前端层（React + Next.js）</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">用户界面</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 部门管理界面</li>
                  <li>• 员工管理界面</li>
                  <li>• 薪资提交界面</li>
                  <li>• 统计分析界面</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">钱包集成</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• RainbowKit 钱包连接</li>
                  <li>• Wagmi 状态管理</li>
                  <li>• 交易签名</li>
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
              <h4 className="text-lg font-bold text-purple-900">FHEVM 层（Zama FHEVM）</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">加密/解密</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 使用 FHE 加密薪资数据</li>
                  <li>• 授权用户解密查看</li>
                  <li>• 密钥管理</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">同态计算</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 加密数据加法运算</li>
                  <li>• 加密数据统计计算</li>
                  <li>• 无需解密原始数据</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>关键特性：</strong> FHEVM 是 Zama 开发的全同态加密虚拟机，
                允许在加密数据上直接进行计算，实现了"计算而不泄露"的隐私保护。
              </p>
            </div>
          </div>
        )}

        {/* Blockchain Layer */}
        {selectedLayer === "blockchain" && (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⛓️</span>
              <h4 className="text-lg font-bold text-green-900">区块链层（Ethereum/Sepolia）</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">智能合约</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 存储加密薪资数据</li>
                  <li>• 权限管理（RBAC）</li>
                  <li>• 同态计算执行</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">数据存储</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 加密数据永久存储</li>
                  <li>• 不可篡改</li>
                  <li>• 可审计性</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>重要：</strong> 智能合约只能看到加密后的数据，
                无法读取任何单个员工的原始薪资，确保了完全的隐私保护。
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Data Flow */}
      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">📊 数据流</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">1</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">用户输入薪资数据</p>
              <p className="text-xs text-gray-600">前端界面收集数据</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">FHEVM 加密数据</p>
              <p className="text-xs text-gray-600">使用 FHE 技术加密</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">3</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">存储到区块链</p>
              <p className="text-xs text-gray-600">智能合约存储加密数据</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">4</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">同态计算</p>
              <p className="text-xs text-gray-600">在加密数据上直接计算统计</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">5</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">授权解密</p>
              <p className="text-xs text-gray-600">只有授权用户才能解密查看</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

