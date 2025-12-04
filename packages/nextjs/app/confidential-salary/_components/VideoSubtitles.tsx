"use client";

import { useState, useEffect } from "react";
import { useLocale } from "~~/contexts/LocaleContext";

/**
 * 视频字幕组件
 * 在录制视频时显示文字说明，无需旁白
 */
export function VideoSubtitles() {
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  // 示例字幕内容（可以根据实际需要修改）
  const subtitles = {
    welcome: t.locale === "en" ? "Welcome to ConfidentialSalary - A privacy-preserving salary management system based on Fully Homomorphic Encryption" : "欢迎使用 ConfidentialSalary - 基于全同态加密的隐私保护薪资管理系统",
    connect: t.locale === "en" ? "Connect wallet and initialize FHEVM..." : "连接钱包并初始化 FHEVM...",
    generate: t.locale === "en" ? "One-click demo data generation - Automatically creates departments, employees, and salary records" : "一键生成演示数据 - 自动创建部门、员工和薪资记录",
    department: t.locale === "en" ? "Department Management - Budgets are stored encrypted, smart contracts cannot see raw values" : "部门管理 - 预算以加密形式存储，智能合约无法看到原始值",
    employee: t.locale === "en" ? "Employee Management - Supports four roles: Admin, HR, Manager, Employee" : "员工管理 - 支持四种角色：Admin、HR、Manager、Employee",
    salary: t.locale === "en" ? "Salary Management - Data is fully encrypted, only authorized users can decrypt and view" : "薪资管理 - 数据全程加密，只有授权用户可以解密查看",
    statistics: t.locale === "en" ? "Statistical Analysis - Perform statistical calculations without decrypting raw data" : "统计分析 - 在不解密原始数据的情况下进行统计计算",
    permission: t.locale === "en" ? "Permission Management - Role-based access control ensures data security" : "权限管理 - 基于角色的访问控制，确保数据安全",
  };

  // 监听键盘快捷键显示/隐藏字幕（录制时使用）
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "s" && e.ctrlKey) {
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 text-sm"
        >
          🎬 {t.locale === "en" ? "Show Subtitles (Ctrl+S)" : "显示字幕 (Ctrl+S)"}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-black/80 text-white rounded-lg p-4 backdrop-blur-sm border border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-blue-300">📝 {t.locale === "en" ? "Video Subtitles" : "视频字幕"}</div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white text-sm pointer-events-auto"
            >
              {t.locale === "en" ? "Hide (Ctrl+S)" : "隐藏 (Ctrl+S)"}
            </button>
          </div>
          <div className="text-lg font-medium min-h-[2rem]">
            {currentSubtitle || (t.locale === "en" ? "Ready to start recording..." : "准备开始录制...")}
          </div>
          <div className="mt-2 text-xs text-white/60">
            💡 {t.locale === "en" ? "Tip: These subtitles can help you record a no-voice demo video" : "提示：这些字幕可以帮助您录制无旁白的演示视频"}
          </div>
        </div>
      </div>
    </div>
  );
}
