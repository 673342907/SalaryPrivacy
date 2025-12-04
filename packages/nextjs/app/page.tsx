"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { useLocale } from "~~/contexts/LocaleContext";
import { LanguageSwitcher } from "~~/components/LanguageSwitcher";

export default function Home() {
  const { t } = useLocale();
  const { isConnected } = useAccount();

  // 安全获取翻译，确保所有字段都有值
  const home = t?.home || {};
  const features = [
    {
      icon: "🏢",
      title: home.feature1 || (t.locale === "en" ? "Department Management" : "部门管理"),
      description: home.feature1Description || (t.locale === "en" ? "Create and manage company departments, set encrypted budgets" : "创建和管理公司部门，设置加密预算"),
      color: "blue",
    },
    {
      icon: "👥",
      title: home.feature2 || (t.locale === "en" ? "Employee Management" : "员工管理"),
      description: home.feature2Description || (t.locale === "en" ? "Add employees, assign roles and departments" : "添加员工、分配角色和部门"),
      color: "green",
    },
    {
      icon: "💰",
      title: home.feature3 || (t.locale === "en" ? "Salary Management" : "薪资管理"),
      description: home.feature3Description || (t.locale === "en" ? "Encrypt and submit salaries, only authorized users can decrypt and view" : "加密提交薪资，只有授权用户可解密查看"),
      color: "purple",
    },
    {
      icon: "📊",
      title: home.feature4 || (t.locale === "en" ? "Statistical Analysis" : "统计分析"),
      description: home.feature4Description || (t.locale === "en" ? "Perform statistical calculations without decrypting raw data" : "在不解密原始数据的情况下进行统计计算"),
      color: "orange",
    },
    {
      icon: "🔐",
      title: (t.locale === "en" ? "Permission Management" : "权限管理"),
      description: home.feature5Description || (t.locale === "en" ? "Role-based access control: Admin, HR, Manager, Employee" : "基于角色的访问控制：Admin、HR、Manager、Employee"),
      color: "red",
    },
    {
      icon: "🚀",
      title: t.locale === "en" ? "Quick Demo" : "快速演示",
      description: home.feature6Description || (t.locale === "en" ? "One-click demo data generation, quickly experience all features" : "一键创建演示数据，快速体验所有功能"),
      color: "indigo",
    },
  ].filter(f => f && f.title && f.description); // 过滤掉无效项

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern - Subtle Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
        }}></div>
      </div>

      {/* Header with Language Switcher */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          {/* Logo with Gradient */}
          <div className="mb-8">
            <h1 className="text-7xl sm:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Confidential
              </span>
              <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-white bg-clip-text text-transparent">
                Salary
              </span>
            </h1>
          </div>
          <p className="text-2xl sm:text-3xl text-gray-300 mb-2 font-serif italic">
            {home.tagline || (t.locale === "en" ? "Revive Privacy" : "重塑隐私")}
          </p>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-6">
            {home.description || (t.locale === "en" ? "Enterprise-grade privacy-preserving salary management system based on FHEVM" : "基于 FHEVM 的企业级隐私保护薪资管理系统")}
            <br />
            <span className="text-sm text-gray-300">{home.subDescription || (t.locale === "en" ? "All salary data is stored encrypted on-chain, supporting statistical calculations without decryption" : "所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算")}</span>
          </p>
          <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-xl p-4 max-w-2xl mx-auto mb-6 backdrop-blur-sm">
            <p className="text-sm text-yellow-50 font-medium">
              <strong className="text-yellow-100">🎯 {t.locale === "en" ? "Quick Start:" : "快速开始："}</strong> {home.firstTimeTip || (t.locale === "en" ? "After connecting your wallet, you can experience complete salary management features, including department management, employee management, encrypted salary submission, statistical analysis, etc." : "连接钱包后，您可以体验完整的薪资管理功能，包括部门管理、员工管理、加密薪资提交、统计分析等。")}
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-12 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            ✨ {home.coreFeatures || (t.locale === "en" ? "Core Features" : "核心特性")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border-2 border-blue-400/50 rounded-xl bg-blue-500/20 backdrop-blur-sm hover:bg-blue-500/30 transition-all">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-white mb-2">{home.feature1 || (t.locale === "en" ? "Fully Homomorphic Encryption Protection" : "全同态加密保护")}</h3>
              <p className="text-sm text-gray-100">
                {home.feature1Description || (t.locale === "en" ? "All salary data is stored encrypted on-chain, supporting statistical calculations without decryption" : "所有薪资数据在链上加密存储，支持在不解密的情况下进行统计计算")}
              </p>
            </div>
            <div className="p-6 border-2 border-green-400/50 rounded-xl bg-green-500/20 backdrop-blur-sm hover:bg-green-500/30 transition-all">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-semibold text-white mb-2">{home.feature2 || (t.locale === "en" ? "Role-Based Permission Management" : "基于角色的权限管理")}</h3>
              <p className="text-sm text-gray-100">
                {home.feature2Description || (t.locale === "en" ? "Role-based access control: Admin, HR, Manager, Employee with different permissions" : "基于角色的访问控制：Admin、HR、Manager、Employee 不同权限")}
              </p>
            </div>
            <div className="p-6 border-2 border-purple-400/50 rounded-xl bg-purple-500/20 backdrop-blur-sm hover:bg-purple-500/30 transition-all">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-white mb-2">{home.feature3 || (t.locale === "en" ? "Encrypted Statistical Analysis" : "加密统计分析")}</h3>
              <p className="text-sm text-gray-100">
                {home.feature3Description || (t.locale === "en" ? "Calculate average, sum, distribution and other statistics without decrypting raw data" : "在不解密原始数据的情况下计算平均值、总和、分布等统计信息")}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            🎯 {(home as any).featureNavigation || (t.locale === "en" ? "Feature Navigation" : "功能导航")}
          </h2>
          <p className="text-center text-gray-200 mb-6">
            {(home as any).featureNavigationDescription || (t.locale === "en" ? "Click the feature cards below to enter the corresponding module and experience full functionality" : "点击下方功能卡片，进入对应模块体验完整功能")}
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
                <div
                  className={`
                    bg-white/5 backdrop-blur-md rounded-xl shadow-lg p-6 
                    border-2 border-white/10
                    hover:border-white/30
                    hover:bg-white/10
                    hover:shadow-xl
                    transition-all duration-300
                    cursor-pointer
                    h-full
                    relative
                  `}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-200 mb-4">{feature?.description || ""}</p>
                  <div className="text-xs text-blue-300 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.locale === "en" ? "Click to enter →" : "点击进入 →"}
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
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">{t.locale === "en" ? "Start Experiencing ConfidentialSalary" : "开始体验 ConfidentialSalary"}</h3>
              <p className="text-gray-200 mb-6">{t.locale === "en" ? "Connect wallet to start using the privacy-preserving salary management system" : "连接钱包以开始使用隐私保护薪资管理系统"}</p>
              <div className="flex justify-center">
                <RainbowKitCustomConnectButton />
              </div>
              <p className="text-sm text-gray-300 mt-4">💡 {t.locale === "en" ? "After connecting wallet, the system will automatically display usage guide" : "连接钱包后，系统会自动显示使用引导"}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Link href="/confidential-salary">
                <button
                  className={`
                  px-8 py-4 text-lg font-semibold text-white rounded-xl
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  hover:from-blue-700 hover:to-indigo-700
                  shadow-lg hover:shadow-xl
                  transition-all duration-300
                  transform hover:scale-105
                  border border-white/20
                `}
                >
                  🚀 {home.enterPlatform || (t.locale === "en" ? "Enter ConfidentialSalary Platform" : "进入 ConfidentialSalary 平台")}
                </button>
              </Link>
              <p className="text-sm text-gray-300">💡 {home.firstTimeTip || (t.locale === "en" ? "First-time entry will automatically show usage guide to help you quickly understand all features" : "首次进入会自动显示使用引导，帮助您快速了解所有功能")}</p>
            </div>
          )}
        </div>

        {/* Zama Connection */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600/80 to-purple-700/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-white border border-white/20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-5xl">🔬</div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">{t.locale === "en" ? "Based on Zama FHEVM Technology" : "基于 Zama FHEVM 技术"}</h2>
              <p className="text-indigo-100 text-sm">
                Powered by Zama&apos;s Fully Homomorphic Encryption Virtual Machine
              </p>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-center text-white">
              {t.locale === "en" 
                ? "Zama is a leading developer of FHE (Fully Homomorphic Encryption) technology, committed to making privacy protection the default setting."
                : "Zama 是 FHE（全同态加密）技术的领先开发者，致力于让隐私保护成为默认设置。"}
              <br />
              <a
                href="https://www.zama.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-indigo-200 transition-colors font-medium"
              >
                {t.locale === "en" ? "Learn more →" : "了解更多 →"}
              </a>
            </p>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/80 to-indigo-700/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-white border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-center">🏆 {t.locale === "en" ? "Technical Highlights" : "技术亮点"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-white">🔐 {t.locale === "en" ? "FHE Encrypted Calculation" : "FHE 加密计算"}</h3>
              <p className="text-blue-50 text-sm">{t.locale === "en" ? "Perform salary statistics and budget comparison without decryption, truly achieving privacy protection" : "在不解密的情况下进行薪资统计和预算比较，真正实现隐私保护"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-white">👥 {t.locale === "en" ? "Permission Control" : "权限控制"}</h3>
              <p className="text-blue-50 text-sm">{t.locale === "en" ? "Role-based permission system based on smart contracts, ensuring data security and access control" : "基于智能合约的角色权限系统，确保数据安全和访问控制"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-white">📊 {t.locale === "en" ? "Statistical Analysis" : "统计分析"}</h3>
              <p className="text-blue-50 text-sm">{t.locale === "en" ? "Support department statistics, salary distribution, budget compliance checks and other complex analysis functions" : "支持部门统计、薪资分布、预算合规检查等复杂分析功能"}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-white">🏢 {t.locale === "en" ? "Enterprise Application" : "企业级应用"}</h3>
              <p className="text-blue-50 text-sm">{home.feature4Description || (t.locale === "en" ? "Complete organization management, employee management, salary management features, solving real HR pain points" : "完整的组织管理、员工管理、薪资管理功能，解决真实 HR 痛点")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
