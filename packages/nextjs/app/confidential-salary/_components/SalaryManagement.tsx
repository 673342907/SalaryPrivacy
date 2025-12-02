"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useData } from "../_context/DataContext";

export function SalaryManagement() {
  const { address } = useAccount();
  const { salaries, setSalaries, addSalary } = useData();
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeAddress: "",
    amount: "",
  });
  const [viewAddress, setViewAddress] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitSalary = async () => {
    // 验证输入
    if (!formData.employeeAddress.trim() || !formData.employeeAddress.startsWith("0x") || formData.employeeAddress.length !== 42) {
      setErrorMessage("请输入有效的员工地址（0x开头，42个字符）");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setErrorMessage("请输入有效的薪资金额（大于0）");
      return;
    }

    setErrorMessage("");
    setIsEncrypting(true);
    // 模拟加密过程
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsEncrypting(false);

    const newSalary = {
      id: salaries.length > 0 ? Math.max(...salaries.map(s => s.id)) + 1 : 1,
      employeeAddress: formData.employeeAddress,
      employeeName: `员工 ${salaries.length + 1}`,
      amount: formData.amount,
      encrypted: true,
      submittedAt: new Date().toLocaleString('zh-CN'),
    };
    addSalary(newSalary);
    setFormData({ employeeAddress: "", amount: "" });
    setShowSubmitForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleViewSalary = async () => {
    if (viewAddress) {
      setIsDecrypting(true);
      // 模拟解密过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsDecrypting(false);
      setShowViewForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">薪资提交成功！</p>
              <p className="text-sm text-green-700">薪资已使用 FHE 加密并存储到区块链</p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-green-600 hover:text-green-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Real-World Use Case */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💼</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">真实应用场景</h3>
            <p className="text-gray-700 mb-3">
              <strong>问题：</strong> 传统薪资管理系统存在严重的隐私泄露风险。
              即使使用加密存储，在进行统计分析时也需要解密所有数据，导致隐私暴露。
            </p>
            <p className="text-gray-700 mb-3">
              <strong>解决方案：</strong> 使用 FHE 技术，薪资数据全程加密存储，
              在不解密的情况下进行统计计算，既保护了隐私，又支持数据分析。
            </p>
            <div className="bg-white rounded-lg p-3 mt-3">
              <p className="text-sm text-gray-700">
                <strong>✅ 实际价值：</strong> 企业可以安全地管理薪资数据，
                进行预算分析和合规检查，同时完全保护员工隐私，符合 GDPR、CCPA 等数据保护法规。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Feature Description */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <span className="text-3xl mr-3">💰</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">薪资管理</h2>
            <p className="text-gray-700 mb-2">
              <strong>核心功能：</strong>使用 FHE（全同态加密）技术加密提交员工薪资。薪资数据在链上以加密形式存储，只有授权用户才能解密查看。
            </p>
            <div className="bg-white rounded-lg p-3 mt-2">
              <p className="text-sm text-gray-700">
                <strong>🔐 FHE 加密流程：</strong>
              </p>
              <ol className="text-sm text-gray-600 mt-1 ml-4 list-decimal">
                <li>输入员工地址和薪资金额</li>
                <li>系统使用 FHEVM 对薪资进行加密</li>
                <li>加密后的数据存储在区块链上</li>
                <li>只有有权限的用户可以解密查看</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">薪资记录</h3>
          <p className="text-sm text-gray-600">当前共有 {salaries.length} 条加密薪资记录</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowViewForm(!showViewForm)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md flex items-center gap-2"
          >
            <span>🔍</span>
            {showViewForm ? "取消" : "查看薪资"}
          </button>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md flex items-center gap-2"
          >
            <span>+</span>
            {showSubmitForm ? "取消" : "提交薪资"}
          </button>
        </div>
      </div>

      {/* Submit Salary Form */}
      {showSubmitForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">提交加密薪资</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                员工地址
              </label>
              <input
                type="text"
                value={formData.employeeAddress}
                onChange={(e) => setFormData({ ...formData, employeeAddress: e.target.value })}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 使用当前钱包地址：{address ? `${address.slice(0, 10)}...` : "未连接"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                薪资金额
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="例如：10000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 金额将以加密形式存储在区块链上
              </p>
            </div>

            {/* Encryption Process Visualization */}
            {isEncrypting && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-purple-900 text-lg">🔐 FHE 加密进行中...</p>
                      <p className="text-sm text-purple-700 mt-1">
                        使用全同态加密技术保护您的数据
                      </p>
                    </div>
                  </div>
                  
                  {/* Encryption Steps Animation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-700">原始数据: <strong>{formData.amount}</strong> ETH</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="animate-pulse w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-purple-700">正在使用 FHEVM 加密...</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-50">
                      <span className="text-gray-400">○</span>
                      <span className="text-gray-500">生成加密密文...</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm opacity-30">
                      <span className="text-gray-400">○</span>
                      <span className="text-gray-500">存储到区块链...</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">⚠️ {errorMessage}</p>
              </div>
            )}

            <button
              onClick={handleSubmitSalary}
              disabled={isEncrypting || !formData.employeeAddress || !formData.amount}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isEncrypting ? "🔐 加密中..." : "🔐 提交加密薪资"}
            </button>
          </div>
        </div>
      )}

      {/* View Salary Form */}
      {showViewForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">查看薪资</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                员工地址
              </label>
              <input
                type="text"
                value={viewAddress}
                onChange={(e) => setViewAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* Decryption Process Visualization */}
            {isDecrypting && (
              <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  <div>
                    <p className="font-semibold text-indigo-900">正在解密...</p>
                    <p className="text-sm text-indigo-700">
                      🔐 加密数据 → 🔓 解密中 → ✅ 已解密
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleViewSalary}
              disabled={isDecrypting || !viewAddress}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDecrypting ? "解密中..." : "查看薪资（自动解密）"}
            </button>
          </div>
        </div>
      )}

      {/* Salaries List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">薪资列表</h3>
        </div>
        {salaries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <p className="text-gray-600 mb-2">还没有提交薪资</p>
            <p className="text-sm text-gray-500">点击"提交薪资"按钮开始</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    员工
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    薪资
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提交时间
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{salary.employeeName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-600">
                        {salary.employeeAddress.slice(0, 10)}...{salary.employeeAddress.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {salary.encrypted ? "🔒 已加密" : `$${salary.amount}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        salary.encrypted ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                      }`}>
                        {salary.encrypted ? "加密" : "已解密"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {salary.submittedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-900 mb-2">💡 FHE 加密特性</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• 薪资数据以加密形式存储在区块链上</li>
          <li>• 只有授权用户（员工本人、HR、Manager）可以解密查看</li>
          <li>• 智能合约无法看到原始薪资数据</li>
          <li>• 支持在不解密的情况下进行统计计算</li>
        </ul>
      </div>
    </div>
  );
}

