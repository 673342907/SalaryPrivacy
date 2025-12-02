"use client";

import { useState, useEffect } from "react";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: string;
  action?: string;
  tab?: string;
};

const steps: Step[] = [
  {
    id: 1,
    title: "创建部门",
    description: "首先创建一个部门，设置部门名称和加密预算。这是整个系统的基础。",
    icon: "🏢",
    action: "前往部门管理",
    tab: "departments",
  },
  {
    id: 2,
    title: "添加员工",
    description: "在员工管理中添加员工，分配员工到部门，并设置角色（Admin、HR、Manager、Employee）。",
    icon: "👥",
    action: "前往员工管理",
    tab: "employees",
  },
  {
    id: 3,
    title: "提交薪资",
    description: "使用 FHE 加密技术提交员工薪资。薪资数据将以加密形式存储在区块链上。",
    icon: "💰",
    action: "前往薪资管理",
    tab: "salary",
  },
  {
    id: 4,
    title: "统计分析",
    description: "在不解密原始数据的情况下，查看部门统计、平均薪资等分析结果。",
    icon: "📊",
    action: "前往统计分析",
    tab: "statistics",
  },
  {
    id: 5,
    title: "权限管理",
    description: "查看和管理不同角色的权限设置，了解谁可以访问哪些数据。",
    icon: "🔐",
    action: "前往权限管理",
    tab: "permissions",
  },
];

interface OnboardingGuideProps {
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export function OnboardingGuide({ onClose, onNavigateToTab }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // 步骤切换动画
  useEffect(() => {
    setShowContent(false);
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsCompleted(true);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handlePrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleNavigate = () => {
    if (currentStepData.tab && onNavigateToTab) {
      onNavigateToTab(currentStepData.tab);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (isCompleted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-scaleIn">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-fadeInUp">引导完成！</h2>
          <p className="text-gray-600 mb-6 animate-fadeInUp animation-delay-100">
            您已经了解了 ConfidentialSalary 的所有核心功能。现在可以开始使用系统了！
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105 animate-fadeInUp animation-delay-200"
          >
            开始使用
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full animate-slideInUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold animate-fadeInLeft">欢迎使用 ConfidentialSalary</h2>
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
            >
              ✕
            </button>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/50 animate-shimmer"></div>
            </div>
          </div>
          <p className="text-sm text-blue-100 mt-2 animate-fadeIn">
            步骤 {currentStep + 1} / {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className={`text-center mb-6 transition-all duration-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className={`text-6xl mb-4 inline-block transition-all duration-300 ${showContent ? 'scale-100 rotate-0' : 'scale-50 rotate-180'}`}>
              {currentStepData.icon}
            </div>
            <h3 className={`text-2xl font-bold text-gray-900 mb-2 transition-all duration-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {currentStepData.title}
            </h3>
            <p className={`text-gray-600 text-lg transition-all duration-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {currentStepData.description}
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "bg-blue-600 scale-125 animate-pulse"
                    : index < currentStep
                    ? "bg-green-500 scale-110"
                    : "bg-gray-300 scale-100"
                }`}
              />
            ))}
          </div>

          {/* Action Button */}
          {currentStepData.action && (
            <div className={`mb-6 transition-all duration-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button
                onClick={handleNavigate}
                className="w-full px-6 py-3 bg-blue-50 border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg hover:border-blue-400"
              >
                <span className="inline-flex items-center gap-2">
                  {currentStepData.action}
                  <span className="animate-bounce">→</span>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0 || isAnimating}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              currentStep === 0 || isAnimating
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-105"
            }`}
          >
            <span className="inline-flex items-center gap-1">
              <span className="transition-transform duration-300 hover:-translate-x-1">←</span>
              上一步
            </span>
          </button>
          <button
            onClick={handleSkip}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 hover:scale-105"
          >
            跳过引导
          </button>
          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="inline-flex items-center gap-1">
              {currentStep === steps.length - 1 ? "完成" : "下一步"}
              {currentStep !== steps.length - 1 && (
                <span className="transition-transform duration-300 hover:translate-x-1">→</span>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

