"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

export interface Department {
  id: number;
  name: string;
  budget: string;
  employeeCount: number;
}

export interface Employee {
  id: number;
  address: string;
  name: string;
  role: "Admin" | "HR" | "Manager" | "Employee";
  department: string;
}

export interface Salary {
  id: number;
  employeeAddress: string;
  employeeName: string;
  amount: string;
  encrypted: boolean;
  submittedAt: string;
}

interface DataContextType {
  departments: Department[];
  employees: Employee[];
  salaries: Salary[];
  setDepartments: (departments: Department[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setSalaries: (salaries: Salary[]) => void;
  addDepartment: (department: Department) => void;
  addEmployee: (employee: Employee) => void;
  addSalary: (salary: Salary) => void;
  clearAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // 始终从空数组开始，避免 hydration 错误
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [mounted, setMounted] = useState(false);

  // 在客户端挂载后从 localStorage 加载数据
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const savedDepartments = localStorage.getItem("confidentialSalary_departments");
      const savedEmployees = localStorage.getItem("confidentialSalary_employees");
      const savedSalaries = localStorage.getItem("confidentialSalary_salaries");

      if (savedDepartments) {
        try {
          setDepartments(JSON.parse(savedDepartments));
        } catch (e) {
          console.error("Failed to parse departments", e);
        }
      }
      if (savedEmployees) {
        try {
          setEmployees(JSON.parse(savedEmployees));
        } catch (e) {
          console.error("Failed to parse employees", e);
        }
      }
      if (savedSalaries) {
        try {
          setSalaries(JSON.parse(savedSalaries));
        } catch (e) {
          console.error("Failed to parse salaries", e);
        }
      }
    }
  }, []);

  // 保存数据到 localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("confidentialSalary_departments", JSON.stringify(departments));
    }
  }, [departments]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("confidentialSalary_employees", JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("confidentialSalary_salaries", JSON.stringify(salaries));
    }
  }, [salaries]);

  const addDepartment = (department: Department) => {
    setDepartments([...departments, department]);
  };

  const addEmployee = (employee: Employee) => {
    setEmployees([...employees, employee]);
  };

  const addSalary = (salary: Salary) => {
    setSalaries([...salaries, salary]);
  };

  const clearAllData = () => {
    setDepartments([]);
    setEmployees([]);
    setSalaries([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("confidentialSalary_departments");
      localStorage.removeItem("confidentialSalary_employees");
      localStorage.removeItem("confidentialSalary_salaries");
    }
  };

  return (
    <DataContext.Provider
      value={{
        departments,
        employees,
        salaries,
        setDepartments,
        setEmployees,
        setSalaries,
        addDepartment,
        addEmployee,
        addSalary,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
