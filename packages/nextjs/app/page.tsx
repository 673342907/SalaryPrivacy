"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { useLocale } from "~~/contexts/LocaleContext";
import { LanguageSwitcher } from "~~/components/LanguageSwitcher";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useLocale();
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // 确保只在客户端执行
  useEffect(() => {
    setMounted(true);
    
    // 监听滚动
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 安全获取翻译，确保所有字段都有值
  if (!t || !mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t?.locale === "en" ? "Loading..." : "加载中..."}</p>
        </div>
      </div>
    );
  }

  const home = t?.home || {};
  
  // 功能特性数据
  const features = [
    {
      icon: "🏢",
      title: home.feature1 || (t.locale === "en" ? "Department Management" : "部门管理"),
      description: home.feature1Description || (t.locale === "en" ? "Create and manage company departments, set encrypted budgets" : "创建和管理公司部门，设置加密预算"),
      color: "blue",
      gradient: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-400/50",
      hoverColor: "hover:bg-blue-500/30",
    },
    {
      icon: "👥",
      title: home.feature2 || (t.locale === "en" ? "Employee Management" : "员工管理"),
      description: home.feature2Description || (t.locale === "en" ? "Add employees, assign roles and departments" : "添加员工、分配角色和部门"),
      color: "green",
      gradient: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-400/50",
      hoverColor: "hover:bg-green-500/30",
    },
    {
      icon: "💰",
      title: home.feature3 || (t.locale === "en" ? "Salary Management" : "薪资管理"),
      description: home.feature3Description || (t.locale === "en" ? "Encrypt and submit salaries, only authorized users can decrypt and view" : "加密提交薪资，只有授权用户可解密查看"),
      color: "purple",
      gradient: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-400/50",
      hoverColor: "hover:bg-purple-500/30",
    },
    {
      icon: "📊",
      title: home.feature4 || (t.locale === "en" ? "Statistical Analysis" : "统计分析"),
      description: home.feature4Description || (t.locale === "en" ? "Perform statistical calculations without decrypting raw data" : "在不解密原始数据的情况下进行统计计算"),
      color: "orange",
      gradient: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-400/50",
      hoverColor: "hover:bg-orange-500/30",
    },
    {
      icon: "🔐",
      title: (t.locale === "en" ? "Permission Management" : "权限管理"),
      description: home.feature5Description || (t.locale === "en" ? "Role-based access control: Admin, HR, Manager, Employee" : "基于角色的访问控制：Admin、HR、Manager、Employee"),
      color: "red",
      gradient: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-400/50",
      hoverColor: "hover:bg-red-500/30",
    },
    {
      icon: "🚀",
      title: t.locale === "en" ? "Quick Demo" : "快速演示",
      description: home.feature6Description || (t.locale === "en" ? "One-click demo data generation, quickly experience all features" : "一键创建演示数据，快速体验所有功能"),
      color: "indigo",
      gradient: "from-indigo-500/20 to-indigo-600/20",
      borderColor: "border-indigo-400/50",
      hoverColor: "hover:bg-indigo-500/30",
      highlight: true,
    },
  ].filter(f => f && f.title && f.description);

  // 技术亮点
  const techHighlights = [
    {
      icon: "🔐",
      title: t.locale === "en" ? "FHE Encrypted Calculation" : "FHE 加密计算",
      description: t.locale === "en" ? "Perform salary statistics and budget comparison without decryption, truly achieving privacy protection" : "在不解密的情况下进行薪资统计和预算比较，真正实现隐私保护",
    },
    {
      icon: "👥",
      title: t.locale === "en" ? "Permission Control" : "权限控制",
      description: t.locale === "en" ? "Role-based permission system based on smart contracts, ensuring data security and access control" : "基于智能合约的角色权限系统，确保数据安全和访问控制",
    },
    {
      icon: "📊",
      title: t.locale === "en" ? "Statistical Analysis" : "统计分析",
      description: t.locale === "en" ? "Support department statistics, salary distribution, budget compliance checks and other complex analysis functions" : "支持部门统计、薪资分布、预算合规检查等复杂分析功能",
    },
    {
      icon: "🏢",
      title: t.locale === "en" ? "Enterprise Application" : "企业级应用",
      description: home.feature4Description || (t.locale === "en" ? "Complete organization management, employee management, salary management features, solving real HR pain points" : "完整的组织管理、员工管理、薪资管理功能，解决真实 HR 痛点"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* 动态背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
        }}></div>
        
        {/* 浮动光点 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* 顶部导航栏 */}
      <nav className="relative z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🔐</div>
              <span className="text-white font-bold text-lg">ConfidentialSalary</span>
            </div>
            <div className="flex items-center gap-4">
              {!isConnected && (
                <div className="hidden md:block">
                  <RainbowKitCustomConnectButton />
                </div>
              )}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - 主要展示区域 */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-16">
          {/* 主标题 - 带动画效果 */}
          <div className="mb-8 animate-fadeInUp">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Confidential
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-white bg-clip-text text-transparent animate-gradient" style={{ animationDelay: "0.2s" }}>
                Salary
              </span>
            </h1>
          </div>

          {/* 副标题 */}
          <p className="text-2xl sm:text-3xl text-gray-300 mb-4 font-serif italic animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            {home.tagline || (t.locale === "en" ? "Revive Privacy" : "重塑隐私")}
          </p>

          {/* 描述 */}
          <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
            {home.description || (t.locale === "en" ? "Enterprise-grade privacy-preserving salary management system based on FHEVM" : "基于 FHEVM 的企业级隐私保护薪资管理系统")}
            <br />
            <span className="text-base text-gray-300 mt-2 block">
              {home.subDescription || (t.locale === "en" ? "All salary data is stored encrypted on-chain, supporting statistical calculations without decryption" : "所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算")}
            </span>
          </p>

          {/* 快速开始指南 - 优化版 */}
          <div className="bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-yellow-500/30 border-2 border-yellow-400/50 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto mb-12 backdrop-blur-sm shadow-xl animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="text-5xl flex-shrink-0 animate-bounce">🎯</div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-yellow-100 mb-3 flex items-center gap-2">
                  <span>{t.locale === "en" ? "Quick Start Guide" : "快速开始指南"}</span>
                  <span className="text-sm font-normal bg-yellow-400/30 px-2 py-1 rounded-full">NEW</span>
                </h3>
                <ol className="text-sm sm:text-base text-yellow-50 space-y-2.5 list-decimal list-inside">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>{t.locale === "en" ? "Connect your wallet (MetaMask recommended)" : "连接钱包（推荐使用 MetaMask）"}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>{t.locale === "en" ? "Switch to Sepolia testnet (Chain ID: 11155111) or local Hardhat network (Chain ID: 31337)" : "切换到 Sepolia 测试网（Chain ID: 11155111）或本地 Hardhat 网络（Chain ID: 31337）"}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>{t.locale === "en" ? "Click 'Enter ConfidentialSalary Platform' to access all features" : "点击「进入 ConfidentialSalary 平台」访问所有功能"}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>{t.locale === "en" ? "Use 'Generate Demo Data' in Dashboard to quickly experience all features" : "在 Dashboard 中使用「一键生成演示数据」快速体验所有功能"}</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* 核心特性展示 */}
        <section className="mb-16 animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 border border-white/20">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                ✨ {home.coreFeatures || (t.locale === "en" ? "Core Features" : "核心特性")}
              </h2>
              <p className="text-gray-300 text-lg">
                {t.locale === "en" ? "Powerful features built on cutting-edge FHE technology" : "基于前沿 FHE 技术构建的强大功能"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <div className="p-6 sm:p-8 border-2 border-blue-400/50 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="font-bold text-white mb-3 text-lg">{home.feature1 || (t.locale === "en" ? "Fully Homomorphic Encryption Protection" : "全同态加密保护")}</h3>
                <p className="text-sm text-gray-100 leading-relaxed">{home.feature1Description || (t.locale === "en" ? "All salary data is stored encrypted on-chain, supporting statistical calculations without decryption" : "所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算")}</p>
              </div>
              <div className="p-6 sm:p-8 border-2 border-green-400/50 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm hover:bg-green-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="font-bold text-white mb-3 text-lg">{home.feature2 || (t.locale === "en" ? "Role-Based Permission Management" : "基于角色的权限管理")}</h3>
                <p className="text-sm text-gray-100 leading-relaxed">{home.feature2Description || (t.locale === "en" ? "Role-based access control: Admin, HR, Manager, Employee with different permissions" : "基于角色的访问控制：Admin、HR、Manager、Employee 不同权限")}</p>
              </div>
              <div className="p-6 sm:p-8 border-2 border-purple-400/50 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm hover:bg-purple-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="font-bold text-white mb-3 text-lg">{home.feature3 || (t.locale === "en" ? "Encrypted Statistical Analysis" : "加密统计分析")}</h3>
                <p className="text-sm text-gray-100 leading-relaxed">{home.feature3Description || (t.locale === "en" ? "Calculate average, sum, distribution and other statistics without decrypting raw data" : "在不解密原始数据的情况下计算平均值、总和、分布等统计信息")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 功能导航卡片 */}
        <section className="mb-16 animate-fadeInUp" style={{ animationDelay: "0.7s" }}>
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              🎯 {(home as any).featureNavigation || (t.locale === "en" ? "Feature Navigation" : "功能导航")}
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              {(home as any).featureNavigationDescription || (t.locale === "en" ? "Click the feature cards below to enter the corresponding module and experience full functionality" : "点击下方功能卡片，进入对应模块体验完整功能")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div
                    className={`
                      backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8
                      border-2
                      hover:shadow-2xl
                      transition-all duration-300
                      cursor-pointer
                      h-full
                      relative
                      overflow-hidden
                      transform hover:scale-105
                      ${feature.highlight ? "ring-2 ring-yellow-400/50 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 border-indigo-400/50 hover:bg-indigo-500/30" : 
                        feature.color === "blue" ? "bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/50 hover:bg-blue-500/30" :
                        feature.color === "green" ? "bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/50 hover:bg-green-500/30" :
                        feature.color === "purple" ? "bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/50 hover:bg-purple-500/30" :
                        feature.color === "orange" ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/50 hover:bg-orange-500/30" :
                        feature.color === "red" ? "bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-400/50 hover:bg-red-500/30" :
                        "bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-gray-400/50 hover:bg-gray-500/30"}
                    `}
                  >
                    {feature.highlight && (
                      <div className="absolute top-2 right-2 animate-pulse">
                        <span className="text-2xl">⭐</span>
                      </div>
                    )}
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-200 mb-4 leading-relaxed">{feature.description}</p>
                    <div className="flex items-center text-xs text-blue-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>{t.locale === "en" ? "Click to enter" : "点击进入"}</span>
                      <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA Section - 连接钱包或进入平台 */}
        <section className="text-center mb-16 animate-fadeInUp" style={{ animationDelay: "0.8s" }}>
          {!isConnected ? (
            <div className="bg-gradient-to-br from-blue-600/40 via-purple-600/40 to-pink-600/40 backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12 max-w-2xl mx-auto border-2 border-yellow-400/50 relative overflow-hidden">
              {/* 动画背景 */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse" style={{ animationDelay: "1s" }}></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 mb-4 shadow-2xl animate-bounce">
                    <span className="text-5xl">🔗</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  {t.locale === "en" ? "🚀 Start Your Privacy Journey" : "🚀 开启您的隐私之旅"}
                </h3>
                <p className="text-gray-200 mb-8 text-lg sm:text-xl leading-relaxed">
                  {t.locale === "en" ? "Connect your wallet to start using the most advanced privacy-preserving salary management system" : "连接钱包，开始使用最先进的隐私保护薪资管理系统"}
                </p>
                <div className="flex justify-center mb-6">
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button
                        onClick={openConnectModal}
                        className="
                          px-12 py-6 text-xl font-bold text-gray-900 
                          bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400
                          hover:from-yellow-300 hover:via-yellow-400 hover:to-yellow-300
                          rounded-2xl shadow-2xl hover:shadow-yellow-500/50
                          transition-all duration-300
                          transform hover:scale-110 active:scale-95
                          border-4 border-yellow-300
                          cursor-pointer
                          animate-pulse hover:animate-none
                          relative overflow-hidden
                          min-w-[300px]
                        "
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          <span className="text-3xl">🔗</span>
                          <span>{t.locale === "en" ? "Connect Wallet Now" : "立即连接钱包"}</span>
                          <span className="text-xl">→</span>
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></span>
                      </button>
                    )}
                  </ConnectButton.Custom>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-sm text-yellow-100 font-medium flex items-center justify-center gap-2">
                    <span>💡</span>
                    <span>{t.locale === "en" ? "After connecting, you'll see an interactive guide to help you get started" : "连接后，您将看到一个交互式引导，帮助您快速上手"}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Link href="/confidential-salary">
                <button
                  className="
                    px-10 py-5 text-xl font-bold text-white rounded-2xl
                    bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600
                    hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700
                    shadow-2xl hover:shadow-blue-500/50
                    transition-all duration-300
                    transform hover:scale-110
                    border-2 border-white/20
                    relative overflow-hidden
                  "
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-2xl">🚀</span>
                    <span>{home.enterPlatform || (t.locale === "en" ? "Enter ConfidentialSalary Platform" : "进入 ConfidentialSalary 平台")}</span>
                    <span className="text-lg">→</span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></span>
                </button>
              </Link>
              <p className="text-base text-gray-300 max-w-xl mx-auto">
                💡 {home.firstTimeTip || (t.locale === "en" ? "First-time entry will automatically show usage guide to help you quickly understand all features" : "首次进入会自动显示使用引导，帮助您快速了解所有功能")}
              </p>
            </div>
          )}
        </section>

        {/* Zama 技术展示 */}
        <section className="mb-16 animate-fadeInUp" style={{ animationDelay: "0.9s" }}>
          <div className="bg-gradient-to-r from-indigo-600/80 via-purple-700/80 to-indigo-600/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 text-white border border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <div className="text-6xl sm:text-7xl">🔬</div>
              <div className="text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">{t.locale === "en" ? "Powered by Zama FHEVM" : "基于 Zama FHEVM 技术"}</h2>
                <p className="text-indigo-100 text-lg">
                  {t.locale === "en" ? "Fully Homomorphic Encryption Virtual Machine" : "全同态加密虚拟机"}
                </p>
              </div>
            </div>
            <div className="bg-white/20 rounded-2xl p-6 mb-6">
              <p className="text-base sm:text-lg text-center text-white leading-relaxed mb-4">
                {t.locale === "en" 
                  ? "Zama is a leading developer of FHE (Fully Homomorphic Encryption) technology, committed to making privacy protection the default setting. Our system leverages Zama's cutting-edge FHEVM to enable encrypted computations on the blockchain."
                  : "Zama 是 FHE（全同态加密）技术的领先开发者，致力于让隐私保护成为默认设置。我们的系统利用 Zama 的前沿 FHEVM 技术，在区块链上实现加密计算。"}
              </p>
              <div className="flex justify-center">
                <a
                  href="https://www.zama.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all font-medium hover:scale-105"
                >
                  <span>{t.locale === "en" ? "Learn more about Zama" : "了解更多关于 Zama"}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 技术亮点 */}
        <section className="mb-16 animate-fadeInUp" style={{ animationDelay: "1s" }}>
          <div className="bg-gradient-to-r from-blue-600/80 via-indigo-700/80 to-blue-600/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 text-white border border-white/20">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                🏆 {t.locale === "en" ? "Technical Highlights" : "技术亮点"}
              </h2>
              <p className="text-blue-100 text-lg">
                {t.locale === "en" ? "What makes our system unique" : "我们系统的独特之处"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {techHighlights.map((highlight, idx) => (
                <div key={idx} className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-all transform hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{highlight.icon}</div>
                    <div>
                      <h3 className="font-bold text-white mb-2 text-lg">{highlight.title}</h3>
                      <p className="text-blue-50 text-sm leading-relaxed">{highlight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 底部信息 */}
        <footer className="text-center py-8 animate-fadeInUp" style={{ animationDelay: "1.1s" }}>
          <div className="text-gray-400 text-sm space-y-2">
            <p>{t.locale === "en" ? "Built with ❤️ using FHEVM" : "使用 FHEVM 构建 ❤️"}</p>
            <div className="flex justify-center gap-4 text-xs">
              <a href="https://github.com/zama-ai/fhevm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
              <span>•</span>
              <a href="https://docs.zama.ai/fhevm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                {t.locale === "en" ? "Documentation" : "文档"}
              </a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}
