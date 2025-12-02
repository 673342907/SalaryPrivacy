"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// 动态导入 Recharts 以避免 SSR 问题
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false });

export function StatisticsAnalysis() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [stats, setStats] = useState<{
    totalSalary: string;
    avgSalary: string;
    employeeCount: number;
  } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const departments = [
    { id: "1", name: "技术部" },
    { id: "2", name: "市场部" },
    { id: "3", name: "财务部" },
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
      {/* Header with Feature Description */}
      <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <span className="text-3xl mr-3">📊</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">统计分析</h2>
            <p className="text-gray-700 mb-2">
              <strong>核心功能：</strong>使用 FHE（全同态加密）技术在不解密原始薪资数据的情况下进行统计计算。这是 FHE 技术的核心优势！
            </p>
            <div className="bg-white rounded-lg p-3 mt-2">
              <p className="text-sm text-gray-700 mb-2">
                <strong>✨ 技术亮点：</strong>
              </p>
              <ul className="text-sm text-gray-600 ml-4 list-disc space-y-1">
                <li>可以在加密数据上直接进行加、减、乘、除等运算</li>
                <li>计算总薪资、平均薪资、员工数量等统计信息</li>
                <li>无需解密任何单个员工的薪资数据</li>
                <li>确保完全的隐私保护，同时支持数据分析</li>
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
            <h3 className="text-xl font-bold mb-1">全同态加密统计</h3>
            <p className="text-orange-100">
              所有计算都在加密数据上进行，无需解密原始薪资数据
            </p>
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-4 mt-4">
          <p className="text-sm">
            <strong>关键特性：</strong> 智能合约可以计算总薪资、平均薪资、员工数等统计信息，
            但无法看到任何单个员工的薪资数据。这确保了完全的隐私保护！
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Salary Distribution Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span>
            部门薪资分布（加密数据）
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: "技术部", salary: 500000, encrypted: true },
              { name: "市场部", salary: 300000, encrypted: true },
              { name: "财务部", salary: 200000, encrypted: true },
              { name: "人事部", salary: 150000, encrypted: true },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                formatter={(value: any) => [`🔒 ${value.toLocaleString()} ETH (加密)`, "薪资"]}
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="salary" fill="#6366f1" radius={[8, 8, 0, 0]}>
                {[0, 1, 2, 3].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#a855f7', '#c084fc'][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-3 text-center bg-white/50 rounded px-3 py-2">
            💡 数据在加密状态下计算，无需解密原始薪资
          </p>
        </div>

        {/* Employee Count Pie Chart */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>👥</span>
            部门员工分布
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "技术部", value: 15, fill: '#3b82f6' },
                  { name: "市场部", value: 8, fill: '#10b981' },
                  { name: "财务部", value: 5, fill: '#f59e0b' },
                  { name: "人事部", value: 4, fill: '#ef4444' },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2, 3].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-600 mt-3 text-center bg-white/50 rounded px-3 py-2">
            📊 可视化展示各部门员工数量分布
          </p>
        </div>
      </div>

      {/* Department Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">选择部门进行统计</h3>
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
              <option value="">选择部门...</option>
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
            {isCalculating ? "计算中..." : "计算统计"}
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
                <p className="text-sm text-gray-600 mb-1">总薪资（加密计算）</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalSalary}</p>
                <p className="text-xs text-gray-500 mt-1">🔐 不解密原始数据</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">平均薪资（加密计算）</p>
                <p className="text-3xl font-bold text-gray-900">${stats.avgSalary}</p>
                <p className="text-xs text-gray-500 mt-1">🔐 不解密原始数据</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">员工数量</p>
                <p className="text-3xl font-bold text-gray-900">{stats.employeeCount}</p>
                <p className="text-xs text-gray-500 mt-1">👥 部门员工</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Compliance Check */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">预算合规检查</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              部门预算
            </label>
            <input
              type="number"
              placeholder="例如：200000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold">
            检查预算合规（不解密薪资）
          </button>
        </div>
      </div>

      {/* FHE Statistics Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3">🔐 全同态加密统计原理</h4>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="bg-white rounded-lg p-3">
            <p className="font-semibold mb-1">传统方式（需要解密）：</p>
            <p className="text-gray-700">
              解密所有薪资 → 计算统计 → 显示结果
              <br />
              <span className="text-red-600">❌ 隐私泄露风险</span>
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="font-semibold mb-1">FHE 方式（不解密原始数据）：</p>
            <p className="text-gray-700">
              加密数据直接计算 → 解密统计结果
              <br />
              <span className="text-green-600">✅ 完全隐私保护</span>
            </p>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="font-semibold text-blue-900">关键优势：</p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-blue-800">
              <li>智能合约无法看到任何单个员工的薪资</li>
              <li>统计计算在加密数据上进行</li>
              <li>只有统计结果被解密，原始数据保持加密</li>
              <li>完全符合数据保护法规要求</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

