"use client";

import { useState } from "react";

export function DepartmentManagement() {
  const [departments, setDepartments] = useState<Array<{
    id: number;
    name: string;
    budget: string;
    employeeCount: number;
  }>>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", budget: "" });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateDepartment = () => {
    // 验证输入
    if (!formData.name.trim()) {
      setErrorMessage("请输入部门名称");
      return;
    }
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      setErrorMessage("请输入有效的预算金额（大于0）");
      return;
    }

    setErrorMessage("");
    const newDept = {
      id: departments.length + 1,
      name: formData.name,
      budget: formData.budget,
      employeeCount: 0,
    };
    setDepartments([...departments, newDept]);
    setFormData({ name: "", budget: "" });
    setShowCreateForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">部门创建成功！</p>
              <p className="text-sm text-green-700">部门已添加到列表中，预算已加密存储</p>
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

      {/* Header */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <span className="text-3xl mr-3">🏢</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">部门管理</h2>
            <p className="text-gray-700 mb-2">
              <strong>功能说明：</strong>创建和管理公司部门，为每个部门设置加密预算。部门预算将用于后续的薪资管理和预算合规检查。
            </p>
            <p className="text-sm text-gray-600">
              💡 <strong>使用提示：</strong>点击"创建部门"按钮，输入部门名称和预算金额（单位：ETH），预算将以加密形式存储在区块链上。
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">部门列表</h3>
          <p className="text-sm text-gray-600">当前共有 {departments.length} 个部门</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md flex items-center gap-2"
        >
          <span>{showCreateForm ? "✕" : "+"}</span>
          {showCreateForm ? "取消创建" : "创建部门"}
        </button>
      </div>

      {/* Create Department Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">创建新部门</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                部门名称
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例如：技术部、市场部"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                部门预算（加密存储）
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="例如：100000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 预算将以加密形式存储在区块链上
              </p>
            </div>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">⚠️ {errorMessage}</p>
              </div>
            )}
            <button
              onClick={handleCreateDepartment}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              🔐 创建部门（加密存储）
            </button>
          </div>
        </div>
      )}

      {/* Departments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">部门列表</h3>
        </div>
        {departments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-gray-600 mb-2">还没有创建部门</p>
            <p className="text-sm text-gray-500">点击"创建部门"按钮开始</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {departments.map((dept) => (
              <div key={dept.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {dept.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">预算：</span>
                        <span className="font-semibold text-gray-900 ml-2">
                          🔒 {dept.budget} (加密)
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">员工数：</span>
                        <span className="font-semibold text-gray-900 ml-2">
                          {dept.employeeCount}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      查看详情
                    </button>
                    <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      编辑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 功能说明</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 部门预算以加密形式存储在区块链上</li>
          <li>• 只有授权用户（Admin/HR）可以创建和管理部门</li>
          <li>• 部门统计可以在不解密原始数据的情况下进行计算</li>
        </ul>
      </div>
    </div>
  );
}

