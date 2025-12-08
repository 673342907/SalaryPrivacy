"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale } from "~~/contexts/LocaleContext";

interface ChartsProps {
  showCharts: boolean;
}

export default function RechartsWrapper({ showCharts }: ChartsProps) {
  const { t } = useLocale();

  if (!showCharts) return null;

  const isEnglish = t.locale === "en";

  const barData = [
    { name: isEnglish ? "Technology" : "技术部", salary: 500000, encrypted: true },
    { name: isEnglish ? "Marketing" : "市场部", salary: 300000, encrypted: true },
    { name: isEnglish ? "Finance" : "财务部", salary: 200000, encrypted: true },
    { name: isEnglish ? "HR" : "人事部", salary: 150000, encrypted: true },
  ];

  const pieData = [
    { name: isEnglish ? "Technology" : "技术部", value: 15, fill: "#3b82f6" },
    { name: isEnglish ? "Marketing" : "市场部", value: 8, fill: "#10b981" },
    { name: isEnglish ? "Finance" : "财务部", value: 5, fill: "#f59e0b" },
    { name: isEnglish ? "HR" : "人事部", value: 4, fill: "#ef4444" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Salary Distribution Chart */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span>
          {t.statistics?.charts?.salaryDistribution ||
            (t.locale === "en" ? "Department Salary Distribution (Encrypted Data)" : "部门薪资分布（加密数据）")}
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              formatter={(value: any) => [
                `🔒 ${value.toLocaleString()} ETH (${t.locale === "en" ? "Encrypted" : "加密"})`,
                t.locale === "en" ? "Salary" : "薪资",
              ]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="salary" fill="#6366f1" radius={[8, 8, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#6366f1", "#8b5cf6", "#a855f7", "#c084fc"][index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-600 mt-3 text-center bg-white/50 rounded px-3 py-2">
          💡{" "}
          {t.statistics?.charts?.dataCalculatedEncrypted ||
            (t.locale === "en"
              ? "Data is calculated in an encrypted state, no need to decrypt original salary"
              : "数据在加密状态下计算，无需解密原始薪资")}
        </p>
      </div>

      {/* Employee Count Pie Chart */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>👥</span>
          {t.statistics?.charts?.employeeDistribution ||
            (t.locale === "en" ? "Department Employee Distribution" : "部门员工分布")}
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px" }} />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-600 mt-3 text-center bg-white/50 rounded px-3 py-2">
          📊{" "}
          {t.statistics?.charts?.visualizeDistribution ||
            (t.locale === "en"
              ? "Visually display the distribution of employees in each department"
              : "可视化展示各部门员工数量分布")}
        </p>
      </div>
    </div>
  );
}
