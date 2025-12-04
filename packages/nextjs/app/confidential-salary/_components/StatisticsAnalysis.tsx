"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { notification } from "~~/utils/helper/notification";
import { FHECalculationsDemo } from "./FHECalculationsDemo";
import { useLocale } from "~~/contexts/LocaleContext";

// 动态导入 Recharts 以避免 SSR 问题
const RechartsCharts = dynamic(
  () => import("./RechartsWrapper"),
  { 
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6">
          <div className="h-[300px] flex items-center justify-center text-gray-500">{t.locale === "en" ? "Loading chart..." : "加载图表中..."}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6">
          <div className="h-[300px] flex items-center justify-center text-gray-500">{t.locale === "en" ? "Loading chart..." : "加载图表中..."}</div>
        </div>
      </div>
    )
  }
);

export function StatisticsAnalysis() {
  const { t } = useLocale();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [stats, setStats] = useState<{
    totalSalary: string;
    avgSalary: string;
    employeeCount: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const departments = [
    { id: "1", name: t.locale === "en" ? "Technology" : "技术部" },
    { id: "2", name: t.locale === "en" ? "Marketing" : "市场部" },
    { id: "3", name: t.locale === "en" ? "Finance" : "财务部" },
  ];

  const handleCalculateStats = async () => {
    if (selectedDepartment) {
      setIsCalculating(true);
      // 模拟加密计算过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsCalculating(false);
      
      // 模拟统计结果（实际应该从合约获取）
      setStats({
        totalSalary: "150000",
        avgSalary: "15000",
        employeeCount: 10,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* FHE 计算演示 */}
      <FHECalculationsDemo />

      {/* Header with Feature Description */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <span className="text-3xl mr-3">📊</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.statistics.title}</h2>
            <p className="text-gray-700 mb-2">
              <strong>{t.locale === "en" ? "Core Function:" : "核心功能："}</strong> {t.statistics.subtitle}
            </p>
            <div className="bg-white rounded-lg p-3 mt-2">
              <p className="text-sm text-gray-700 mb-2">
                <strong>✨ {t.locale === "en" ? "Technical Highlights:" : "技术亮点："}</strong>
              </p>
              <ul className="text-sm text-gray-600 ml-4 list-disc space-y-1">
                <li>{t.locale === "en" ? "Can perform addition, subtraction, multiplication, division on encrypted data" : "可以在加密数据上直接进行加、减、乘、除等运算"}</li>
                <li>{t.locale === "en" ? "Calculate total salary, average salary, employee count and other statistics" : "计算总薪资、平均薪资、员工数量等统计信息"}</li>
                <li>{t.locale === "en" ? "No need to decrypt any individual employee salary data" : "无需解密任何单个员工的薪资数据"}</li>
                <li>{t.locale === "en" ? "Ensure complete privacy protection while supporting data analysis" : "确保完全的隐私保护，同时支持数据分析"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FHE Statistics Highlight */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">🔐</div>
          <div>
            <h3 className="text-xl font-bold mb-1">{t.locale === "en" ? "Fully Homomorphic Encryption Statistics" : "全同态加密统计"}</h3>
            <p className="text-orange-100">
              {t.locale === "en" ? "All calculations are performed on encrypted data without decrypting raw salary data" : "所有计算都在加密数据上进行，无需解密原始薪资数据"}
            </p>
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-4 mt-4">
          <p className="text-sm">
            <strong>{t.locale === "en" ? "Key Features:" : "关键特性："}</strong> {t.locale === "en" ? "Smart contracts can calculate total salary, average salary, employee count and other statistics, but cannot see any individual employee salary data. This ensures complete privacy protection!" : "智能合约可以计算总薪资、平均薪资、员工数等统计信息，但无法看到任何单个员工的薪资数据。这确保了完全的隐私保护！"}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-6">
        <RechartsCharts showCharts={true} />
      </div>

      {/* Department Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.locale === "en" ? "Select Department for Statistics" : "选择部门进行统计"}</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部门
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">{t.locale === "en" ? "Select department..." : "选择部门..."}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCalculateStats}
            disabled={!selectedDepartment || isCalculating}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? (t.locale === "en" ? "Calculating..." : "计算中...") : (t.locale === "en" ? "Calculate Statistics" : "计算统计")}
          </button>
        </div>
      </div>

      {/* Calculation Process Visualization */}
      {isCalculating && (
        <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <div>
              <p className="font-semibold text-orange-900 text-lg">正在计算统计（不解密原始数据）</p>
              <p className="text-sm text-orange-700 mt-1">
                步骤：🔐 加密数据 → ➕ 加密加法 → 📊 加密统计 → ✅ 解密统计结果
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 mt-4">
            <p className="text-sm text-gray-700">
              <strong>同态计算过程：</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
              <li>1. 读取所有员工的加密薪资数据</li>
              <li>2. 在不解密的情况下进行加密数据相加（同态加法）</li>
              <li>3. 计算平均值（加密数据除法）</li>
              <li>4. 统计员工数量</li>
              <li>5. 解密统计结果（只解密统计值，不解密原始数据）</li>
            </ul>
          </div>
        </div>
      )}

      {/* Statistics Results */}
      {stats && !isCalculating && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.locale === "en" ? "Total Salary (Encrypted Calculation)" : "总薪资（加密计算）"}</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalSalary}</p>
                <p className="text-xs text-gray-500 mt-1">🔐 {t.locale === "en" ? "No raw data decryption" : "不解密原始数据"}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.locale === "en" ? "Average Salary (Encrypted Calculation)" : "平均薪资（加密计算）"}</p>
                <p className="text-3xl font-bold text-gray-900">${stats.avgSalary}</p>
                <p className="text-xs text-gray-500 mt-1">🔐 {t.locale === "en" ? "No raw data decryption" : "不解密原始数据"}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{t.locale === "en" ? "Employee Count" : "员工数量"}</p>
                <p className="text-3xl font-bold text-gray-900">{stats.employeeCount}</p>
                <p className="text-xs text-gray-500 mt-1">👥 {t.locale === "en" ? "Department Employees" : "部门员工"}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Compliance Check */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.statistics.budgetCompliance}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.locale === "en" ? "Department Budget" : "部门预算"}
            </label>
            <input
              type="number"
              placeholder={t.locale === "en" ? "e.g., 200000" : "例如：200000"}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={async () => {
              const budgetInput = (document.querySelector('input[placeholder*="预算"]') as HTMLInputElement)?.value;
              if (!budgetInput || !selectedDepartment) {
                notification.warning(t.statistics.warning, { duration: 3000 });
                return;
              }
              const loadingId = notification.loading(t.statistics.checking, { duration: Infinity });
              // 模拟FHE计算过程
              setTimeout(() => {
                notification.remove(loadingId);
                notification.success(
                  <div className="space-y-2">
                    <div className="font-bold">✅ 预算合规检查完成</div>
                    <div className="text-sm">
                      <div className="mb-2">此功能将在不解密任何薪资数据的情况下，比较部门总薪资与预算。</div>
                      <div className="text-xs text-gray-400">功能将在后续版本中实现完整的智能合约调用。</div>
                    </div>
                  </div>,
                  { duration: 5000 }
                );
              }, 2000);
            }}
            className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
          >
            检查预算合规（不解密薪资）
          </button>
        </div>
      </div>

      {/* FHE Statistics Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">🔐 全同态加密统计原理</h4>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="bg-white rounded-lg p-3">
            <p className="font-semibold mb-1">{t.locale === "en" ? "Traditional Method (Requires Decryption):" : "传统方式（需要解密）："}</p>
            <p className="text-gray-700">
              {t.locale === "en" ? "Decrypt All Salaries → Calculate Statistics → Display Results" : "解密所有薪资 → 计算统计 → 显示结果"}
              <br />
              <span className="text-red-600">❌ {t.locale === "en" ? "Privacy Leakage Risk" : "隐私泄露风险"}</span>
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-semibold mb-1">{t.locale === "en" ? "FHE Method (No Raw Data Decryption):" : "FHE 方式（不解密原始数据）："}</p>
            <p className="text-gray-700">
              {t.locale === "en" ? "Encrypted Data Direct Calculation → Decrypt Statistics Result" : "加密数据直接计算 → 解密统计结果"}
              <br />
              <span className="text-green-600">✅ {t.locale === "en" ? "Complete Privacy Protection" : "完全隐私保护"}</span>
            </p>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="font-semibold text-blue-900">{t.locale === "en" ? "Key Advantages:" : "关键优势："}</p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-blue-800">
              <li>{t.locale === "en" ? "Smart contracts cannot see any individual employee salary" : "智能合约无法看到任何单个员工的薪资"}</li>
              <li>{t.locale === "en" ? "Statistical calculations are performed on encrypted data" : "统计计算在加密数据上进行"}</li>
              <li>{t.locale === "en" ? "Only statistics results are decrypted, raw data remains encrypted" : "只有统计结果被解密，原始数据保持加密"}</li>
              <li>{t.locale === "en" ? "Fully compliant with data protection regulations" : "完全符合数据保护法规要求"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

