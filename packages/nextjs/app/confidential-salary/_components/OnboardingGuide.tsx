"use client";

import { useState, useEffect } from "react";

type Step = {
  id: number;
  title: string;
  description: string;
  icon: string;
  action?: string;
  tab?: string;
  animation?: string;
};

const steps: Step[] = [
  {
    id: 1,
    title: "创建部门",
    description: "首先创建一个部门，设置部门名称和加密预算。这是整个系统的基础。",
    icon: "🏢",
    action: "前往部门管理",
    tab: "departments",
    animation: "部门创建动画",
  },
  {
    id: 2,
    title: "添加员工",
    description: "在员工管理中添加员工，分配员工到部门，并设置角色（Admin、HR、Manager、Employee）。",
    icon: "👥",
    action: "前往员工管理",
    tab: "employees",
    animation: "员工添加动画",
  },
  {
    id: 3,
    title: "提交薪资",
    description: "使用 FHE 加密技术提交员工薪资。薪资数据将以加密形式存储在区块链上。",
    icon: "💰",
    action: "前往薪资管理",
    tab: "salary",
    animation: "加密过程动画",
  },
  {
    id: 4,
    title: "统计分析",
    description: "在不解密原始数据的情况下，查看部门统计、平均薪资等分析结果。",
    icon: "📊",
    action: "前往统计分析",
    tab: "statistics",
    animation: "统计计算动画",
  },
  {
    id: 5,
    title: "权限管理",
    description: "查看和管理不同角色的权限设置，了解谁可以访问哪些数据。",
    icon: "🔐",
    action: "前往权限管理",
    tab: "permissions",
    animation: "权限设置动画",
  },
];

interface OnboardingGuideProps {
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export function OnboardingGuide({ onClose, onNavigateToTab }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  // 自动播放动画
  useEffect(() => {
    if (!isAutoPlaying || isCompleted) return;

    const phases = [0, 1, 2, 3]; // 动画阶段
    let phaseIndex = 0;

    const phaseInterval = setInterval(() => {
      setAnimationPhase(phases[phaseIndex]);
      phaseIndex = (phaseIndex + 1) % phases.length;
    }, 800); // 每800ms切换一个动画阶段

    return () => clearInterval(phaseInterval);
  }, [currentStep, isAutoPlaying, isCompleted]);

  // 自动进入下一步
  useEffect(() => {
    if (!isAutoPlaying || isCompleted) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setAnimationPhase(0);
      } else {
        setIsCompleted(true);
      }
    }, 5000); // 每个步骤显示5秒

