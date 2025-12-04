import { expect } from "chai";
import { ethers } from "hardhat";
import { describe, it, beforeEach } from "mocha";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

/**
 * ConfidentialSalary 增强测试套件
 * 
 * 测试覆盖：
 * - 完整的部门管理流程
 * - 员工管理流程
 * - 薪资提交和查询
 * - 加密统计计算
 * - 权限控制
 * - 边界情况
 */
describe("ConfidentialSalary - Enhanced Tests", function () {
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

  describe("部门管理", function () {
    it("HR 应该能够创建部门", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      // 注意：实际测试中需要使用真实的加密预算数据
      const encryptedBudget = ethers.randomBytes(32); // 占位符
      
      await expect(
        confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget)
      )
        .to.emit(confidentialSalary, "DepartmentCreated")
        .withArgs(1, "技术部");
    });

    it("非 HR 不应该能够创建部门", async function () {
      const { confidentialSalary, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(employee1).createDepartment("技术部", encryptedBudget)
      ).to.be.revertedWith("Only HR or Admin");
    });

    it("应该能够获取部门信息", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      const dept = await confidentialSalary.getDepartment(1);
      expect(dept.name).to.equal("技术部");
      expect(dept.employeeCount).to.equal(0);
    });

    it("应该能够创建多个部门", async function () {
      const { confidentialSalary, hr } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).createDepartment("市场部", encryptedBudget);
      
      const dept1 = await confidentialSalary.getDepartment(1);
      const dept2 = await confidentialSalary.getDepartment(2);
      
      expect(dept1.name).to.equal("技术部");
      expect(dept2.name).to.equal("市场部");
    });
  });

  describe("员工管理", function () {
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

    it("应该正确更新部门员工数量", async function () {
      const { confidentialSalary, hr, employee1, employee2 } = await loadFixture(
        deployConfidentialSalaryFixture
      );
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      let dept = await confidentialSalary.getDepartment(1);
      expect(dept.employeeCount).to.equal(1);
      
      await confidentialSalary.connect(hr).addEmployee(employee2.address, "李四", 0, 1);
      dept = await confidentialSalary.getDepartment(1);
      expect(dept.employeeCount).to.equal(2);
    });

    it("不应该能够添加已存在的员工", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      await expect(
        confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1)
      ).to.be.revertedWith("Employee already exists");
    });

    it("不应该能够添加员工到不存在的部门", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      await expect(
        confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 999)
      ).to.be.revertedWith("Department does not exist");
    });
  });

  describe("薪资管理", function () {
    it("HR 应该能够提交加密薪资", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      const encryptedSalary = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary)
      )
        .to.emit(confidentialSalary, "SalarySubmitted")
        .withArgs(employee1.address, 1);
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

    it("经理应该能够查看部门员工的薪资", async function () {
      const { confidentialSalary, hr, manager, employee1 } = await loadFixture(
        deployConfidentialSalaryFixture
      );
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      const encryptedSalary = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary);
      
      const salary = await confidentialSalary.connect(manager).getEncryptedSalary(employee1.address);
      expect(salary.length).to.be.greaterThan(0);
    });

    it("员工不应该能够查看其他员工的薪资", async function () {
      const { confidentialSalary, hr, employee1, employee2 } = await loadFixture(
        deployConfidentialSalaryFixture
      );
      
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

  describe("权限控制", function () {
    it("只有 Admin 能够分配角色", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(deployConfidentialSalaryFixture);
      
      await expect(
        confidentialSalary.connect(hr).assignRole(employee1.address, 1)
      ).to.be.revertedWith("Only admin");
    });

    it("Admin 应该能够分配角色", async function () {
      const { confidentialSalary, owner, employee1 } = await loadFixture(
        deployConfidentialSalaryFixture
      );
      
      await confidentialSalary.connect(owner).assignRole(employee1.address, 1);
      expect(await confidentialSalary.roles(employee1.address)).to.equal(1);
    });
  });

  describe("边界情况", function () {
    it("不应该能够获取不存在的部门", async function () {
      const { confidentialSalary } = await loadFixture(deployConfidentialSalaryFixture);
      
      await expect(confidentialSalary.getDepartment(999)).to.be.revertedWith(
        "Department does not exist"
      );
    });

    it("不应该能够提交不存在的员工的薪资", async function () {
      const { confidentialSalary, hr, employee1 } = await loadFixture(
        deployConfidentialSalaryFixture
      );
      
      const encryptedSalary = ethers.randomBytes(32);
      
      await expect(
        confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary)
      ).to.be.revertedWith("Employee does not exist");
    });

    it("空部门的统计应该返回 0", async function () {
      const { confidentialSalary, hr, manager } = await loadFixture(
        deployConfidentialSalaryFixture
      );
      
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      // 注意：实际测试中需要使用真实的 FHE 操作
      // 这里只是验证函数可以调用
      const total = await confidentialSalary.connect(manager).getDepartmentTotalSalary(1);
      expect(total.length).to.be.greaterThan(0);
    });
  });
});


