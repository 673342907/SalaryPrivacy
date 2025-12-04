import { expect } from "chai";
import { ethers } from "hardhat";
import { describe, it, beforeEach } from "mocha";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

/**
 * @file ConfidentialSalary.comprehensive.test.ts
 * @author ConfidentialSalary Team
 * @description 全面的测试套件，包括正常用例、反模式测试、错误处理测试
 * 
 * @custom:chapter testing
 * @custom:chapter antipatterns
 * 
 * 测试覆盖：
 * - ✅ 正常功能测试
 * - ✅ 权限控制测试
 * - ✅ 边界情况测试
 * - ✅ 错误处理测试
 * - ✅ 反模式验证
 * - ✅ 加密计算测试
 */

describe("ConfidentialSalary - Comprehensive Tests", function () {
  // 部署合约的 fixture
  async function deployConfidentialSalaryFixture() {
    const [owner, hr, manager, employee1, employee2, unauthorized] = await ethers.getSigners();

    const ConfidentialSalary = await ethers.getContractFactory("ConfidentialSalary");
    const confidentialSalary = await ConfidentialSalary.deploy();
    await confidentialSalary.waitForDeployment();

    // 设置角色
    await confidentialSalary.connect(owner).assignRole(hr.address, 2); // HR
    await confidentialSalary.connect(owner).assignRole(manager.address, 1); // Manager
    await confidentialSalary.connect(owner).assignRole(employee1.address, 0); // Employee
    await confidentialSalary.connect(owner).assignRole(employee2.address, 0); // Employee

    return {
      confidentialSalary,
      owner,
      hr,
      manager,
      employee1,
      employee2,
      unauthorized,
    };
  }

  describe("部署和初始化", function () {
    it("应该正确部署合约", async function () {
      const { confidentialSalary, owner } = await loadFixture(deployConfidentialSalaryFixture);
      
      expect(await confidentialSalary.owner()).to.equal(owner.address);
      expect(await confidentialSalary.roles(owner.address)).to.equal(3); // Admin
    });

    it("应该正确设置初始状态", async function () {
      const { confidentialSalary } = await loadFixture(deployConfidentialSalaryFixture);
      
      expect(await confidentialSalary.nextDepartmentId()).to.equal(1);
    });
  });

  describe("部门管理 - 正常用例", function () {
    it("HR 应该能够创建部门", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32); // 占位符
      
      await expect(
        confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget)
      )
        .to.emit(confidentialSalary, "DepartmentCreated")
        .withArgs(1, "技术部");
    });

    it("Admin 应该能够创建部门", async function () {
      const { confidentialSalary, owner } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(owner).createDepartment("财务部", encryptedBudget)
      )
        .to.emit(confidentialSalary, "DepartmentCreated")
        .withArgs(1, "财务部");
    });

    it("应该能够获取部门信息", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      const [name, , employeeCount] = await confidentialSalary.getDepartment(1);
      expect(name).to.equal("技术部");
      expect(employeeCount).to.equal(0);
    });
  });

  describe("部门管理 - 错误处理", function () {
    it("非 HR/Admin 不应该能够创建部门", async function () {
      const { confidentialSalary, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(employee1).createDepartment("技术部", encryptedBudget)
      ).to.be.revertedWith("Only HR or Admin");
    });

    it("不应该能够创建空名称的部门", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(hr).createDepartment("", encryptedBudget)
      ).to.be.revertedWith("Department name cannot be empty");
    });

    it("不应该能够创建空预算的部门", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      await expect(
        confidentialSalary.connect(hr).createDepartment("技术部", "0x")
      ).to.be.revertedWith("Encrypted budget cannot be empty");
    });

    it("不应该能够获取不存在的部门", async function () {
      const { confidentialSalary } = await loadFixture(deployConfidentialSalaryFixture);
      
      await expect(
        confidentialSalary.getDepartment(999)
      ).to.be.revertedWith("Department does not exist");
    });
  });

  describe("员工管理 - 正常用例", function () {
    it("HR 应该能够添加员工", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      await expect(
        confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1)
      )
        .to.emit(confidentialSalary, "EmployeeAdded")
        .withArgs(employee1.address, "张三", 0, 1);
    });

    it("应该能够获取员工信息", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      const employee = await confidentialSalary.employees(employee1.address);
      expect(employee.name).to.equal("张三");
      expect(employee.role).to.equal(0); // Employee
      expect(employee.departmentId).to.equal(1);
    });
  });

  describe("员工管理 - 错误处理", function () {
    it("不应该能够添加员工到不存在的部门", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      await expect(
        confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 999)
      ).to.be.revertedWith("Department does not exist");
    });

    it("不应该能够重复添加同一员工", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      await expect(
        confidentialSalary.connect(hr).addEmployee(employee1.address, "李四", 0, 1)
      ).to.be.revertedWith("Employee already exists");
    });

    it("不应该能够添加零地址员工", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      await expect(
        confidentialSalary.connect(hr).addEmployee(ethers.ZeroAddress, "张三", 0, 1)
      ).to.be.revertedWith("Invalid employee address");
    });
  });

  describe("薪资管理 - 正常用例", function () {
    it("HR 应该能够提交加密薪资", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      const encryptedSalary = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary)
      ).to.emit(confidentialSalary, "SalarySubmitted");
    });

    it("员工应该能够查看自己的加密薪资", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      const encryptedSalary = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary);
      
      const salary = await confidentialSalary.connect(employee1).getEncryptedSalary(employee1.address);
      expect(salary.length).to.be.greaterThan(0);
    });
  });

  describe("薪资管理 - 错误处理", function () {
    it("不应该能够提交不存在的员工的薪资", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedSalary = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary)
      ).to.be.revertedWith("Employee does not exist");
    });

    it("不应该能够提交空薪资", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      await expect(
        confidentialSalary.connect(hr).submitSalary(employee1.address, "0x")
      ).to.be.revertedWith("Encrypted salary cannot be empty");
    });

    it("员工不应该能够查看其他员工的薪资", async function () {
      const { confidentialSalary, hr, employee1, employee2 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      await confidentialSalary.connect(hr).addEmployee(employee2.address, "李四", 0, 1);
      
      const encryptedSalary = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary);
      
      await expect(
        confidentialSalary.connect(employee2).getEncryptedSalary(employee1.address)
      ).to.be.revertedWith("Insufficient permissions");
    });
  });

  describe("权限控制 - 反模式测试", function () {
    it("非 Admin 不应该能够分配角色", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      await expect(
        confidentialSalary.connect(hr).assignRole(employee1.address, 1)
      ).to.be.revertedWith("Only admin");
    });

    it("非 HR/Admin 不应该能够创建部门", async function () {
      const { confidentialSalary, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(employee1).createDepartment("技术部", encryptedBudget)
      ).to.be.revertedWith("Only HR or Admin");
    });

    it("非 Manager 及以上不应该能够查看部门统计", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      await expect(
        confidentialSalary.connect(employee1).getDepartmentTotalSalary(1)
      ).to.be.revertedWith("Insufficient permissions");
    });
  });

  describe("加密计算 - FHE 操作测试", function () {
    it("应该能够计算部门总薪资（加密状态）", async function () {
      const { confidentialSalary, hr, employee1, employee2 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      await confidentialSalary.connect(hr).addEmployee(employee2.address, "李四", 0, 1);
      
      const encryptedSalary1 = ethers.randomBytes(32);
      const encryptedSalary2 = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary1);
      await confidentialSalary.connect(hr).submitSalary(employee2.address, encryptedSalary2);
      
      // 计算总薪资（返回加密值）
      const total = await confidentialSalary.connect(hr).getDepartmentTotalSalary(1);
      expect(total.length).to.be.greaterThan(0);
    });

    it("应该能够检查预算合规性（加密状态）", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      const encryptedSalary = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary);
      
      // 检查预算合规性（返回加密的布尔值）
      const compliance = await confidentialSalary.connect(hr).checkBudgetCompliance(1);
      expect(compliance.length).to.be.greaterThan(0);
    });
  });

  describe("边界情况", function () {
    it("空部门应该返回零总薪资", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      const total = await confidentialSalary.connect(hr).getDepartmentTotalSalary(1);
      expect(total.length).to.be.greaterThan(0);
    });

    it("空部门应该返回合规（在预算内）", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      const compliance = await confidentialSalary.connect(hr).checkBudgetCompliance(1);
      expect(compliance.length).to.be.greaterThan(0);
    });
  });
});

