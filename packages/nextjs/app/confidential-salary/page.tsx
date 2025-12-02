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
import { useState, useEffect } from "react";

type TabType = "dashboard" | "departments" | "employees" | "salary" | "statistics" | "permissions";

export default function ConfidentialSalaryPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [showGuide, setShowGuide] = useState(false);

  // 检查是否已经完成过引导
  useEffect(() => {
    if (isConnected) {
      const hasSeenGuide = localStorage.getItem("confidentialSalary_hasSeenGuide");
      if (!hasSeenGuide) {
        setShowGuide(true);
      }
    }
  }, [isConnected]);

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem("confidentialSalary_hasSeenGuide", "true");
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab as TabType);
    setShowGuide(false);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl mb-4">
              🔐
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ConfidentialSalary</h1>
            <p className="text-gray-600 mb-1">隐私保护薪资管理平台</p>
            <p className="text-sm text-gray-500">基于 FHEVM 的企业级隐私保护薪资管理系统</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">✨ 核心特性</h3>
            <ul className="text-left text-sm text-gray-700 space-y-1">
              <li>🔒 全同态加密保护 - 薪资数据全程加密</li>
              <li>👥 基于角色的权限管理</li>
              <li>📊 加密统计分析 - 不解密原始数据</li>
              <li>🏢 完整的组织管理</li>
            </ul>
          </div>

          <div className="mb-6">
            <RainbowKitCustomConnectButton />
          </div>

          <p className="text-xs text-gray-500">
            请连接钱包以开始使用 ConfidentialSalary
          </p>
        </div>
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "dashboard", label: "仪表板", icon: "📊" },
    { id: "departments", label: "部门管理", icon: "🏢" },
    { id: "employees", label: "员工管理", icon: "👥" },
    { id: "salary", label: "薪资管理", icon: "💰" },
    { id: "statistics", label: "统计分析", icon: "📈" },
    { id: "permissions", label: "权限管理", icon: "🔐" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ConfidentialSalary</h1>
              <p className="text-sm text-gray-600">隐私保护薪资管理平台</p>
            </div>
            <div className="flex items-center gap-4">
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
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
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
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
        {activeTab === "dashboard" && <ConfidentialSalaryDashboard onStartGuide={() => setShowGuide(true)} />}
        {activeTab === "departments" && <DepartmentManagement />}
        {activeTab === "employees" && <EmployeeManagement />}
        {activeTab === "salary" && <SalaryManagement />}
        {activeTab === "statistics" && <StatisticsAnalysis />}
        {activeTab === "permissions" && <PermissionManagement />}
      </main>

      {/* Onboarding Guide */}
      {showGuide && (
        <OnboardingGuide
          onClose={handleCloseGuide}
          onNavigateToTab={handleNavigateToTab}
        />
      )}
      </div>
  );
}

