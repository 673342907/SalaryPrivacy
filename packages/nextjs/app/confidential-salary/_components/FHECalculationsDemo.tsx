"use client";

import { useState } from "react";
import { notification } from "~~/utils/helper/notification";
import { useLocale } from "~~/contexts/LocaleContext";

/**
 * FHE 计算演示组件
 * 展示各种同态加密计算能力
 */
export function FHECalculationsDemo() {
  const { t } = useLocale();
  const [calculations, setCalculations] = useState<Array<{
    id: number;
    type: string;
    description: string;
    result: string;
    timestamp: string;
  }>>([]);

  // 安全获取翻译文本，避免 undefined 错误
  const getTranslation = (key: string, fallback: string) => {
    const keys = key.split('.');
    let value: any = t;
    for (const k of keys) {
      value = value?.[k];
      if (!value) return fallback;
    }
    return typeof value === 'string' ? value : fallback;
  };

  const performCalculation = async (type: string, description: string, result: string) => {
    const executingText = getTranslation('statistics.fheCalculationsDemo.executing', t.locale === "en" ? `Executing ${type}...` : `正在执行 ${type}...`);
    const loadingId = notification.loading(executingText.replace("{type}", type), { duration: Infinity });
    
    // 模拟FHE计算过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCalc = {
      id: calculations.length + 1,
      type,
      description,
      result,
      timestamp: new Date().toLocaleTimeString(t.locale === "en" ? "en-US" : "zh-CN"),
    };
    
    setCalculations([newCalc, ...calculations]);
    notification.remove(loadingId);
    
    const completedText = getTranslation('statistics.fheCalculationsDemo.completed', t.locale === "en" ? `${type} completed` : `${type} 完成`);
    const resultText = getTranslation('statistics.fheCalculationsDemo.result', t.locale === "en" ? `Result: {result}` : `结果：{result}`);
    
    notification.success(
      <div className="space-y-1">
        <div className="font-bold">✅ {completedText.replace("{type}", type)}</div>
        <div className="text-sm">{description}</div>
        <div className="text-xs text-gray-400">{resultText.replace("{result}", result)}</div>
      </div>,
      { duration: 4000 }
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">🔢</div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{t.statistics?.fheCalculationsDemo?.title || (t.locale === "en" ? "FHE Encrypted Computation Demo" : "FHE 加密计算演示")}</h3>
          <p className="text-gray-600 text-sm">{t.statistics?.fheCalculationsDemo?.subtitle || (t.locale === "en" ? "Perform various calculation operations without decrypting data" : "在不解密数据的情况下进行各种计算操作")}</p>
        </div>
      </div>

      {/* 计算操作按钮 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => performCalculation(
            t.statistics?.fheCalculationsDemo?.encryptedAddition || (t.locale === "en" ? "Encrypted Addition" : "加密加法"),
            t.locale === "en" ? "Calculate the sum of two encrypted salaries (without decrypting original data)" : "计算两个加密薪资的总和（不解密原始数据）",
            t.locale === "en" ? "Encrypted result: euint32(sum)" : "加密结果：euint32(总和)"
          )}
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ➕ {t.statistics?.fheCalculationsDemo?.encryptedAddition || (t.locale === "en" ? "Encrypted Addition" : "加密加法")}
        </button>

        <button
          onClick={() => performCalculation(
            t.statistics?.fheCalculationsDemo?.encryptedAverage || (t.locale === "en" ? "Encrypted Average" : "加密平均值"),
            t.locale === "en" ? "Calculate department average salary (without decrypting any employee salary)" : "计算部门平均薪资（不解密任何员工薪资）",
            t.locale === "en" ? "Encrypted result: euint32(average)" : "加密结果：euint32(平均值)"
          )}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          📊 {t.statistics?.fheCalculationsDemo?.encryptedAverage || (t.locale === "en" ? "Encrypted Average" : "加密平均值")}
        </button>

        <button
          onClick={() => performCalculation(
            t.statistics?.fheCalculationsDemo?.encryptedComparison || (t.locale === "en" ? "Encrypted Comparison" : "加密比较"),
            t.locale === "en" ? "Compare the size of two encrypted salaries (without decrypting original values)" : "比较两个加密薪资的大小（不解密原始值）",
            t.locale === "en" ? "Encrypted result: ebool(is greater)" : "加密结果：ebool(是否大于)"
          )}
          className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ⚖️ {t.statistics?.fheCalculationsDemo?.encryptedComparison || (t.locale === "en" ? "Encrypted Comparison" : "加密比较")}
        </button>

        <button
          onClick={() => performCalculation(
            t.statistics?.fheCalculationsDemo?.rangeQuery || (t.locale === "en" ? "Range Query" : "范围查询"),
            t.locale === "en" ? "Query the number of employees with salaries in the specified range (without decrypting salaries)" : "查询薪资在指定范围内的员工数量（不解密薪资）",
            t.locale === "en" ? "Encrypted result: euint32(count)" : "加密结果：euint32(数量)"
          )}
          className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🔍 {t.statistics?.fheCalculationsDemo?.rangeQuery || (t.locale === "en" ? "Range Query" : "范围查询")}
        </button>

        <button
          onClick={() => performCalculation(
            t.statistics?.fheCalculationsDemo?.encryptedStatistics || (t.locale === "en" ? "Encrypted Statistics" : "加密统计"),
            t.locale === "en" ? "Calculate department salary sum, maximum, minimum (all encrypted calculations)" : "计算部门薪资总和、最大值、最小值（全部加密计算）",
            t.locale === "en" ? "Encrypted result: {sum, max, min}" : "加密结果：{总和, 最大值, 最小值}"
          )}
          className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          📈 {t.statistics?.fheCalculationsDemo?.encryptedStatistics || (t.locale === "en" ? "Encrypted Statistics" : "加密统计")}
        </button>

        <button
          onClick={() => performCalculation(
            t.statistics?.fheCalculationsDemo?.budgetCompliance || (t.locale === "en" ? "Budget Compliance" : "预算合规"),
            t.locale === "en" ? "Check if department total salary is within budget (without decrypting salary and budget)" : "检查部门总薪资是否在预算内（不解密薪资和预算）",
            t.locale === "en" ? "Encrypted result: ebool(is compliant)" : "加密结果：ebool(是否合规)"
          )}
          className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
        >
          ✅ {t.statistics?.fheCalculationsDemo?.budgetCompliance || (t.locale === "en" ? "Budget Compliance" : "预算合规")}
        </button>
      </div>

      {/* 计算历史记录 */}
      {calculations.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">{t.statistics?.fheCalculationsDemo?.calculationHistory || (t.locale === "en" ? "Calculation History" : "计算历史记录")}</h4>
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
        <h4 className="font-semibold text-blue-900 mb-2">💡 {t.statistics?.fheCalculationsDemo?.technicalNote || (t.locale === "en" ? "Technical Note" : "技术说明")}</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>{t.statistics?.fheCalculationsDemo?.note1 || (t.locale === "en" ? "All calculations are performed on encrypted data, no need to decrypt original values" : "所有计算都在加密数据上进行，无需解密原始值")}</li>
          <li>{t.statistics?.fheCalculationsDemo?.note2 || (t.locale === "en" ? "Calculation results are also encrypted, only authorized users can decrypt and view them" : "计算结果也是加密的，只有授权用户可以解密查看")}</li>
          <li>{t.statistics?.fheCalculationsDemo?.note3 || (t.locale === "en" ? "Supports various homomorphic encryption operations such as addition, comparison, and statistics" : "支持加法、比较、统计等多种同态加密操作")}</li>
          <li>{t.statistics?.fheCalculationsDemo?.note4 || (t.locale === "en" ? "Completely protects data privacy while supporting data analysis needs" : "完全保护数据隐私，同时支持数据分析需求")}</li>
        </ul>
      </div>
    </div>
  );
}

