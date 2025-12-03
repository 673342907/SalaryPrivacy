"use client";

import { useState } from "react";
import { useData } from "../_context/DataContext";
import { notification } from "~~/utils/helper/notification";

/**
 * 视频录制辅助工具
 * 帮助准备演示数据和检查录制环境
 */
export function VideoRecordingHelper() {
  const { departments, employees, salaries, setDepartments, setEmployees, setSalaries } = useData();
  const [isPreparing, setIsPreparing] = useState(false);
  const [checklist, setChecklist] = useState({
    dataGenerated: false,
    walletConnected: false,
    fhevmReady: false,
    testDataReady: false,
  });

  // 准备完整的演示数据
  const prepareDemoData = async () => {
    setIsPreparing(true);
    const loadingId = notification.loading("正在准备演示数据...", { duration: Infinity });

    try {
      // 生成部门数据
      const demoDepartments = [
        { id: 1, name: "技术部", budget: "500000", employeeCount: 15 },
        { id: 2, name: "市场部", budget: "300000", employeeCount: 8 },
        { id: 3, name: "财务部", budget: "200000", employeeCount: 5 },
        { id: 4, name: "人事部", budget: "150000", employeeCount: 4 },
      ];

      // 生成员工数据
      const demoEmployees = [
        { id: 1, address: "0x1234567890123456789012345678901234567890", name: "张三", role: "Admin" as const, department: "技术部" },
        { id: 2, address: "0x2345678901234567890123456789012345678901", name: "李四", role: "HR" as const, department: "人事部" },
        { id: 3, address: "0x3456789012345678901234567890123456789012", name: "王五", role: "Manager" as const, department: "技术部" },
        { id: 4, address: "0x4567890123456789012345678901234567890123", name: "赵六", role: "Employee" as const, department: "市场部" },
        { id: 5, address: "0x5678901234567890123456789012345678901234", name: "钱七", role: "Employee" as const, department: "财务部" },
        { id: 6, address: "0x6789012345678901234567890123456789012345", name: "孙八", role: "Employee" as const, department: "技术部" },
        { id: 7, address: "0x7890123456789012345678901234567890123456", name: "周九", role: "Employee" as const, department: "市场部" },
      ];

      // 生成薪资数据
      const demoSalaries = [
        { id: 1, employeeAddress: "0x1234567890123456789012345678901234567890", employeeName: "张三", amount: "50000", encrypted: true, submittedAt: new Date().toLocaleString('zh-CN') },
        { id: 2, employeeAddress: "0x2345678901234567890123456789012345678901", employeeName: "李四", amount: "30000", encrypted: true, submittedAt: new Date().toLocaleString('zh-CN') },
        { id: 3, employeeAddress: "0x3456789012345678901234567890123456789012", employeeName: "王五", amount: "40000", encrypted: true, submittedAt: new Date().toLocaleString('zh-CN') },
        { id: 4, employeeAddress: "0x4567890123456789012345678901234567890123", employeeName: "赵六", amount: "25000", encrypted: true, submittedAt: new Date().toLocaleString('zh-CN') },
        { id: 5, employeeAddress: "0x5678901234567890123456789012345678901234", employeeName: "钱七", amount: "28000", encrypted: true, submittedAt: new Date().toLocaleString('zh-CN') },
        { id: 6, employeeAddress: "0x6789012345678901234567890123456789012345", employeeName: "孙八", amount: "35000", encrypted: true, submittedAt: new Date().toLocaleString('zh-CN') },
        { id: 7, employeeAddress: "0x7890123456789012345678901234567890123456", employeeName: "周九", amount: "22000", encrypted: true, submittedAt: new Date().toLocaleString('zh-CN') },
      ];

      // 保存数据
      setDepartments(demoDepartments);
      setEmployees(demoEmployees);
      setSalaries(demoSalaries);

      // 更新检查清单
      setChecklist({
        ...checklist,
        dataGenerated: true,
        testDataReady: true,
      });

      notification.remove(loadingId);
      notification.success(
        <div className="space-y-1">
          <div className="font-bold">✅ 演示数据准备完成</div>
          <div className="text-sm">
            - {demoDepartments.length} 个部门
            <br />
            - {demoEmployees.length} 名员工
            <br />
            - {demoSalaries.length} 条薪资记录
          </div>
        </div>,
        { duration: 5000 }
      );
    } catch (error: any) {
      notification.remove(loadingId);
      notification.error(`准备数据失败: ${error.message}`, { duration: 5000 });
    } finally {
      setIsPreparing(false);
    }
  };

  // 检查录制环境
  const checkRecordingEnvironment = () => {
    const checks = {
      dataGenerated: departments.length > 0 && employees.length > 0 && salaries.length > 0,
      walletConnected: typeof window !== "undefined" && (window as any).ethereum,
      fhevmReady: true, // 这个需要在实际使用时检查
      testDataReady: departments.length >= 4 && employees.length >= 5 && salaries.length >= 5,
    };

    setChecklist(checks);

    const allReady = Object.values(checks).every(v => v);
    
    if (allReady) {
      notification.success("✅ 录制环境检查通过！可以开始录制了。", { duration: 5000 });
    } else {
      const missing = Object.entries(checks)
        .filter(([_, v]) => !v)
        .map(([k]) => k)
        .join("、");
      notification.warning(`⚠️ 请先完成：${missing}`, { duration: 5000 });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">🎬</div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">视频录制辅助工具</h3>
          <p className="text-gray-600 text-sm">帮助您准备演示数据和检查录制环境</p>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={prepareDemoData}
          disabled={isPreparing}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPreparing ? "准备中..." : "📦 准备完整演示数据"}
        </button>

        <button
          onClick={checkRecordingEnvironment}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
        >
          ✅ 检查录制环境
        </button>
      </div>

      {/* 检查清单 */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">录制前检查清单</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={checklist.dataGenerated ? "text-green-500" : "text-gray-400"}>
              {checklist.dataGenerated ? "✅" : "○"}
            </span>
            <span className={checklist.dataGenerated ? "text-gray-900" : "text-gray-500"}>
              演示数据已生成
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={checklist.walletConnected ? "text-green-500" : "text-gray-400"}>
              {checklist.walletConnected ? "✅" : "○"}
            </span>
            <span className={checklist.walletConnected ? "text-gray-900" : "text-gray-500"}>
              钱包已连接
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={checklist.fhevmReady ? "text-green-500" : "text-gray-400"}>
              {checklist.fhevmReady ? "✅" : "○"}
            </span>
            <span className={checklist.fhevmReady ? "text-gray-900" : "text-gray-500"}>
              FHEVM 已就绪
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={checklist.testDataReady ? "text-green-500" : "text-gray-400"}>
              {checklist.testDataReady ? "✅" : "○"}
            </span>
            <span className={checklist.testDataReady ? "text-gray-900" : "text-gray-500"}>
              测试数据充足（至少4个部门、5名员工、5条薪资）
            </span>
          </div>
        </div>
      </div>

      {/* 录制提示 */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">💡 录制提示</h4>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>确保浏览器窗口全屏显示（1920x1080）</li>
          <li>操作要流畅，重要步骤可以暂停说明</li>
          <li>使用鼠标高亮显示关键操作</li>
          <li>强调"不解密原始数据"的核心优势</li>
          <li>参考 VIDEO_SCRIPT.md 获取完整脚本</li>
        </ul>
      </div>
    </div>
  );
}

