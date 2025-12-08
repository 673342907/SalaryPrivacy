"use client";

import { useState } from "react";
import { useData } from "../_context/DataContext";
import { useLocale } from "~~/contexts/LocaleContext";

interface DemoDataGeneratorProps {
  onGenerate?: (data: {
    departments: Array<{ id: number; name: string; budget: string; employeeCount: number }>;
    employees: Array<{ id: number; address: string; name: string; role: string; department: string }>;
    salaries: Array<{
      id: number;
      employeeAddress: string;
      employeeName: string;
      amount: string;
      encrypted: boolean;
      submittedAt: string;
    }>;
  }) => void;
}

export function DemoDataGenerator({ onGenerate }: DemoDataGeneratorProps) {
  const { t } = useLocale();
  const [isGenerating, setIsGenerating] = useState(false);
  const { setDepartments, setEmployees, setSalaries } = useData();

  const handleGenerate = async () => {
    setIsGenerating(true);

    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    const isEnglish = t.locale === "en";

    const demoData = {
      departments: isEnglish
        ? [
            { id: 1, name: "Technology", budget: "500000", employeeCount: 15 },
            { id: 2, name: "Marketing", budget: "300000", employeeCount: 8 },
            { id: 3, name: "Finance", budget: "200000", employeeCount: 5 },
            { id: 4, name: "HR", budget: "150000", employeeCount: 4 },
          ]
        : [
            { id: 1, name: "技术部", budget: "500000", employeeCount: 15 },
            { id: 2, name: "市场部", budget: "300000", employeeCount: 8 },
            { id: 3, name: "财务部", budget: "200000", employeeCount: 5 },
            { id: 4, name: "人事部", budget: "150000", employeeCount: 4 },
          ],
      employees: isEnglish
        ? [
            {
              id: 1,
              address: "0x1234567890123456789012345678901234567890",
              name: "John",
              role: "Admin" as const,
              department: "Technology",
            },
            {
              id: 2,
              address: "0x2345678901234567890123456789012345678901",
              name: "Jane",
              role: "HR" as const,
              department: "HR",
            },
            {
              id: 3,
              address: "0x3456789012345678901234567890123456789012",
              name: "Bob",
              role: "Manager" as const,
              department: "Technology",
            },
            {
              id: 4,
              address: "0x4567890123456789012345678901234567890123",
              name: "Alice",
              role: "Employee" as const,
              department: "Marketing",
            },
            {
              id: 5,
              address: "0x5678901234567890123456789012345678901234",
              name: "Charlie",
              role: "Employee" as const,
              department: "Finance",
            },
          ]
        : [
            {
              id: 1,
              address: "0x1234567890123456789012345678901234567890",
              name: "张三",
              role: "Admin" as const,
              department: "技术部",
            },
            {
              id: 2,
              address: "0x2345678901234567890123456789012345678901",
              name: "李四",
              role: "HR" as const,
              department: "人事部",
            },
            {
              id: 3,
              address: "0x3456789012345678901234567890123456789012",
              name: "王五",
              role: "Manager" as const,
              department: "技术部",
            },
            {
              id: 4,
              address: "0x4567890123456789012345678901234567890123",
              name: "赵六",
              role: "Employee" as const,
              department: "市场部",
            },
            {
              id: 5,
              address: "0x5678901234567890123456789012345678901234",
              name: "钱七",
              role: "Employee" as const,
              department: "财务部",
            },
          ],
      salaries: isEnglish
        ? [
            {
              id: 1,
              employeeAddress: "0x1234567890123456789012345678901234567890",
              employeeName: "John",
              amount: "50000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("en-US"),
            },
            {
              id: 2,
              employeeAddress: "0x2345678901234567890123456789012345678901",
              employeeName: "Jane",
              amount: "30000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("en-US"),
            },
            {
              id: 3,
              employeeAddress: "0x3456789012345678901234567890123456789012",
              employeeName: "Bob",
              amount: "40000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("en-US"),
            },
            {
              id: 4,
              employeeAddress: "0x4567890123456789012345678901234567890123",
              employeeName: "Alice",
              amount: "25000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("en-US"),
            },
            {
              id: 5,
              employeeAddress: "0x5678901234567890123456789012345678901234",
              employeeName: "Charlie",
              amount: "28000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("en-US"),
            },
          ]
        : [
            {
              id: 1,
              employeeAddress: "0x1234567890123456789012345678901234567890",
              employeeName: "张三",
              amount: "50000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("zh-CN"),
            },
            {
              id: 2,
              employeeAddress: "0x2345678901234567890123456789012345678901",
              employeeName: "李四",
              amount: "30000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("zh-CN"),
            },
            {
              id: 3,
              employeeAddress: "0x3456789012345678901234567890123456789012",
              employeeName: "王五",
              amount: "40000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("zh-CN"),
            },
            {
              id: 4,
              employeeAddress: "0x4567890123456789012345678901234567890123",
              employeeName: "赵六",
              amount: "25000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("zh-CN"),
            },
            {
              id: 5,
              employeeAddress: "0x5678901234567890123456789012345678901234",
              employeeName: "钱七",
              amount: "28000",
              encrypted: true,
              submittedAt: new Date().toLocaleString("zh-CN"),
            },
          ],
    };

    // 将数据保存到 Context
    setDepartments(demoData.departments);
    setEmployees(demoData.employees);
    setSalaries(demoData.salaries);

    setIsGenerating(false);
    if (onGenerate) {
      onGenerate(demoData);
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-4">
      <div className="bg-white/10 rounded-lg p-3 mb-4">
        <p className="text-sm text-white/90 mb-2 font-semibold">
          ✨ {t.locale === "en" ? "Will automatically generate:" : "将自动生成："}
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-2xl mb-1">🏢</div>
            <div className="text-white font-semibold">{t.locale === "en" ? "4 Departments" : "4 个部门"}</div>
            <div className="text-white/70">
              {t.locale === "en" ? "Tech/Marketing/Finance/HR" : "技术/市场/财务/人事"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">👥</div>
            <div className="text-white font-semibold">{t.locale === "en" ? "5 Employees" : "5 名员工"}</div>
            <div className="text-white/70">{t.locale === "en" ? "Different roles" : "不同角色"}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="text-white font-semibold">{t.locale === "en" ? "5 Salaries" : "5 条薪资"}</div>
            <div className="text-white/70">{t.locale === "en" ? "Encrypted" : "已加密"}</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-lg hover:from-yellow-300 hover:to-orange-400 transition-all font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-105"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            <span>{t.locale === "en" ? "Generating..." : "正在生成..."}</span>
          </>
        ) : (
          <>
            <span className="text-2xl">✨</span>
            <span>{t.locale === "en" ? "Generate Demo Data" : "一键生成演示数据"}</span>
            <span className="text-xl">→</span>
          </>
        )}
      </button>
      <p className="text-xs text-white/70 text-center mt-3">
        💡{" "}
        {t.locale === "en"
          ? "After generation, you can directly view all modules, no manual creation needed"
          : "生成后可直接查看所有模块，无需手动创建"}
      </p>
    </div>
  );
}
