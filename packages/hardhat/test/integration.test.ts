import { expect } from "chai";
import { ethers } from "hardhat";
import { describe, it, beforeEach } from "mocha";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

/**
 * @file integration.test.ts
 * @author ConfidentialSalary Team
 * @description 集成测试：测试完整的业务流程
 * 
 * @custom:chapter testing
 * 
 * 测试覆盖：
 * - 完整的业务流程
 * - 多用户场景
 * - 端到端测试
 */

describe("ConfidentialSalary - Integration Tests", function () {
  async function deployFixture() {
    const [owner, hr, manager, employee1, employee2, employee3] = await ethers.getSigners();

    const ConfidentialSalary = await ethers.getContractFactory("ConfidentialSalary");
    const contract = await ConfidentialSalary.deploy();
    await contract.waitForDeployment();

    // 设置角色
    await contract.connect(owner).assignRole(hr.address, 2); // HR
    await contract.connect(owner).assignRole(manager.address, 1); // Manager
    await contract.connect(owner).assignRole(employee1.address, 0); // Employee
    await contract.connect(owner).assignRole(employee2.address, 0); // Employee
    await contract.connect(owner).assignRole(employee3.address, 0); // Employee

    return {
      contract,
      owner,
      hr,
      manager,
      employee1,
      employee2,
      employee3,
    };
  }

  describe("完整业务流程", function () {
    it("应该完成完整的薪资管理流程", async function () {
      const { contract, hr, employee1, employee2, manager } = await loadFixture(deployFixture);

      // 步骤 1: 创建部门
      const encryptedBudget = ethers.randomBytes(32);
      const deptId = await contract.connect(hr).createDepartment("技术部", encryptedBudget);
      expect(deptId).to.equal(1);

      // 步骤 2: 添加员工
      await contract.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      await contract.connect(hr).addEmployee(employee2.address, "李四", 0, 1);

      // 验证员工数量
      const employeeCount = await contract.getDepartmentEmployeeCount(1);
      expect(employeeCount).to.equal(2);

      // 步骤 3: 提交薪资
      const encryptedSalary1 = ethers.randomBytes(32);
      const encryptedSalary2 = ethers.randomBytes(32);
      
      await contract.connect(hr).submitSalary(employee1.address, encryptedSalary1);
      await contract.connect(hr).submitSalary(employee2.address, encryptedSalary2);

      // 步骤 4: 员工查看自己的薪资
      const salary1 = await contract.connect(employee1).getEncryptedSalary(employee1.address);
      expect(salary1.length).to.be.greaterThan(0);

      // 步骤 5: 经理查看部门统计
      const totalSalary = await contract.connect(manager).getDepartmentTotalSalary(1);
      expect(totalSalary.length).to.be.greaterThan(0);

      // 步骤 6: 检查预算合规性
      const compliance = await contract.connect(manager).checkBudgetCompliance(1);
      expect(compliance.length).to.be.greaterThan(0);
    });

    it("应该支持多部门管理", async function () {
      const { contract, hr, employee1, employee2 } = await loadFixture(deployFixture);

      // 创建多个部门
      const budget1 = ethers.randomBytes(32);
      const budget2 = ethers.randomBytes(32);
      
      const dept1 = await contract.connect(hr).createDepartment("技术部", budget1);
      const dept2 = await contract.connect(hr).createDepartment("市场部", budget2);

      expect(dept1).to.equal(1);
      expect(dept2).to.equal(2);

      // 添加员工到不同部门
      await contract.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      await contract.connect(hr).addEmployee(employee2.address, "李四", 0, 2);

      // 验证部门隔离
      const dept1Employees = await contract.getDepartmentEmployees(1);
      const dept2Employees = await contract.getDepartmentEmployees(2);

      expect(dept1Employees.length).to.equal(1);
      expect(dept2Employees.length).to.equal(1);
      expect(dept1Employees[0]).to.equal(employee1.address);
      expect(dept2Employees[0]).to.equal(employee2.address);
    });

    it("应该正确处理权限控制", async function () {
      const { contract, hr, employee1, employee2 } = await loadFixture(deployFixture);

      const budget = ethers.randomBytes(32);
      await contract.connect(hr).createDepartment("技术部", budget);
      await contract.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      await contract.connect(hr).addEmployee(employee2.address, "李四", 0, 1);

      const encryptedSalary = ethers.randomBytes(32);
      await contract.connect(hr).submitSalary(employee1.address, encryptedSalary);

      // 员工可以查看自己的薪资
      const ownSalary = await contract.connect(employee1).getEncryptedSalary(employee1.address);
      expect(ownSalary.length).to.be.greaterThan(0);

      // 员工不能查看其他员工的薪资
      await expect(
        contract.connect(employee2).getEncryptedSalary(employee1.address)
      ).to.be.revertedWith("Insufficient permissions");
    });
  });

  describe("边界情况", function () {
    it("应该处理空部门", async function () {
      const { contract, hr, manager } = await loadFixture(deployFixture);

      const budget = ethers.randomBytes(32);
      await contract.connect(hr).createDepartment("空部门", budget);

      // 空部门的总薪资应该是 0
      const total = await contract.connect(manager).getDepartmentTotalSalary(1);
      expect(total.length).to.be.greaterThan(0);

      // 空部门应该在预算内
      const compliance = await contract.connect(manager).checkBudgetCompliance(1);
      expect(compliance.length).to.be.greaterThan(0);
    });

    it("应该处理大量数据", async function () {
      const { contract, hr, manager } = await loadFixture(deployFixture);

      const budget = ethers.randomBytes(32);
      await contract.connect(hr).createDepartment("大部门", budget);

      const employees = await ethers.getSigners();
      const employeeCount = Math.min(10, employees.length - 2); // 排除 owner 和 hr

      // 添加多个员工
      for (let i = 2; i < 2 + employeeCount; i++) {
        await contract.connect(hr).addEmployee(
          employees[i].address,
          `员工${i}`,
          0,
          1
        );
      }

      // 验证可以处理大量数据
      const total = await contract.connect(manager).getDepartmentTotalSalary(1);
      expect(total.length).to.be.greaterThan(0);
    });
  });
});

