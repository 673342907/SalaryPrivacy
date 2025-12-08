"use client";

import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/helper/RainbowKitCustomConnectButton";
import { ConfidentialSalaryDashboard } from "./_components/Dashboard";
import { DepartmentManagement } from "./_components/DepartmentManagement";
import { EmployeeManagement } from "./_components/EmployeeManagement";
import { SalaryManagement } from "./_components/SalaryManagement";
import { StatisticsAnalysis } from "./_components/StatisticsAnalysis";
import { PermissionManagement } from "./_components/PermissionManagement";
import { OnboardingGuide } from "./_components/OnboardingGuide";
import { DataProvider } from "./_context/DataContext";
import { StatusBadges } from "./_components/StatusBadges";
import { OptimizationsShowcase } from "./_components/OptimizationsShowcase";
import { LanguageSwitcher } from "~~/components/LanguageSwitcher";
import { QuickHelp } from "~~/components/QuickHelp";
import { useLocale } from "~~/contexts/LocaleContext";
import { useState, useEffect } from "react";

type TabType = "dashboard" | "departments" | "employees" | "salary" | "statistics" | "permissions" | "optimizations";

export default function ConfidentialSalaryPage() {
  const { isConnected } = useAccount();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [showGuide, setShowGuide] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 确保只在客户端执行
  useEffect(() => {
    // 使用 requestAnimationFrame 确保在浏览器准备好后立即设置
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 检查是否已经完成过引导
  useEffect(() => {
    if (!mounted || !isConnected) return;
    const hasSeenGuide = localStorage.getItem("confidentialSalary_hasSeenGuide");
    if (!hasSeenGuide) {
      setShowGuide(true);
    }
  }, [isConnected, mounted]);

  // 监听 hash 变化，自动切换 tab
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // 移除 # 号
      if (hash && ["dashboard", "departments", "employees", "salary", "statistics", "permissions", "optimizations"].includes(hash)) {
        setActiveTab(hash as TabType);
        // 滚动到对应区域
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };

    // 初始检查 hash
    handleHashChange();

    // 监听 hash 变化
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [mounted]);

  const handleCloseGuide = () => {
    setShowGuide(false);
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("confidentialSalary_hasSeenGuide", "true");
    }
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab as TabType);
    setShowGuide(false);
    // 滚动到对应区域
    setTimeout(() => {
      const element = document.getElementById(tab);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // 在客户端挂载之前显示加载状态，避免 hydration 错误
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>{t.locale === "en" ? "Loading..." : "加载中..."}</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl mb-4">
              🔐
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ConfidentialSalary</h1>
            <p className="text-gray-600 mb-1">{t.dashboard?.subtitle || (t.locale === "en" ? "Privacy-Preserving Salary Management Platform" : "隐私保护薪资管理平台")}</p>
            <p className="text-sm text-gray-500">{t.dashboard?.description || (t.locale === "en" ? "Enterprise-grade privacy-preserving salary management system based on FHEVM" : "基于 FHEVM 的企业级隐私保护薪资管理系统")}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">✨ {t.locale === "en" ? "Core Features" : "核心特性"}</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>🔒 {t.locale === "en" ? "Fully Homomorphic Encryption Protection - All salary data is encrypted" : "全同态加密保护 - 薪资数据全程加密"}</li>
              <li>👥 {t.locale === "en" ? "Role-Based Permission Management" : "基于角色的权限管理"}</li>
              <li>📊 {t.locale === "en" ? "Encrypted Statistical Analysis - No raw data decryption" : "加密统计分析 - 不解密原始数据"}</li>
              <li>🏢 {t.locale === "en" ? "Complete Organization Management" : "完整的组织管理"}</li>
            </ul>
          </div>

          <div className="mb-6">
            <RainbowKitCustomConnectButton />
          </div>

          <p className="text-xs text-gray-500">
            {t.home?.connectToStart || (t.locale === "en" ? "Connect wallet to start using ConfidentialSalary" : "连接钱包开始使用 ConfidentialSalary")}
          </p>
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "dashboard", label: t.nav.dashboard, icon: "📊" },
    { id: "departments", label: t.nav.departments, icon: "🏢" },
    { id: "employees", label: t.nav.employees, icon: "👥" },
    { id: "salary", label: t.nav.salary, icon: "💰" },
    { id: "statistics", label: t.nav.statistics, icon: "📈" },
    { id: "permissions", label: t.nav.permissions, icon: "🔐" },
    { id: "optimizations", label: t.nav.optimizations, icon: "🎯" },
  ];

  return (
    <DataProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
        {/* Status Badges */}
        <StatusBadges />

        {/* Header */}
        <header className="bg-white/5 backdrop-blur-md shadow-sm border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Confidential
                </span>
                <span className="bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                  Salary
                </span>
              </h1>
              <p className="text-sm text-gray-200">{t.dashboard.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-400 text-blue-200 bg-blue-500/30"
                      : "border-transparent text-gray-200 hover:text-white hover:border-white/40"
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="dashboard">
          {activeTab === "dashboard" && <ConfidentialSalaryDashboard onStartGuide={() => setShowGuide(true)} />}
        </div>
        <div id="departments">
          {activeTab === "departments" && <DepartmentManagement />}
        </div>
        <div id="employees">
          {activeTab === "employees" && <EmployeeManagement />}
        </div>
        <div id="salary">
          {activeTab === "salary" && <SalaryManagement />}
        </div>
        <div id="statistics">
          {activeTab === "statistics" && <StatisticsAnalysis />}
        </div>
        <div id="permissions">
          {activeTab === "permissions" && <PermissionManagement />}
        </div>
        <div id="optimizations">
          {activeTab === "optimizations" && <OptimizationsShowcase />}
        </div>
      </main>

      {/* Onboarding Guide */}
      {showGuide && (
        <OnboardingGuide
          onClose={handleCloseGuide}
          onNavigateToTab={handleNavigateToTab}
        />
      )}

      {/* Quick Help */}
      <QuickHelp />
      </div>
    </DataProvider>
  );
}

