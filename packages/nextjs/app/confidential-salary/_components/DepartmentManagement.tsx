"use client";

import { useState } from "react";
import { useData } from "../_context/DataContext";
import { notification } from "~~/utils/helper/notification";
import { useConfidentialSalary } from "~~/hooks/confidential-salary/useConfidentialSalary";
import { useAccount } from "wagmi";
import { useLocale } from "~~/contexts/LocaleContext";

export function DepartmentManagement() {
  const { t } = useLocale();
  const { departments, addDepartment } = useData();
  const { address } = useAccount();
  const { createDepartment, hasContract, isPending, fhevmStatus } = useConfidentialSalary();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", budget: "" });
  const [useBlockchain, setUseBlockchain] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateDepartment = async () => {
    if (!formData.name.trim()) {
      setErrorMessage(t.department.errors.nameRequired);
      return;
    }
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      setErrorMessage(t.department.errors.budgetRequired);
      return;
    }

    setErrorMessage("");

    if (useBlockchain && hasContract && address) {
      try {
        await createDepartment(formData.name, parseFloat(formData.budget));
        setFormData({ name: "", budget: "" });
        setShowCreateForm(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error: any) {
        setErrorMessage(error.message || t.department.errors.createFailed);
      }
    } else {
      // 使用本地数据（演示模式）
      const newDept = {
        id: departments.length > 0 ? Math.max(...departments.map(d => d.id)) + 1 : 1,
        name: formData.name,
        budget: formData.budget,
        employeeCount: 0,
      };
      addDepartment(newDept);
      setFormData({ name: "", budget: "" });
      setShowCreateForm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
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
              <p className="font-semibold text-green-900">{t.department.success}</p>
              <p className="text-sm text-green-700">{t.department.successMessage}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.department.title}</h2>
            <p className="text-gray-700 mb-2">
              <strong>{t.locale === "en" ? "Description:" : "功能说明："}</strong> {t.department.subtitle}
            </p>
            <p className="text-sm text-gray-600">
              💡 <strong>{t.locale === "en" ? "Tip:" : "使用提示："}</strong> {t.department.tip}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{t.department.list}</h3>
          <p className="text-sm text-gray-600">{t.department.currentCount.replace("{count}", departments.length.toString())}</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md flex items-center gap-2"
        >
          <span>{showCreateForm ? "✕" : "+"}</span>
          {showCreateForm ? t.department.cancelCreate : t.department.create}
        </button>
      </div>

      {/* Blockchain Mode Toggle */}
      {hasContract && address && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">🔗 区块链模式</h4>
              <p className="text-sm text-yellow-800">
                {useBlockchain 
                  ? "数据将存储在区块链上（需要支付 Gas 费用）" 
                  : "当前为演示模式，数据仅存储在本地"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useBlockchain}
                onChange={(e) => setUseBlockchain(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
          {useBlockchain && fhevmStatus !== "ready" && (
            <div className="mt-2 text-sm text-yellow-700">
              ⚠️ {t.department.fhevmStatus.replace("{status}", fhevmStatus)}
            </div>
          )}
        </div>
      )}

      {/* Create Department Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.locale === "en" ? "Create New Department" : "创建新部门"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.department.name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.department.placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="mt-1 flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, name: "技术部" })}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  技术部
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, name: "市场部" })}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  市场部
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, name: "财务部" })}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  财务部
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, name: "人事部" })}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  人事部
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.department.budget} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder={t.locale === "en" ? "e.g., 100000" : "例如：100000"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-1 flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, budget: "100000" })}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  10万
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, budget: "200000" })}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  20万
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, budget: "500000" })}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  50万
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 {t.department.budgetEncrypted}
              </p>
            </div>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">⚠️ {errorMessage}</p>
              </div>
            )}
            <button
              onClick={handleCreateDepartment}
              disabled={isPending || (useBlockchain && fhevmStatus !== "ready")}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending 
                ? t.department.processing
                : useBlockchain
                  ? t.department.createBlockchain
                  : t.department.createDemo}
            </button>
          </div>
        </div>
      )}

      {/* Departments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t.department.list}</h3>
        </div>
        {departments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-gray-600 mb-2">{t.department.noDepartments}</p>
            <p className="text-sm text-gray-500">{t.department.noDepartmentsTip}</p>
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
                        <span className="text-gray-600">{t.department.budgetLabel}</span>
                        <span className="font-semibold text-gray-900 ml-2">
                          🔒 {dept.budget} (加密)
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t.department.employeeCountLabel}</span>
                        <span className="font-semibold text-gray-900 ml-2">
                          {dept.employeeCount}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        notification.info(
                          <div className="space-y-2">
                            <div className="font-bold">部门详情</div>
                            <div className="text-sm space-y-1">
                              <div><strong>名称：</strong>{dept.name}</div>
                              <div><strong>预算：</strong>{dept.budget} ETH（加密存储）</div>
                              <div><strong>员工数：</strong>{dept.employeeCount}</div>
                            </div>
                          </div>,
                          { duration: 4000 }
                        );
                      }}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      {t.department.viewDetails}
                    </button>
                    <button
                      onClick={() => {
                        notification.info(
                          <div className="space-y-1">
                            <div className="font-bold">{t.department.editFeature}</div>
                            <div className="text-sm">{t.department.editFeatureDesc}</div>
                          </div>,
                          { duration: 4000 }
                        );
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {t.department.edit}
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

