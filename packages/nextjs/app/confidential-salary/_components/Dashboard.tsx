"use client";

import { useAccount } from "wagmi";
import { useMemo, useState, useEffect } from "react";
import { useFhevm } from "@fhevm-sdk";
import { DemoDataGenerator } from "./DemoDataGenerator";
import { TechnicalComparison } from "./TechnicalComparison";
import { SecurityProof } from "./SecurityProof";
import { ComplianceBadge } from "./ComplianceBadge";
import { ZamaConnection } from "./ZamaConnection";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import Link from "next/link";
import { notification } from "~~/utils/helper/notification";

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
  const initialMockChains: Readonly<Record<number, string>> | undefined = isMockChain
    ? { 31337: "http://localhost:8545" }
    : undefined;

  // 检查 Relayer SDK 是否已加载（用于 Sepolia）
  const [relayerSDKReady, setRelayerSDKReady] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined" && chainId === 11155111) {
      const checkRelayerSDK = () => {
        const win = window as any;
        if (win.relayerSDK && typeof win.relayerSDK.initSDK === "function") {
          setRelayerSDKReady(true);
        } else {
          setRelayerSDKReady(false);
        }
      };
      
      checkRelayerSDK();
      // 定期检查（因为 SDK 是异步加载的）
      const interval = setInterval(checkRelayerSDK, 1000);
      return () => clearInterval(interval);
    } else {
      setRelayerSDKReady(true); // Mock chain 不需要 Relayer SDK
    }
  }, [chainId]);

  const { status: fhevmStatus, error: fhevmError } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: !!provider && !!address && (isMockChain || relayerSDKReady), // 只有在钱包连接且 SDK 就绪时才启用
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600/90 to-indigo-700/90 backdrop-blur-md rounded-xl shadow-lg p-8 text-white border border-white/30">
        <h2 className="text-3xl font-bold mb-2">欢迎使用 ConfidentialSalary</h2>
        <p className="text-blue-50 text-lg mb-4">
          基于 FHEVM 的企业级隐私保护薪资管理系统
        </p>
        <div className="bg-white/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-white">
            <strong className="text-blue-50">💡 使用提示：</strong> 通过顶部导航栏可以访问所有功能模块。每个模块都有详细的功能说明和操作指引。
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm flex-wrap">
          <span className="bg-white/30 px-3 py-1 rounded-full text-white font-medium">
            🔐 全同态加密保护
          </span>
          <span className="bg-white/30 px-3 py-1 rounded-full text-white font-medium">
            👥 角色权限管理
          </span>
          <span className="bg-white/30 px-3 py-1 rounded-full text-white font-medium">
            📊 加密统计分析
          </span>
        </div>
      </div>

      {/* Demo Data Generator - 更突出 */}
      <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 backdrop-blur-md rounded-xl shadow-lg p-6 border-2 border-yellow-400/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span>🚀</span>
              <span>快速开始（推荐）</span>
            </h3>
            <p className="text-yellow-100 text-sm">
              一键生成完整演示数据，立即体验所有功能，无需手动创建
            </p>
          </div>
        </div>
        <DemoDataGenerator 
          onGenerate={(data) => {
            setDemoData(data);
            // 使用更友好的Toast提示
            setTimeout(() => {
              notification.success(
                <div className="space-y-2">
                  <div className="font-bold text-lg">✅ 演示数据已生成！</div>
                  <div className="text-sm">
                    <div className="font-semibold mb-1">📊 已创建：</div>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>{data.departments.length} 个部门</li>
                      <li>{data.employees.length} 名员工</li>
                      <li>{data.salaries.length} 条薪资记录</li>
                    </ul>
                  </div>
                  <div className="text-sm mt-2">
                    <div className="font-semibold">💡 现在您可以：</div>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>查看各部门和员工</li>
                      <li>查看加密薪资记录</li>
                      <li>体验统计分析功能</li>
                    </ol>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">请前往上方导航栏查看！</div>
                </div>,
                { duration: 6000 }
              );
            }, 500);
          }}
        />
      </div>

      {/* Quick Guide - 简化版 */}
      <div className="bg-blue-500/20 backdrop-blur-md border border-blue-400/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white flex items-center">
            <span className="mr-2">📖</span>
            手动操作指南（可选）
          </h3>
          {onStartGuide && (
            <button
              onClick={onStartGuide}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-md"
            >
              🎯 详细引导
            </button>
          )}
        </div>
        <p className="text-sm text-gray-200 mb-4">
          💡 <strong>提示：</strong>建议先使用"一键生成演示数据"快速体验，如需手动创建可按以下步骤：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start bg-white/5 rounded-lg p-3">
            <span className="text-xl mr-2">1️⃣</span>
            <div>
              <strong className="text-white">创建部门</strong>
              <p className="text-gray-300 text-xs">部门管理 → 创建部门</p>
            </div>
          </div>
          <div className="flex items-start bg-white/5 rounded-lg p-3">
            <span className="text-xl mr-2">2️⃣</span>
            <div>
              <strong className="text-white">添加员工</strong>
              <p className="text-gray-300 text-xs">员工管理 → 添加员工</p>
            </div>
          </div>
          <div className="flex items-start bg-white/5 rounded-lg p-3">
            <span className="text-xl mr-2">3️⃣</span>
            <div>
              <strong className="text-white">提交薪资</strong>
              <p className="text-gray-300 text-xs">薪资管理 → 提交薪资</p>
            </div>
          </div>
          <div className="flex items-start bg-white/5 rounded-lg p-3">
            <span className="text-xl mr-2">4️⃣</span>
            <div>
              <strong className="text-white">查看统计</strong>
              <p className="text-gray-300 text-xs">统计分析 → 查看结果</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Fixed */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-2">快速操作</h3>
        <p className="text-sm text-gray-200 mb-4">点击下方按钮快速跳转到对应功能模块</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/confidential-salary#departments">
            <button className="w-full p-4 border-2 border-blue-400/30 rounded-lg hover:border-blue-400/50 hover:bg-blue-500/20 transition-all text-left bg-blue-500/10 backdrop-blur-sm">
              <div className="text-2xl mb-2">➕</div>
              <div className="font-semibold text-white">创建部门</div>
              <div className="text-sm text-gray-300">添加新部门并设置预算</div>
            </button>
          </Link>

          <Link href="/confidential-salary#employees">
            <button className="w-full p-4 border-2 border-green-400/30 rounded-lg hover:border-green-400/50 hover:bg-green-500/20 transition-all text-left bg-green-500/10 backdrop-blur-sm">
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold text-white">添加员工</div>
              <div className="text-sm text-gray-300">注册新员工并分配角色</div>
            </button>
          </Link>

          <Link href="/confidential-salary#salary">
            <button className="w-full p-4 border-2 border-purple-400/30 rounded-lg hover:border-purple-400/50 hover:bg-purple-500/20 transition-all text-left bg-purple-500/10 backdrop-blur-sm">
              <div className="text-2xl mb-2">💵</div>
              <div className="font-semibold text-white">提交薪资</div>
              <div className="text-sm text-gray-300">使用FHE加密提交薪资</div>
            </button>
          </Link>

          <Link href="/confidential-salary#statistics">
            <button className="w-full p-4 border-2 border-orange-400/30 rounded-lg hover:border-orange-400/50 hover:bg-orange-500/20 transition-all text-left bg-orange-500/10 backdrop-blur-sm">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-white">查看统计</div>
              <div className="text-sm text-gray-300">加密数据统计分析</div>
            </button>
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-md p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">系统状态</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border-2 border-white/20 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-200">FHEVM 连接</span>
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
            <p className="text-xs text-gray-300">
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

          <div className="p-4 border-2 border-white/20 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-100 font-medium">钱包地址</span>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/40 text-blue-50 border border-blue-400/60">
                {address ? "✓ 已连接" : "未连接"}
              </span>
            </div>
            <p className="text-xs text-gray-100 font-mono break-all font-medium">
              {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "请连接钱包"}
            </p>
          </div>

          <div className="p-4 border-2 border-white/20 rounded-lg bg-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-200">网络</span>
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
            <p className="text-xs text-gray-300">
              {chainId === 11155111 
                ? "测试网络（需要 Relayer SDK）" 
                : chainId === 31337
                ? "本地开发网络（Hardhat）"
                : `Chain ${chainId}（请切换到 Sepolia 或本地网络）`}
            </p>
            {chainId === 11155111 && fhevmStatus === "error" && (
              <p className="text-xs text-orange-400 mt-1 font-medium">
                ⚠️ Sepolia 需要 Relayer SDK，建议使用本地 Hardhat 节点进行开发
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Zama Connection */}
      <ZamaConnection />

      {/* Architecture Diagram */}
      <ArchitectureDiagram />

      {/* Security Proof */}
      <SecurityProof />

      {/* Compliance Badge */}
      <ComplianceBadge />

      {/* Technical Comparison */}
      <TechnicalComparison />

      {/* Feature Highlights */}
      <div className="bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">✨ 核心功能亮点</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔐</span>
              <h4 className="font-semibold text-white">全同态加密</h4>
            </div>
            <p className="text-sm text-gray-200">
              所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👥</span>
              <h4 className="font-semibold text-white">角色权限管理</h4>
            </div>
            <p className="text-sm text-gray-200">
              基于智能合约的 RBAC 系统，确保数据安全和访问控制
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <h4 className="font-semibold text-white">加密统计分析</h4>
            </div>
            <p className="text-sm text-gray-200">
              在不解密原始数据的情况下计算平均值、总和、分布等统计信息
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏢</span>
              <h4 className="font-semibold text-white">企业级应用</h4>
            </div>
            <p className="text-sm text-gray-200">
              完整的组织管理、员工管理、薪资管理功能，解决真实 HR 痛点
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}