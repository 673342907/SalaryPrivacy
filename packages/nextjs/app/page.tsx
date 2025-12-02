"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";

export default function Home() {
  const { isConnected } = useAccount();

  const features = [
    {
      icon: "🏢",
      title: "部门管理",
      description: "创建和管理公司部门，设置加密预算",
      color: "blue",
    },
    {
      icon: "👥",
      title: "员工管理",
      description: "添加员工、分配角色和部门",
      color: "green",
    },
    {
      icon: "💰",
      title: "薪资管理",
      description: "加密提交薪资，只有授权用户可解密查看",
      color: "purple",
    },
    {
      icon: "📊",
      title: "统计分析",
      description: "在不解密原始数据的情况下进行统计计算",
      color: "orange",
    },
    {
      icon: "🔐",
      title: "权限管理",
      description: "基于角色的访问控制：Admin、HR、Manager、Employee",
      color: "red",
    },
    {
      icon: "🚀",
      title: "快速演示",
      description: "一键创建演示数据，快速体验所有功能",
      color: "indigo",
    },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    indigo: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-5xl mb-6 shadow-lg">
            🔐
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ConfidentialSalary
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            隐私保护薪资管理平台
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            基于 FHEVM 的企业级隐私保护薪资管理系统
            <br />
            所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算
          </p>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 max-w-2xl mx-auto mb-6">
            <p className="text-sm text-gray-700">
              <strong>🎯 快速开始：</strong> 连接钱包后，您可以体验完整的薪资管理功能，包括部门管理、员工管理、加密薪资提交、统计分析等。
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ✨ 核心特性
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-blue-200 rounded-xl bg-blue-50">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">全同态加密保护</h3>
              <p className="text-sm text-gray-600">
                所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算
              </p>
            </div>
            <div className="p-6 border-2 border-green-200 rounded-xl bg-green-50">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-900 mb-2">角色权限管理</h3>
              <p className="text-sm text-gray-600">
                基于角色的访问控制：Admin、HR、Manager、Employee 不同权限
              </p>
            </div>
            <div className="p-6 border-2 border-purple-200 rounded-xl bg-purple-50">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">加密统计分析</h3>
              <p className="text-sm text-gray-600">
                在不解密原始数据的情况下计算平均值、总和、分布等统计信息
              </p>
            </div>
          </div>
        </div>

        {/* Feature Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            🎯 功能导航
          </h2>
          <p className="text-center text-gray-600 mb-6">
            点击下方功能卡片，进入对应模块体验完整功能
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const tabMap: Record<number, string> = {
                0: "departments",
                1: "employees",
                2: "salary",
                3: "statistics",
                4: "permissions",
                5: "dashboard",
              };
              const tab = tabMap[index] || "dashboard";
              return (
              <Link
                key={index}
                href={`/confidential-salary${tab !== "dashboard" ? `#${tab}` : ""}`}
                className="group"
              >
                <div className={`
                  bg-white rounded-xl shadow-lg p-6 
                  border-2 border-transparent
                  hover:border-blue-300
                  hover:shadow-xl
                  transition-all duration-300
                  cursor-pointer
                  h-full
                  relative
                `}>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="text-xs text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    点击进入 →
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          {!isConnected ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                开始体验 ConfidentialSalary
              </h3>
              <p className="text-gray-600 mb-6">
                连接钱包以开始使用隐私保护薪资管理系统
              </p>
              <RainbowKitCustomConnectButton />
              <p className="text-sm text-gray-500 mt-4">
                💡 连接钱包后，系统会自动显示使用引导
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Link href="/confidential-salary">
                <button className={`
                  px-8 py-4 text-lg font-semibold text-white rounded-xl
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  hover:from-blue-700 hover:to-indigo-700
                  shadow-lg hover:shadow-xl
                  transition-all duration-300
                  transform hover:scale-105
                `}>
                  🚀 进入 ConfidentialSalary 平台
                </button>
              </Link>
              <p className="text-sm text-gray-600">
                💡 首次进入会自动显示使用引导，帮助您快速了解所有功能
              </p>
            </div>
          )}
        </div>

        {/* Technical Highlights */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">
            🏆 技术亮点
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🔐 FHE 加密计算</h3>
              <p className="text-blue-100 text-sm">
                在不解密的情况下进行薪资统计和预算比较，真正实现隐私保护
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">👥 权限控制</h3>
              <p className="text-blue-100 text-sm">
                基于智能合约的角色权限系统，确保数据安全和访问控制
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📊 统计分析</h3>
              <p className="text-blue-100 text-sm">
                支持部门统计、薪资分布、预算合规检查等复杂分析功能
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🏢 企业级应用</h3>
              <p className="text-blue-100 text-sm">
                完整的组织管理、员工管理、薪资管理功能，解决真实 HR 痛点
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
