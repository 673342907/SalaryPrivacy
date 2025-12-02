"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useData } from "../_context/DataContext";

type Role = "Admin" | "HR" | "Manager" | "Employee";

export function EmployeeManagement() {
  const { address } = useAccount();
  const { employees, setEmployees, addEmployee } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    role: "Employee" as Role,
    department: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddEmployee = () => {
    // 验证输入
    if (!formData.address.trim() || !formData.address.startsWith("0x") || formData.address.length !== 42) {
      setErrorMessage("请输入有效的以太坊地址（0x开头，42个字符）");
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("请输入员工姓名");
      return;
    }

    setErrorMessage("");
    const newEmployee = {
      id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
      address: formData.address,
      name: formData.name,
      role: formData.role,
      department: formData.department || "未分配",
    };
    addEmployee(newEmployee);
    setFormData({ address: "", name: "", role: "Employee", department: "" });
    setShowAddForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

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
              <p className="font-semibold text-green-900">员工添加成功！</p>
              <p className="text-sm text-green-700">员工已添加到系统中，角色权限已设置</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">员工管理</h2>
          <p className="text-gray-600 mt-1">添加员工、分配角色和部门</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
        >
          {showAddForm ? "取消" : "+ 添加员工"}
        </button>
      </div>

      {/* Add Employee Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">添加新员工</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                钱包地址
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 使用当前钱包地址：{address ? `${address.slice(0, 10)}...` : "未连接"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                员工姓名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例如：张三"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                角色
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Employee">Employee - 员工</option>
                <option value="Manager">Manager - 经理</option>
                <option value="HR">HR - 人力资源</option>
                <option value="Admin">Admin - 管理员</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                部门
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="例如：技术部"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">⚠️ {errorMessage}</p>
              </div>
            )}
            <button
              onClick={handleAddEmployee}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              👤 添加员工
            </button>
          </div>
        </div>
      )}

      {/* Employees List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">员工列表</h3>
        </div>
        {employees.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-gray-600 mb-2">还没有添加员工</p>
            <p className="text-sm text-gray-500">点击"添加员工"按钮开始</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    部门
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
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
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        编辑
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        删除
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">角色权限说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Admin
              </span>
            </div>
            <p className="text-sm text-gray-600">
              完全权限：可以管理所有功能、分配角色、创建部门、提交薪资
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                HR
              </span>
            </div>
            <p className="text-sm text-gray-600">
              可以创建部门、管理员工、提交薪资、查看部门统计
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Manager
              </span>
            </div>
            <p className="text-sm text-gray-600">
              可以查看部门数据和员工薪资、查看部门统计
            </p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                Employee
              </span>
            </div>
            <p className="text-sm text-gray-600">
              只能查看自己的薪资（自动解密）
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

