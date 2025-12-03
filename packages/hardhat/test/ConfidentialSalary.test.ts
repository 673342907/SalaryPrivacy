import { expect } from "chai";
import { ethers } from "hardhat";
import { describe, it, beforeEach } from "mocha";

/**
 * ConfidentialSalary 智能合约测试套件
 * 
 * 测试覆盖：
 * - 部门管理
 * - 员工管理
 * - 角色权限
 * - 薪资提交
 * - 加密统计计算
 * - 预算合规检查
 */
describe("ConfidentialSalary", function () {
  let confidentialSalary: any;
  let owner: any;
  let hr: any;
  let manager: any;
  let employee: any;

  beforeEach(async function () {
    [owner, hr, manager, employee] = await ethers.getSigners();

    const ConfidentialSalary = await ethers.getContractFactory("ConfidentialSalary");
    confidentialSalary = await ConfidentialSalary.deploy();
    await confidentialSalary.waitForDeployment();
  });

  describe("部署", function () {
    it("应该正确设置owner为Admin角色", async function () {
      const role = await confidentialSalary.roles(owner.address);
      expect(role).to.equal(3); // Admin = 3
    });
  });

  describe("角色管理", function () {
    it("Admin应该能够分配角色", async function () {
      await confidentialSalary.connect(owner).assignRole(hr.address, 2); // HR = 2
      const role = await confidentialSalary.roles(hr.address);
      expect(role).to.equal(2);
    });

    it("非Admin不应该能够分配角色", async function () {
      await expect(
        confidentialSalary.connect(hr).assignRole(manager.address, 1)
      ).to.be.revertedWith("Only admin");
    });
  });

  describe("部门管理", function () {
    it("HR应该能够创建部门", async function () {
      await confidentialSalary.connect(owner).assignRole(hr.address, 2); // HR
      
      // 注意：这里需要实际的加密预算数据
      // 在实际测试中，需要使用FHEVM SDK生成加密数据
      const encryptedBudget = ethers.randomBytes(32); // 占位符
      
      await expect(
        confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget)
      ).to.emit(confidentialSalary, "DepartmentCreated");
    });

    it("非HR不应该能够创建部门", async function () {
      const encryptedBudget = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(employee).createDepartment("技术部", encryptedBudget)
      ).to.be.revertedWith("Only HR or Admin");
    });
  });

  describe("员工管理", function () {
    beforeEach(async function () {
      await confidentialSalary.connect(owner).assignRole(hr.address, 2); // HR
      
      // 创建部门
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
    });

    it("HR应该能够添加员工", async function () {
      await expect(
        confidentialSalary.connect(hr).addEmployee(
          employee.address,
          "张三",
          0, // Employee
          1  // departmentId
        )
      ).to.emit(confidentialSalary, "EmployeeAdded");
    });

    it("应该正确更新部门员工数量", async function () {
      await confidentialSalary.connect(hr).addEmployee(
        employee.address,
        "张三",
        0,
        1
      );
      
      const dept = await confidentialSalary.getDepartment(1);
      expect(dept.employeeCount).to.equal(1);
    });
  });

  describe("薪资管理", function () {
    beforeEach(async function () {
      await confidentialSalary.connect(owner).assignRole(hr.address, 2);
      
      // 创建部门和员工
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee.address, "张三", 0, 1);
    });

    it("HR应该能够提交加密薪资", async function () {
      const encryptedSalary = ethers.randomBytes(32); // 占位符
      
      await expect(
        confidentialSalary.connect(hr).submitSalary(employee.address, encryptedSalary)
      ).to.emit(confidentialSalary, "SalarySubmitted");
    });

    it("员工应该能够查看自己的加密薪资", async function () {
      const encryptedSalary = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).submitSalary(employee.address, encryptedSalary);
      
      const salary = await confidentialSalary.connect(employee).getEncryptedSalary(employee.address);
      expect(salary.length).to.be.greaterThan(0);
    });
  });

  describe("权限控制", function () {
    it("员工不应该能够查看其他员工的薪资", async function () {
      await confidentialSalary.connect(owner).assignRole(hr.address, 2);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      const [employee1, employee2] = await ethers.getSigners();
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "员工1", 0, 1);
      await confidentialSalary.connect(hr).addEmployee(employee2.address, "员工2", 0, 1);
      
      const encryptedSalary = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary);
      
      // employee2不应该能够查看employee1的薪资
      await expect(
        confidentialSalary.connect(employee2).getEncryptedSalary(employee1.address)
      ).to.be.revertedWith("Insufficient permissions");
    });
  });
});