    return () => clearTimeout(timer);
  }, [currentStep, isAutoPlaying, isCompleted]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setAnimationPhase(0);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnimationPhase(0);
    }
  };

  const handleNavigate = () => {
    setIsAutoPlaying(false);
    if (currentStepData.tab && onNavigateToTab) {
      onNavigateToTab(currentStepData.tab);
    }
  };

  const handleSkip = () => {
    setIsAutoPlaying(false);
    onClose();
  };

  const handlePause = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // 渲染动画内容
  const renderAnimation = () => {
    switch (currentStepData.id) {
      case 1: // 创建部门
        return (
          <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-8xl transition-all duration-500 ${animationPhase === 1 ? 'scale-125 rotate-12' : animationPhase === 2 ? 'scale-110 -rotate-12' : 'scale-100 rotate-0'}`}>
                🏢
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${animationPhase >= 1 ? 'bg-green-500' : 'bg-gray-300'} transition-all duration-300`}></div>
                  <span className={animationPhase >= 1 ? 'text-green-700 font-semibold' : 'text-gray-500'}>
                    {animationPhase >= 1 ? '✓' : '○'} 输入部门名称
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${animationPhase >= 2 ? 'bg-green-500' : 'bg-gray-300'} transition-all duration-300`}></div>
                  <span className={animationPhase >= 2 ? 'text-green-700 font-semibold' : 'text-gray-500'}>
                    {animationPhase >= 2 ? '✓' : '○'} 设置加密预算
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${animationPhase >= 3 ? 'bg-green-500' : 'bg-gray-300'} transition-all duration-300`}></div>
                  <span className={animationPhase >= 3 ? 'text-green-700 font-semibold' : 'text-gray-500'}>
                    {animationPhase >= 3 ? '✓' : '○'} 部门创建完成
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // 添加员工
        return (
          <div className="relative h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`text-6xl transition-all duration-500 ${
                      animationPhase > i
                        ? 'scale-110 translate-y-0 opacity-100'
                        : 'scale-50 translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${i * 200}ms` }}
                  >
                    👤
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-2xl animate-bounce">👥</span>
                  <span className="font-semibold text-gray-700">
                    {animationPhase === 0 && "准备添加员工..."}
                    {animationPhase === 1 && "正在添加员工 1..."}
                    {animationPhase === 2 && "正在添加员工 2..."}
                    {animationPhase === 3 && "✓ 3名员工已添加"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // 提交薪资
        return (
          <div className="relative h-64 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-6xl mb-4 transition-all duration-500 ${animationPhase >= 1 ? 'scale-125' : 'scale-100'}`}>
                  💰
                </div>
                <div className="relative">
                  {animationPhase >= 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-purple-500 rounded-full animate-spin-slow">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          🔐
                        </div>
                      </div>
                    </div>
                  )}
                  {animationPhase >= 2 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl animate-pulse">🔒</div>
                    </div>
                  )}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  {animationPhase === 0 && "原始薪资数据"}
                  {animationPhase === 1 && "正在加密..."}
                  {animationPhase === 2 && "加密完成"}
                  {animationPhase === 3 && "✓ 已存储到区块链"}
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // 统计分析
        return (
          <div className="relative h-64 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full px-8">
                <div className="flex items-end justify-center gap-2 h-32">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-t from-orange-500 to-red-500 rounded-t-lg transition-all duration-500 ${
                        animationPhase > i ? 'w-12 h-full' : 'w-12 h-0'
                      }`}
                      style={{ transitionDelay: `${i * 200}ms` }}
                    >
                      <div className="text-white text-xs font-semibold p-2 text-center">
                        {animationPhase > i ? (i + 1) * 25 : ''}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-700">
                  {animationPhase === 0 && "准备统计..."}
                  {animationPhase === 1 && "正在计算（不解密数据）..."}
                  {animationPhase === 2 && "统计计算中..."}
                  {animationPhase === 3 && "✓ 统计完成"}
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // 权限管理
        return (
          <div className="relative h-64 bg-gradient-to-br from-red-50 to-pink-100 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                {['Admin', 'HR', 'Manager', 'Employee'].map((role, i) => (
                  <div
                    key={role}
                    className={`bg-white rounded-lg p-4 shadow-md transition-all duration-500 ${
                      animationPhase > i
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-50 opacity-0 translate-y-4'
                    }`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                  >
                    <div className="text-2xl mb-2">🔐</div>
                    <div className="text-sm font-semibold text-gray-700">{role}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {animationPhase > i ? '权限已设置' : '...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full animate-slideInUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold animate-fadeInLeft">欢迎使用 ConfidentialSalary</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePause}
                className="text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
                title={isAutoPlaying ? "暂停" : "播放"}
              >
                {isAutoPlaying ? "⏸️" : "▶️"}
              </button>
              <button
                onClick={handleSkip}
                className="text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                ✕
              </button>
            </div>
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
            步骤 {currentStep + 1} / {steps.length} {isAutoPlaying && "（自动播放中...）"}
          </p>
        </div>

        {/* Content with Animation */}
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {currentStepData.description}
            </p>
            
            {/* Animation Area */}
            {renderAnimation()}
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
            <div className="mb-6">
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
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              currentStep === 0
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
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg"
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
