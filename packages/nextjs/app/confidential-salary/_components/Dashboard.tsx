"use client";

import { useAccount } from "wagmi";
import { useMemo, useState } from "react";
import { useFhevm } from "@fhevm-sdk";
import { DemoDataGenerator } from "./DemoDataGenerator";
import { TechnicalComparison } from "./TechnicalComparison";
import Link from "next/link";

interface ConfidentialSalaryDashboardProps {
  onStartGuide?: () => void;
}

export function ConfidentialSalaryDashboard({ onStartGuide }: ConfidentialSalaryDashboardProps) {
  const { address, chainId: wagmiChainId } = useAccount();
  const [demoData, setDemoData] = useState<any>(null);

  const provider = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    // 优先使用 wagmi 的 provider，如果没有则使用 window.ethereum
    return (window as any).ethereum;
  }, [address]); // 当地址变化时重新获取 provider

  // 使用 wagmi 的 chainId，如果没有则使用 Sepolia
  const chainId = wagmiChainId || 11155111;

  // 检查是否是 mock chain（本地开发）
  const isMockChain = chainId === 31337;
  
  // 对于真实网络（Sepolia），需要 relayer SDK
  // 对于 mock chain，使用本地 Hardhat 节点
  const initialMockChains = isMockChain ? { 31337: "http://localhost:8545" } : {};

  const { instance: fhevmInstance, status: fhevmStatus, error: fhevmError } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: !!provider && !!address, // 只有在钱包连接时才启用
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
              <strong className="text-gray-900">查看统计</strong>
              <p className="text-gray-600">在"统计分析"中查看加密数据统计结果</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Fixed */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">快速操作</h3>
        <p className="text-sm text-gray-600 mb-4">点击下方按钮快速跳转到对应功能模块</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/confidential-salary#departments">
            <button className="w-full p-4 border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left bg-blue-50/50">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-semibold text-gray-900">创建部门</div>
              <div className="text-sm text-gray-600">添加新部门并设置预算</div>
            </button>
          </Link>

          <Link href="/confidential-salary#employees">
            <button className="w-full p-4 border-2 border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left bg-green-50/50">
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold text-gray-900">添加员工</div>
              <div className="text-sm text-gray-600">注册新员工并分配角色</div>
            </button>
          </Link>

          <Link href="/confidential-salary#salary">
            <button className="w-full p-4 border-2 border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left bg-purple-50/50">
              <div className="text-2xl mb-2">💵</div>
              <div className="font-semibold text-gray-900">提交薪资</div>
              <div className="text-sm text-gray-600">使用FHE加密提交薪资</div>
            </button>
          </Link>

          <Link href="/confidential-salary#statistics">
            <button className="w-full p-4 border-2 border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left bg-orange-50/50">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-gray-900">查看统计</div>
              <div className="text-sm text-gray-600">加密数据统计分析</div>
            </button>
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">系统状态</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">FHEVM 连接</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                fhevmStatus === "ready" 
                  ? "bg-green-100 text-green-800" 
                  : fhevmStatus === "error"
                  ? "bg-red-100 text-red-800"
                  : fhevmStatus === "loading"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {fhevmStatus === "ready" 
                  ? "✓ 已连接" 
                  : fhevmStatus === "error"
                  ? "❌ 错误"
                  : fhevmStatus === "loading"
                  ? "⏳ 连接中"
                  : "⏸️ 未启动"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {fhevmStatus === "ready" 
                ? "FHEVM 实例已就绪" 
                : fhevmStatus === "error"
                ? fhevmError?.message || "FHEVM 初始化失败"
                : fhevmStatus === "loading"
                ? "正在初始化 FHEVM..."
                : !address
                ? "请先连接钱包"
                : !provider
                ? "等待钱包提供者..."
                : "等待初始化..."}
            </p>
            {fhevmError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                <p className="text-red-800 font-semibold mb-1">错误详情:</p>
                <p className="text-red-600">{fhevmError.message}</p>
                {fhevmError.message.includes("relayerSDK") && (
                  <div className="mt-2 text-red-700">
                    <p className="font-semibold">💡 解决方案：</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>使用本地 Hardhat 节点（Chain ID: 31337）</li>
                      <li>或确保已加载 FHEVM Relayer SDK</li>
                      <li>当前网络: {chainId === 31337 ? "本地开发" : `Sepolia (${chainId})`}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">钱包地址</span>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {address ? "✓ 已连接" : "未连接"}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono break-all">
              {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "请连接钱包"}
            </p>
          </div>

          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">网络</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                chainId === 11155111 
                  ? "bg-purple-100 text-purple-800" 
                  : chainId === 31337
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}>
                {chainId === 11155111 
                  ? "Sepolia" 
                  : chainId === 31337
                  ? "Localhost"
                  : `Chain ${chainId}`}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {chainId === 11155111 
                ? "测试网络（需要 Relayer SDK）" 
                : chainId === 31337
                ? "本地开发网络（Hardhat）"
                : `Chain ${chainId}（请切换到 Sepolia 或本地网络）`}
            </p>
            {chainId === 11155111 && fhevmStatus === "error" && (
              <p className="text-xs text-orange-600 mt-1">
                ⚠️ Sepolia 需要 Relayer SDK，建议使用本地 Hardhat 节点进行开发
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Technical Comparison */}
      <TechnicalComparison />

      {/* Feature Highlights */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">✨ 核心功能亮点</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔐</span>
              <h4 className="font-semibold text-gray-900">全同态加密</h4>
            </div>
            <p className="text-sm text-gray-600">
              所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👥</span>
              <h4 className="font-semibold text-gray-900">角色权限管理</h4>
            </div>
            <p className="text-sm text-gray-600">
              基于智能合约的 RBAC 系统，确保数据安全和访问控制
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <h4 className="font-semibold text-gray-900">加密统计分析</h4>
            </div>
            <p className="text-sm text-gray-600">
              在不解密原始数据的情况下计算平均值、总和、分布等统计信息
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏢</span>
              <h4 className="font-semibold text-gray-900">企业级应用</h4>
            </div>
            <p className="text-sm text-gray-600">
              完整的组织管理、员工管理、薪资管理功能，解决真实 HR 痛点
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
