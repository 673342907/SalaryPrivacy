"use client";

import { useState } from "react";
import { notification } from "~~/utils/helper/notification";

/**
 * FHE 计算演示组件
 * 展示各种同态加密计算能力
 */
export function FHECalculationsDemo() {
  const [calculations, setCalculations] = useState<Array<{
    id: number;
    type: string;
    description: string;
    result: string;
    timestamp: string;
  }>>([]);

  const performCalculation = async (type: string, description: string, result: string) => {
    const loadingId = notification.loading(`正在执行 ${type}...`, { duration: Infinity });
    
    // 模拟FHE计算过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCalc = {
      id: calculations.length + 1,
      type,
      description,
      result,
      timestamp: new Date().toLocaleTimeString('zh-CN'),
    };
    
    setCalculations([newCalc, ...calculations]);
    notification.remove(loadingId);
    notification.success(
      <div className="space-y-1">
        <div className="font-bold">✅ {type} 完成</div>
        <div className="text-sm">{description}</div>
        <div className="text-xs text-gray-400">结果：{result}</div>
      </div>,
      { duration: 4000 }
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">🔢</div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">FHE 加密计算演示</h3>
          <p className="text-gray-600 text-sm">在不解密数据的情况下进行各种计算操作</p>
        </div>
      </div>

      {/* 计算操作按钮 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => performCalculation(
            "加密加法",
            "计算两个加密薪资的总和（不解密原始数据）",
            "加密结果：euint32(总和)"
          )}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ➕ 加密加法
        </button>

        <button
          onClick={() => performCalculation(
            "加密平均值",
            "计算部门平均薪资（不解密任何员工薪资）",
            "加密结果：euint32(平均值)"
          )}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          📊 加密平均值
        </button>

        <button
          onClick={() => performCalculation(
            "加密比较",
            "比较两个加密薪资的大小（不解密原始值）",
            "加密结果：ebool(是否大于)"
          )}
          className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ⚖️ 加密比较
        </button>

        <button
          onClick={() => performCalculation(
            "加密范围查询",
            "查询薪资在指定范围内的员工数量（不解密薪资）",
            "加密结果：euint32(数量)"
          )}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🔍 范围查询
        </button>

        <button
          onClick={() => performCalculation(
            "加密统计",
            "计算部门薪资总和、最大值、最小值（全部加密计算）",
            "加密结果：{总和, 最大值, 最小值}"
          )}
          className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          📈 加密统计
        </button>

        <button
          onClick={() => performCalculation(
            "预算合规检查",
            "检查部门总薪资是否在预算内（不解密薪资和预算）",
            "加密结果：ebool(是否合规)"
          )}
          className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ✅ 预算合规
        </button>
      </div>

      {/* 计算历史记录 */}
      {calculations.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">计算历史记录</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{calc.type}</span>
                      <span className="text-xs text-gray-500">{calc.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{calc.description}</p>
                    <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                      {calc.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 技术说明 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 技术说明</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>所有计算都在加密数据上进行，无需解密原始值</li>
          <li>计算结果也是加密的，只有授权用户可以解密查看</li>
          <li>支持加法、比较、统计等多种同态加密操作</li>
          <li>完全保护数据隐私，同时支持数据分析需求</li>
        </ul>
      </div>
    </div>
  );
}

