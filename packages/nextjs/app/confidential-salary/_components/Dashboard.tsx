"use client";

import { useAccount } from "wagmi";
import { useMemo } from "react";
import { useFhevm } from "@fhevm-sdk";

export function ConfidentialSalaryDashboard() {
  const { address } = useAccount();

  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    return (window as any).ethereum;
  }, []);

  const { instance: fhevmInstance, status: fhevmStatus } = useFhevm({
    provider,
    chainId: 11155111, // Sepolia
    initialMockChains: {},
    enabled: true,
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">欢迎使用 ConfidentialSalary</h2>
        <p className="text-blue-100 text-lg">
          基于 FHEVM 的企业级隐私保护薪资管理系统
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            🔐 全同态加密保护
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            👥 角色权限管理
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            📊 加密统计分析
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">总员工数</p>
              <p className="text-3xl font-bold text-gray-900">-</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">部门数量</p>
              <p className="text-3xl font-bold text-gray-900">-</p>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">总薪资（加密）</p>
              <p className="text-3xl font-bold text-gray-900">🔒</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
            <div className="text-2xl mb-2">➕</div>
            <div className="font-semibold text-gray-900">创建部门</div>
            <div className="text-sm text-gray-600">添加新部门</div>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
            <div className="text-2xl mb-2">👤</div>
            <div className="font-semibold text-gray-900">添加员工</div>
            <div className="text-sm text-gray-600">注册新员工</div>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
            <div className="text-2xl mb-2">💵</div>
            <div className="font-semibold text-gray-900">提交薪资</div>
            <div className="text-sm text-gray-600">加密提交薪资</div>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-900">查看统计</div>
            <div className="text-sm text-gray-600">加密统计分析</div>
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">系统状态</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">FHEVM 连接</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              fhevmInstance ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {fhevmInstance ? "✅ 已连接" : "❌ 未连接"}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">钱包地址</span>
            <span className="font-mono text-sm text-gray-900">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "未连接"}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">网络</span>
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              Sepolia Testnet
            </span>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">核心功能</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🔐</div>
            <h4 className="font-semibold text-gray-900 mb-1">全同态加密</h4>
            <p className="text-sm text-gray-600">
              所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-semibold text-gray-900 mb-1">权限管理</h4>
            <p className="text-sm text-gray-600">
              基于角色的访问控制：Admin、HR、Manager、Employee 不同权限
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold text-gray-900 mb-1">统计分析</h4>
            <p className="text-sm text-gray-600">
              在不解密原始数据的情况下计算平均值、总和、分布等统计信息
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🏢</div>
            <h4 className="font-semibold text-gray-900 mb-1">组织管理</h4>
            <p className="text-sm text-gray-600">
              完整的部门管理、员工管理、预算管理和合规检查功能
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

