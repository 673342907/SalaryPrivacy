"use client";

import { useAccount } from "wagmi";
import { useMemo, useState } from "react";
import { useFhevm } from "@fhevm-sdk";
import { DemoDataGenerator } from "./DemoDataGenerator";

interface ConfidentialSalaryDashboardProps {
  onStartGuide?: () => void;
}

export function ConfidentialSalaryDashboard({ onStartGuide }: ConfidentialSalaryDashboardProps) {
  const { address } = useAccount();
  const [demoData, setDemoData] = useState<any>(null);

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
        <p className="text-blue-100 text-lg mb-4">
          基于 FHEVM 的企业级隐私保护薪资管理系统
        </p>
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-50">
            <strong>💡 使用提示：</strong> 通过顶部导航栏可以访问所有功能模块。每个模块都有详细的功能说明和操作指引。
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm flex-wrap">
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

      {/* Demo Data Generator */}
      <DemoDataGenerator 
        onGenerate={(data) => {
          setDemoData(data);
          // 可以在这里触发其他组件的更新
          alert(`演示数据已生成！\n- ${data.departments.length} 个部门\n- ${data.employees.length} 名员工\n- ${data.salaries.length} 条薪资记录\n\n请前往对应模块查看！`);
        }}
      />

      {/* Quick Guide */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <span className="mr-2">📖</span>
            快速开始指南
          </h3>
          {onStartGuide && (
            <button
              onClick={onStartGuide}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md"
            >
              🎯 开始引导
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start">
            <span className="text-2xl mr-3">1️⃣</span>
            <div>
              <strong className="text-gray-900">创建部门</strong>
              <p className="text-gray-600">在"部门管理"中创建公司部门，设置加密预算</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">2️⃣</span>
            <div>
              <strong className="text-gray-900">添加员工</strong>
              <p className="text-gray-600">在"员工管理"中添加员工，分配角色和部门</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">3️⃣</span>
            <div>
              <strong className="text-gray-900">提交薪资</strong>
              <p className="text-gray-600">在"薪资管理"中加密提交员工薪资数据</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-2xl mr-3">4️⃣</span>
            <div>
              <strong className="text-gray-900">统计分析</strong>
              <p className="text-gray-600">在"统计分析"中查看加密统计，无需解密原始数据</p>
            </div>
          </div>
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
        <h3 className="text-xl font-bold text-gray-900 mb-2">快速操作</h3>
        <p className="text-sm text-gray-600 mb-4">点击下方按钮快速跳转到对应功能模块</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.hash = '#departments'}
            className="p-4 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left bg-blue-50/50"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-semibold text-gray-900">创建部门</div>
            <div className="text-sm text-gray-600">添加新部门并设置预算</div>
          </button>

          <button 
            onClick={() => window.location.hash = '#employees'}
            className="p-4 border-2 border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left bg-green-50/50"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-semibold text-gray-900">添加员工</div>
            <div className="text-sm text-gray-600">注册新员工并分配角色</div>
          </button>

          <button 
            onClick={() => window.location.hash = '#salary'}
            className="p-4 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left bg-purple-50/50"
          >
            <div className="text-2xl mb-2">💵</div>
            <div className="font-semibold text-gray-900">提交薪资</div>
            <div className="text-sm text-gray-600">使用FHE加密提交薪资</div>
          </button>

          <button 
            onClick={() => window.location.hash = '#statistics'}
            className="p-4 border-2 border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left bg-orange-50/50"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-gray-900">查看统计</div>
            <div className="text-sm text-gray-600">不解密数据统计分析</div>
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

