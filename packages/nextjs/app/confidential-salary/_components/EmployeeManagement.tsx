"use client";

import { useState, useCallback } from "react";
import { useAccount } from "wagmi";
import { useData } from "../_context/DataContext";
import { notification } from "~~/utils/helper/notification";
import { useConfidentialSalary } from "~~/hooks/confidential-salary/useConfidentialSalary";
import { useLocale } from "~~/contexts/LocaleContext";
import { useFormValidation } from "~~/hooks/confidential-salary/useFormValidation";

type Role = "Admin" | "HR" | "Manager" | "Employee";

// 角色映射到合约中的数字
const roleToNumber: Record<Role, number> = {
  Employee: 0,
  Manager: 1,
  HR: 2,
  Admin: 3,
};

export function EmployeeManagement() {
  const { t } = useLocale();
  const { address } = useAccount();
  const { employees, addEmployee, departments } = useData();
  const { addEmployee: addEmployeeToContract, hasContract, isPending, fhevmStatus } = useConfidentialSalary();
  const { validateAddress, validateName, validateDepartment } = useFormValidation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    role: "Employee" as Role,
    department: "",
  });
  const [useBlockchain, setUseBlockchain] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddEmployee = useCallback(async () => {
    // 使用统一的验证逻辑
    const addressValidation = validateAddress(formData.address);
    if (!addressValidation.isValid) {
      setErrorMessage(addressValidation.error || "");
      return;
    }

    const nameValidation = validateName(formData.name, "name");
    if (!nameValidation.isValid) {
      setErrorMessage(nameValidation.error || "");
      return;
    }

    const departmentValidation = validateDepartment(formData.department, departments);
    if (!departmentValidation.isValid) {
      setErrorMessage(departmentValidation.error || "");
      return;
    }

    const department = departments.find(d => d.name === formData.department);
    if (!department) {
      setErrorMessage(t.employee.errors.departmentNotFound);
      return;
    }

    setErrorMessage("");

    // 如果使用区块链且合约已部署
    if (useBlockchain && hasContract && address) {
      try {
        const roleNumber = roleToNumber[formData.role];
        await addEmployeeToContract(
          formData.address,
          formData.name,
          roleNumber,
          department.id
        );
        setFormData({ address: "", name: "", role: "Employee", department: "" });
        setShowAddForm(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error: any) {
        setErrorMessage(error.message || t.employee.errors.addFailed);
      }
    } else {
      // 使用本地数据（演示模式）
      const newEmployee = {
        id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
        address: formData.address,
        name: formData.name,
        role: formData.role,
        department: formData.department || t.common.unassigned,
      };
      addEmployee(newEmployee);
      setFormData({ address: "", name: "", role: "Employee", department: "" });
      setShowAddForm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  }, [formData, useBlockchain, hasContract, address, addEmployeeToContract, addEmployee, employees.length, departments, validateAddress, validateName, validateDepartment, t.employee.errors, t.common.unassigned]);

  const roleColors: Record<Role, string> = {
    Admin: "bg-red-100 text-red-800",
    HR: "bg-blue-100 text-blue-800",
    Manager: "bg-green-100 text-green-800",
    Employee: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-green-900">{t.employee.success}</p>
              <p className="text-sm text-green-700">{t.employee.successMessage}</p>
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

      {/* Blockchain Mode Toggle */}
      {hasContract && address && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">🔗 {t.employee.blockchainMode}</h4>
              <p className="text-sm text-yellow-800">
                {useBlockchain 
                  ? t.employee.blockchainTip
                  : t.employee.demoMode}
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
              ⚠️ {t.employee.fhevmStatus.replace("{status}", fhevmStatus)}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{t.employee.title}</h2>
          <p className="text-gray-200 mt-1">{t.employee.subtitle}</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
        >
          {showAddForm ? t.employee.cancel : `+ ${t.employee.add}`}
        </button>
      </div>

      {/* Add Employee Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.locale === "en" ? "Add New Employee" : "添加新员工"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.employee.address} <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="0x..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                />
                {address && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, address })}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-xs font-medium whitespace-nowrap"
                  >
                    {t.employee.useMyAddress}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 {address ? t.employee.currentWallet.replace("{address}", `${address.slice(0, 10)}...${address.slice(-8)}`) : t.employee.connectWallet}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.employee.name} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.locale === "en" ? "e.g., John" : "例如：张三"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoFocus
              />
              <div className="mt-1 flex gap-2 flex-wrap">
                {t.locale === "en" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "John" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      John
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "Jane" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Jane
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "Bob" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Bob
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "张三" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      张三
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "李四" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      李四
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, name: "王五" })}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      王五
                    </button>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.employee.role} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Employee">{t.employee.roleOptions.employee}</option>
                <option value="Manager">{t.employee.roleOptions.manager}</option>
                <option value="HR">{t.employee.roleOptions.hr}</option>
                <option value="Admin">{t.employee.roleOptions.admin}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.employee.department} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">{t.employee.selectDepartment}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {departments.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ {t.employee.noDepartments}
                </p>
              )}
              <div className="mt-1 flex gap-2 flex-wrap">
                {departments.slice(0, 4).map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, department: dept.name })}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            </div>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">⚠️ {errorMessage}</p>
              </div>
            )}
            <button
              onClick={handleAddEmployee}
              disabled={isPending || (useBlockchain && fhevmStatus !== "ready")}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending 
                ? t.employee.processing
                : useBlockchain
                  ? t.employee.addBlockchain
                  : t.employee.addDemo}
            </button>
          </div>
        </div>
      )}

      {/* Employees List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t.employee.list}</h3>
        </div>
        {employees.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-600 mb-2">{t.employee.noEmployees}</p>
            <p className="text-sm text-gray-500">{t.employee.noEmployeesTip}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Name" : "姓名"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Address" : "地址"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Role" : "角色"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Department" : "部门"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t.locale === "en" ? "Actions" : "操作"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-600">
                        {emp.address.slice(0, 10)}...{emp.address.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[emp.role]}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {emp.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          notification.info(
                            <div className="space-y-2">
                              <div className="font-bold">{t.locale === "en" ? "Edit Employee" : "编辑员工"}</div>
                              <div className="text-sm space-y-1">
                                <div><strong>{t.locale === "en" ? "Name:" : "姓名："}</strong>{emp.name}</div>
                                <div><strong>{t.locale === "en" ? "Address:" : "地址："}</strong>{emp.address}</div>
                                <div><strong>{t.locale === "en" ? "Role:" : "角色："}</strong>{emp.role}</div>
                                <div><strong>{t.locale === "en" ? "Department:" : "部门："}</strong>{emp.department}</div>
                              </div>
                              <div className="text-xs text-gray-400 mt-2">{t.locale === "en" ? "Edit functionality will be implemented in future versions." : "编辑功能将在后续版本中实现。"}</div>
                            </div>,
                            { duration: 4000 }
                          );
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                      >
                        {t.common.edit}
                      </button>
                      <button
                        onClick={() => {
                          notification.warning(
                            <div className="space-y-2">
                              <div className="font-bold">{t.employee.confirmDelete}</div>
                              <div className="text-sm">{t.employee.deleteConfirm.replace("{name}", emp.name)}</div>
                              <div className="text-xs text-gray-400">{t.employee.deleteWarning}</div>
                              <div className="text-xs text-gray-400 mt-2">{t.employee.deleteFeatureDesc}</div>
                            </div>,
                            { duration: 5000 }
                          );
                        }}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        {t.common.delete}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Permissions Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.employee.rolePermissions}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Admin
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {t.employee.adminDesc}
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                HR
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {t.employee.hrDesc}
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Manager
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {t.employee.managerDesc}
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                Employee
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {t.employee.employeeDesc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

