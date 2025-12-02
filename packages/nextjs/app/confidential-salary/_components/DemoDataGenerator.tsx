"use client";

import { useState } from "react";

interface DemoDataGeneratorProps {
  onGenerate?: (data: {
    departments: Array<{ id: number; name: string; budget: string; employeeCount: number }>;
    employees: Array<{ id: number; address: string; name: string; role: string; department: string }>;
    salaries: Array<{ id: number; employeeAddress: string; employeeName: string; amount: string; encrypted: boolean; submittedAt: string }>;
  }) => void;
}

export function DemoDataGenerator({ onGenerate }: DemoDataGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    const demoData = {
      departments: [
        { id: 1, name: "技术部", budget: "500000", employeeCount: 15 },
        { id: 2, name: "市场部", budget: "300000", employeeCount: 8 },
        { id: 3, name: "财务部", budget: "200000", employeeCount: 5 },
        { id: 4, name: "人事部", budget: "150000", employeeCount: 4 },
      ],
      employees: [
        { id: 1, address: "0x1234...5678", name: "张三", role: "Admin", department: "技术部" },
        { id: 2, address: "0x2345...6789", name: "李四", role: "HR", department: "人事部" },
        { id: 3, address: "0x3456...7890", name: "王五", role: "Manager", department: "技术部" },
        { id: 4, address: "0x4567...8901", name: "赵六", role: "Employee", department: "市场部" },
        { id: 5, address: "0x5678...9012", name: "钱七", role: "Employee", department: "财务部" },
      ],
      salaries: [
        { id: 1, employeeAddress: "0x1234...5678", employeeName: "张三", amount: "50000", encrypted: true, submittedAt: "2024-01-15 10:30" },
        { id: 2, employeeAddress: "0x2345...6789", employeeName: "李四", amount: "30000", encrypted: true, submittedAt: "2024-01-15 11:00" },
        { id: 3, employeeAddress: "0x3456...7890", employeeName: "王五", amount: "40000", encrypted: true, submittedAt: "2024-01-15 11:30" },
        { id: 4, employeeAddress: "0x4567...8901", employeeName: "赵六", amount: "25000", encrypted: true, submittedAt: "2024-01-15 12:00" },
        { id: 5, employeeAddress: "0x5678...9012", employeeName: "钱七", amount: "28000", encrypted: true, submittedAt: "2024-01-15 12:30" },
      ],
    };

    setIsGenerating(false);
    if (onGenerate) {
      onGenerate(demoData);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">🚀 快速演示</h3>
          <p className="text-indigo-100 text-sm">
            一键生成演示数据，快速体验所有功能
          </p>
        </div>
        <div className="text-4xl">✨</div>
      </div>
      
      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <p className="text-sm text-white/90 mb-2">
          <strong>将生成：</strong>
        </p>
        <ul className="text-sm text-white/80 space-y-1">
          <li>✅ 4 个部门（技术部、市场部、财务部、人事部）</li>
          <li>✅ 5 名员工（不同角色和部门）</li>
          <li>✅ 5 条加密薪资记录</li>
        </ul>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            <span>正在生成演示数据...</span>
          </>
        ) : (
          <>
            <span>✨</span>
            <span>一键生成演示数据</span>
          </>
        )}
      </button>
    </div>
  );
}

