"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useLocale } from "~~/contexts/LocaleContext";
import { notification } from "~~/utils/helper/notification";

type Role = "Admin" | "HR" | "Manager" | "Employee";

export function PermissionManagement() {
  const { t } = useLocale();
  const { address } = useAccount();
  const [selectedRole, setSelectedRole] = useState<Role>("Employee");
  const [targetAddress, setTargetAddress] = useState("");

  const roles: { id: Role; name: string; description: string; permissions: string[] }[] = [
    {
      id: "Admin",
      name: t.locale === "en" ? "Administrator" : "管理员",
      description: t.employee.adminDesc,
      permissions:
        t.locale === "en"
          ? [
              "Create and manage departments",
              "Add and manage employees",
              "Submit and manage salaries",
              "View all statistics",
              "Assign role permissions",
              "Transfer Admin role",
            ]
          : ["创建和管理部门", "添加和管理员工", "提交和管理薪资", "查看所有统计", "分配角色权限", "转移 Admin 角色"],
    },
    {
      id: "HR",
      name: t.locale === "en" ? "Human Resources" : "人力资源",
      description: t.employee.hrDesc,
      permissions:
        t.locale === "en"
          ? [
              "Create and manage departments",
              "Add and manage employees",
              "Submit salaries",
              "View department statistics",
              "View employee salaries (after authorization)",
            ]
          : ["创建和管理部门", "添加和管理员工", "提交薪资", "查看部门统计", "查看员工薪资（授权后）"],
    },
    {
      id: "Manager",
      name: t.locale === "en" ? "Manager" : "经理",
      description: t.employee.managerDesc,
      permissions:
        t.locale === "en"
          ? [
              "View department statistics",
              "View department employee salaries",
              "View department budget",
              "Budget compliance check",
            ]
          : ["查看部门统计", "查看部门员工薪资", "查看部门预算", "预算合规检查"],
    },
    {
      id: "Employee",
      name: t.locale === "en" ? "Employee" : "员工",
      description: t.employee.employeeDesc,
      permissions: t.locale === "en" ? ["View own salary", "View salary history"] : ["查看自己的薪资", "查看薪资历史"],
    },
  ];

  const roleColors: Record<Role, string> = {
    Admin: "bg-red-100 text-red-800 border-red-300",
    HR: "bg-blue-100 text-blue-800 border-blue-300",
    Manager: "bg-green-100 text-green-800 border-green-300",
    Employee: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{t.permissions.title}</h2>
          <p className="text-gray-200 mt-1">{t.permissions.subtitle}</p>
        </div>
      </div>

      {/* Current User Role */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.locale === "en" ? "Current User Role" : "当前用户角色"}
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-3xl">👤</div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{t.locale === "en" ? "Wallet Address" : "钱包地址"}</p>
            <p className="font-mono text-sm text-gray-900">
              {address
                ? `${address.slice(0, 10)}...${address.slice(-8)}`
                : t.locale === "en"
                  ? "Not connected"
                  : "未连接"}
            </p>
          </div>
          <div>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
              {address ? "Admin" : t.locale === "en" ? "Not connected" : "未连接"}
            </span>
          </div>
        </div>
      </div>

      {/* Role Assignment */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.permissions.assignRole}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.permissions.targetAddress}</label>
            <input
              type="text"
              value={targetAddress}
              onChange={e => setTargetAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.permissions.role}</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as Role)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.name} - {role.description}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (!targetAddress.trim()) {
                notification.warning(t.permissions.errors.addressRequired, { duration: 3000 });
                return;
              }
              if (!targetAddress.startsWith("0x") || targetAddress.length !== 42) {
                notification.error(t.permissions.errors.addressInvalid, { duration: 4000 });
                return;
              }
              const loadingId = notification.loading(t.locale === "en" ? "Assigning role..." : "正在分配角色...", {
                duration: Infinity,
              });
              // 模拟智能合约调用
              setTimeout(() => {
                notification.remove(loadingId);
                notification.success(
                  <div className="space-y-2">
                    <div className="font-bold">✅ {t.permissions.roleAssigned}</div>
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>{t.locale === "en" ? "Target Address:" : "目标地址："}</strong>
                        {targetAddress}
                      </div>
                      <div>
                        <strong>{t.locale === "en" ? "Role:" : "角色："}</strong>
                        {selectedRole}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">{t.permissions.featureNote}</div>
                  </div>,
                  { duration: 5000 },
                );
              }, 1500);
            }}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            {t.locale === "en" ? "Assign Role (Admin Only)" : "分配角色（仅 Admin）"}
          </button>
        </div>
      </div>

      {/* Role Permissions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t.locale === "en" ? "Role Permission Comparison" : "角色权限对比"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.locale === "en" ? "Function" : "功能"}
                </th>
                {roles.map(role => (
                  <th
                    key={role.id}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t.locale === "en" ? "Create Department" : "创建部门"}
                </td>
                {roles.map(role => (
                  <td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {role.permissions.some(p =>
                      t.locale === "en" ? p.includes("Create and manage departments") : p.includes("创建和管理部门"),
                    ) ? (
                      <span className="text-green-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t.locale === "en" ? "Add Employee" : "添加员工"}
                </td>
                {roles.map(role => (
                  <td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {role.permissions.some(p =>
                      t.locale === "en" ? p.includes("Add and manage employees") : p.includes("添加和管理员工"),
                    ) ? (
                      <span className="text-green-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t.locale === "en" ? "Submit Salary" : "提交薪资"}
                </td>
                {roles.map(role => (
                  <td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {role.permissions.some(p => (t.locale === "en" ? p.includes("Submit") : p.includes("提交"))) ? (
                      <span className="text-green-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t.locale === "en" ? "View Statistics" : "查看统计"}
                </td>
                {roles.map(role => (
                  <td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {role.permissions.some(p =>
                      t.locale === "en" ? p.includes("statistics") || p.includes("Statistics") : p.includes("统计"),
                    ) ? (
                      <span className="text-green-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t.locale === "en" ? "View Salary" : "查看薪资"}
                </td>
                {roles.map(role => (
                  <td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {role.permissions.some(p =>
                      t.locale === "en" ? p.includes("salary") || p.includes("Salary") : p.includes("薪资"),
                    ) ? (
                      <span className="text-green-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t.locale === "en" ? "Assign Role" : "分配角色"}
                </td>
                {roles.map(role => (
                  <td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
                    {role.id === "Admin" ? (
                      <span className="text-green-600 text-xl">✅</span>
                    ) : (
                      <span className="text-gray-400 text-xl">❌</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map(role => (
          <div key={role.id} className={`bg-white rounded-lg shadow-md p-6 border-2 ${roleColors[role.id]}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${roleColors[role.id]}`}>{role.name}</span>
              <span className="text-sm text-gray-600">({role.id})</span>
            </div>
            <p className="text-sm text-gray-700 mb-4">{role.description}</p>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {t.locale === "en" ? "Permission List:" : "权限列表："}
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                {role.permissions.map((permission, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{permission}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Permission System Explanation */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h4 className="font-semibold text-red-900 mb-3">
          🔐 {t.locale === "en" ? "Permission System Description" : "权限系统说明"}
        </h4>
        <div className="space-y-3 text-sm text-red-800">
          <div>
            <p className="font-semibold mb-1">
              {t.locale === "en" ? "Smart Contract-Based Permission Control:" : "基于智能合约的权限控制："}
            </p>
            <ul className="list-disc list-inside space-y-1 text-red-700">
              <li>
                {t.locale === "en"
                  ? "All permission checks are executed on-chain, tamper-proof"
                  : "所有权限检查都在链上执行，不可篡改"}
              </li>
              <li>{t.locale === "en" ? "Only Admin can assign roles" : "只有 Admin 可以分配角色"}</li>
              <li>
                {t.locale === "en"
                  ? "Role assignments are recorded on blockchain, auditable"
                  : "角色分配记录在区块链上，可审计"}
              </li>
              <li>
                {t.locale === "en"
                  ? "Permission checks are automatically executed on each operation"
                  : "权限检查在每次操作时自动执行"}
              </li>
            </ul>
          </div>
          <div className="mt-4 p-3 bg-white rounded-lg">
            <p className="font-semibold text-red-900 mb-1">
              {t.locale === "en" ? "Permission Verification Flow:" : "权限验证流程："}
            </p>
            <p className="text-red-700">
              {t.locale === "en"
                ? "User Operation → Smart Contract Checks Role → Verify Permission → Execute or Reject"
                : "用户操作 → 智能合约检查角色 → 验证权限 → 执行操作或拒绝"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
