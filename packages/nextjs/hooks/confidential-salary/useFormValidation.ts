"use client";

import { useLocale } from "~~/contexts/LocaleContext";

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 自定义 Hook：表单验证逻辑
 * 统一处理各种表单字段的验证
 */
export function useFormValidation() {
  const { t } = useLocale();

  const validateAddress = (address: string): ValidationResult => {
    if (!address.trim()) {
      return {
        isValid: false,
        error: t.employee?.errors?.addressInvalid || (t.locale === "en" ? "Please enter a valid Ethereum address" : "请输入有效的以太坊地址"),
      };
    }
    if (!address.startsWith("0x") || address.length !== 42) {
      return {
        isValid: false,
        error: t.employee?.errors?.addressInvalid || (t.locale === "en" ? "Invalid Ethereum address format" : "以太坊地址格式无效"),
      };
    }
    return { isValid: true };
  };

  const validateName = (name: string, fieldName: string = "name"): ValidationResult => {
    if (!name.trim()) {
      const errorKey = fieldName === "name" ? "nameRequired" : "departmentRequired";
      return {
        isValid: false,
        error: t.department?.errors?.[errorKey as keyof typeof t.department.errors] as string ||
          (t.locale === "en" ? `Please enter ${fieldName}` : `请输入${fieldName === "name" ? "名称" : "部门"}`),
      };
    }
    return { isValid: true };
  };

  const validateAmount = (amount: string | number, fieldName: string = "amount"): ValidationResult => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      const errorKey = fieldName === "amount" ? "amountRequired" : "budgetRequired";
      return {
        isValid: false,
        error: t.salary?.errors?.[errorKey as keyof typeof t.salary.errors] as string ||
          (t.locale === "en" ? `Please enter a valid ${fieldName} (greater than 0)` : `请输入有效的${fieldName === "amount" ? "金额" : "预算"}（大于 0）`),
      };
    }
    return { isValid: true };
  };

  const validateDepartment = (departmentId: string, departments: Array<{ id: number; name: string }>): ValidationResult => {
    if (!departmentId) {
      return {
        isValid: false,
        error: t.employee?.errors?.departmentRequired || (t.locale === "en" ? "Please select a department" : "请选择部门"),
      };
    }
    const department = departments.find(d => d.id.toString() === departmentId || d.name === departmentId);
    if (!department) {
      return {
        isValid: false,
        error: t.employee?.errors?.departmentNotFound || (t.locale === "en" ? "Department does not exist" : "部门不存在"),
      };
    }
    return { isValid: true };
  };

  return {
    validateAddress,
    validateName,
    validateAmount,
    validateDepartment,
  };
}



