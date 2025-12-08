"use client";

import { useCallback, useEffect, useState } from "react";
import { useData } from "../_context/DataContext";
import { useAccount } from "wagmi";
import { useLocale } from "~~/contexts/LocaleContext";
import { useConfidentialSalary } from "~~/hooks/confidential-salary/useConfidentialSalary";
import { useFormValidation } from "~~/hooks/confidential-salary/useFormValidation";
import { notification } from "~~/utils/helper/notification";

export function DepartmentManagement() {
  const { t } = useLocale();
  const { departments, addDepartment } = useData();
  const { address } = useAccount();
  const { createDepartment, hasContract, isPending, fhevmStatus } = useConfidentialSalary();
  const { validateName, validateAmount } = useFormValidation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", budget: "" });
  const [useBlockchain, setUseBlockchain] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 确保只在客户端渲染，避免 hydration 错误
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateDepartment = useCallback(async () => {
    // 使用统一的验证逻辑
    const nameValidation = validateName(formData.name, "name");
    if (!nameValidation.isValid) {
      setErrorMessage(nameValidation.error || "");
      return;
    }

    const budgetValidation = validateAmount(formData.budget, "budget");
    if (!budgetValidation.isValid) {
      setErrorMessage(budgetValidation.error || "");
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
        setErrorMessage(
          error.message ||
            t.department?.errors?.createFailed ||
            (t.locale === "en" ? "Failed to create department" : "创建部门失败"),
        );
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
  }, [
    formData.name,
    formData.budget,
    useBlockchain,
    hasContract,
    address,
    createDepartment,
    addDepartment,
    departments,
    validateName,
    validateAmount,
    t.department?.errors?.createFailed,
    t.locale,
  ]);

  // 在客户端挂载之前显示加载状态，避免 hydration 错误
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">
                {t.department?.success || (t.locale === "en" ? "Department created successfully!" : "部门创建成功！")}
              </p>
              <p className="text-sm text-green-700">
                {t.department?.successMessage ||
                  (t.locale === "en"
                    ? "Department has been added to the list, budget has been encrypted and stored"
                    : "部门已添加到列表，预算已加密存储")}
              </p>
            </div>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-800">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <span className="text-3xl mr-3">🏢</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.department?.title || (t.locale === "en" ? "Department Management" : "部门管理")}
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>{t.locale === "en" ? "Description:" : "功能说明："}</strong>{" "}
              {t.department?.subtitle ||
                (t.locale === "en"
                  ? "Create and manage company departments, set encrypted budgets for each department"
                  : "创建和管理公司部门，为每个部门设置加密预算")}
            </p>
            <p className="text-sm text-gray-600">
              💡 <strong>{t.locale === "en" ? "Tip:" : "使用提示："}</strong>{" "}
              {t.department?.tip ||
                (t.locale === "en"
                  ? "Click the 'Create Department' button, enter the department name and budget amount (in ETH), the budget will be stored encrypted on the blockchain"
                  : "点击「创建部门」按钮，输入部门名称和预算金额（ETH），预算将以加密形式存储在区块链上")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">
            {t.department?.list || (t.locale === "en" ? "Department List" : "部门列表")}
          </h3>
          <p className="text-sm text-gray-200">
            {(
              t.department?.currentCount ||
              (t.locale === "en" ? "Currently {count} departments" : "当前共有 {count} 个部门")
            ).replace("{count}", departments.length.toString())}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md flex items-center gap-2"
        >
          <span>{showCreateForm ? "✕" : "+"}</span>
          {showCreateForm
            ? t.department?.cancelCreate || (t.locale === "en" ? "Cancel" : "取消")
            : t.department?.create || (t.locale === "en" ? "Create Department" : "创建部门")}
        </button>
      </div>

      {/* Blockchain Mode Toggle */}
      {hasContract && address && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">
                🔗 {t.locale === "en" ? "Blockchain Mode" : "区块链模式"}
              </h4>
              <p className="text-sm text-yellow-800">
                {useBlockchain
                  ? t.locale === "en"
                    ? "Data will be stored on the blockchain (Gas fees required)"
                    : "数据将存储在区块链上（需要支付 Gas 费用）"
                  : t.locale === "en"
                    ? "Currently in demo mode, data is only stored locally"
                    : "当前为演示模式，数据仅存储在本地"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useBlockchain}
                onChange={e => setUseBlockchain(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>
          {useBlockchain && fhevmStatus !== "ready" && (
            <div className="mt-2 text-sm text-yellow-700">
              ⚠️{" "}
              {(
                t.department?.fhevmStatus ||
                (t.locale === "en"
                  ? "FHEVM Status: {status}, please wait for initialization"
                  : "FHEVM 状态: {status}，请等待初始化完成")
              ).replace("{status}", fhevmStatus)}
            </div>
          )}
        </div>
      )}

      {/* Create Department Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.locale === "en" ? "Create New Department" : "创建新部门"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.department?.name || (t.locale === "en" ? "Department Name" : "部门名称")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder={
                  t.department?.placeholder ||
                  t.department?.namePlaceholder ||
                  (t.locale === "en" ? "e.g., Technology, Marketing, Finance" : "例如：技术部、市场部、财务部")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="mt-1 flex gap-2 flex-wrap">
                {t.locale === "en" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "Technology" })}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Technology
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "Marketing" })}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Marketing
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "Finance" })}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Finance
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "HR" })}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      HR
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          name: t.department?.sampleDept1 || (t.locale === "en" ? "Technology" : "技术部"),
                        })
                      }
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      {t.department?.sampleDept1 || (t.locale === "en" ? "Technology" : "技术部")}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          name: t.department?.sampleDept2 || (t.locale === "en" ? "Marketing" : "市场部"),
                        })
                      }
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      {t.department?.sampleDept2 || (t.locale === "en" ? "Marketing" : "市场部")}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          name: t.department?.sampleDept3 || (t.locale === "en" ? "Finance" : "财务部"),
                        })
                      }
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      {t.department?.sampleDept3 || (t.locale === "en" ? "Finance" : "财务部")}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          name: t.department?.sampleDept4 || (t.locale === "en" ? "HR" : "人事部"),
                        })
                      }
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      {t.department?.sampleDept4 || (t.locale === "en" ? "HR" : "人事部")}
                    </button>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.department?.budget ||
                  (t.locale === "en" ? "Budget (ETH, Encrypted Storage)" : "预算（ETH，加密存储）")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                placeholder={t.locale === "en" ? "e.g., 100000" : "例如：100000"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-1 flex gap-2 flex-wrap">
                {t.locale === "en" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: "100000" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      100k
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: "200000" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      200k
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, budget: "500000" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      500k
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡{" "}
                {t.department?.budgetEncrypted ||
                  (t.locale === "en"
                    ? "Budget will be stored encrypted on the blockchain"
                    : "预算将以加密形式存储在区块链上")}
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
                ? t.department?.processing || (t.locale === "en" ? "Processing..." : "处理中...")
                : useBlockchain
                  ? t.department?.createBlockchain ||
                    (t.locale === "en" ? "Create Department (Blockchain Storage)" : "创建部门（区块链存储）")
                  : t.department?.createDemo ||
                    (t.locale === "en" ? "Create Department (Demo Mode)" : "创建部门（演示模式）")}
            </button>
          </div>
        </div>
      )}

      {/* Departments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t.department?.list || (t.locale === "en" ? "Department List" : "部门列表")}
          </h3>
        </div>
        {departments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🏢</div>
            <p className="text-gray-600 mb-2">
              {t.department?.noDepartments || (t.locale === "en" ? "No departments created yet" : "尚未创建部门")}
            </p>
            <p className="text-sm text-gray-500">
              {t.department?.noDepartmentsTip ||
                (t.locale === "en" ? "Click the 'Create Department' button to start" : "点击「创建部门」按钮开始")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {departments.map(dept => (
              <div key={dept.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          {t.department?.budgetLabel || (t.locale === "en" ? "Budget:" : "预算：")}
                        </span>
                        <span className="font-semibold text-gray-900 ml-2">
                          🔒 {dept.budget} ({t.locale === "en" ? "Encrypted" : "加密"})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t.department?.employeeCountLabel || (t.locale === "en" ? "Employee Count:" : "员工数量：")}
                        </span>
                        <span className="font-semibold text-gray-900 ml-2">{dept.employeeCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        notification.info(
                          <div className="space-y-2">
                            <div className="font-bold">
                              {t.department?.departmentDetails ||
                                (t.locale === "en" ? "Department Details" : "部门详情")}
                            </div>
                            <div className="text-sm space-y-1">
                              <div>
                                <strong>{t.locale === "en" ? "Name:" : "名称："}</strong>
                                {dept.name}
                              </div>
                              <div>
                                <strong>{t.locale === "en" ? "Budget:" : "预算："}</strong>
                                {dept.budget} ETH ({t.locale === "en" ? "Encrypted Storage" : "加密存储"})
                              </div>
                              <div>
                                <strong>{t.locale === "en" ? "Employee Count:" : "员工数："}</strong>
                                {dept.employeeCount}
                              </div>
                            </div>
                          </div>,
                          { duration: 4000 },
                        );
                      }}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      {t.department?.viewDetails || (t.locale === "en" ? "View Details" : "查看详情")}
                    </button>
                    <button
                      onClick={() => {
                        notification.info(
                          <div className="space-y-1">
                            <div className="font-bold">
                              {t.department?.editFeature || (t.locale === "en" ? "Edit Feature" : "编辑功能")}
                            </div>
                            <div className="text-sm">
                              {t.department?.editFeatureDesc ||
                                (t.locale === "en"
                                  ? "This feature will be implemented in a future version, supporting modification of department name and budget"
                                  : "此功能将在后续版本中实现，支持修改部门名称和预算")}
                            </div>
                          </div>,
                          { duration: 4000 },
                        );
                      }}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {t.department?.edit || (t.locale === "en" ? "Edit" : "编辑")}
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
        <h4 className="font-semibold text-blue-900 mb-2">
          💡 {t.locale === "en" ? "Function Description" : "功能说明"}
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            •{" "}
            {t.locale === "en"
              ? "Department budgets are stored in encrypted form on the blockchain"
              : "部门预算以加密形式存储在区块链上"}
          </li>
          <li>
            •{" "}
            {t.locale === "en"
              ? "Only authorized users (Admin/HR) can create and manage departments"
              : "只有授权用户（Admin/HR）可以创建和管理部门"}
          </li>
          <li>
            •{" "}
            {t.locale === "en"
              ? "Department statistics can be calculated without decrypting the original data"
              : "部门统计可以在不解密原始数据的情况下进行计算"}
          </li>
        </ul>
      </div>
    </div>
  );
}
