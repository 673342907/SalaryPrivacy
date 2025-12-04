import { expect } from "chai";
import { ethers } from "hardhat";
import { describe, it } from "mocha";

/**
 * @file performance.test.ts
 * @author ConfidentialSalary Team
 * @description 性能测试和 Gas 使用分析
 * 
 * @custom:chapter testing
 * @custom:chapter performance
 */

describe("ConfidentialSalary - Performance Tests", function () {
  let confidentialSalary: any;
  let owner: any;
  let hr: any;
  let employee1: any;

  before(async function () {
    [owner, hr, employee1] = await ethers.getSigners();

    const ConfidentialSalary = await ethers.getContractFactory("ConfidentialSalary");
    confidentialSalary = await ConfidentialSalary.deploy();
    await confidentialSalary.waitForDeployment();

    await confidentialSalary.connect(owner).assignRole(hr.address, 2); // HR
  });

  describe("Gas Usage Analysis", function () {
    it("Should measure gas for creating department", async function () {
      const encryptedBudget = ethers.randomBytes(32);
      
      const tx = await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      const receipt = await tx.wait();
      
      const gasUsed = receipt?.gasUsed || 0n;
      console.log(`创建部门 Gas 使用: ${gasUsed.toString()}`);
      
      expect(gasUsed).to.be.greaterThan(0n);
    });

    it("Should measure gas for adding employee", async function () {
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      const tx = await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      const receipt = await tx.wait();
      
      const gasUsed = receipt?.gasUsed || 0n;
      console.log(`添加员工 Gas 使用: ${gasUsed.toString()}`);
      
      expect(gasUsed).to.be.greaterThan(0n);
    });

    it("Should measure gas for submitting salary", async function () {
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      await confidentialSalary.connect(hr).addEmployee(employee1.address, "张三", 0, 1);
      
      const encryptedSalary = ethers.randomBytes(32);
      const tx = await confidentialSalary.connect(hr).submitSalary(employee1.address, encryptedSalary);
      const receipt = await tx.wait();
      
      const gasUsed = receipt?.gasUsed || 0n;
      console.log(`提交薪资 Gas 使用: ${gasUsed.toString()}`);
      
      expect(gasUsed).to.be.greaterThan(0n);
    });
  });

  describe("Batch Operations Performance", function () {
    it("Should handle multiple departments efficiently", async function () {
      const encryptedBudget = ethers.randomBytes(32);
      const startGas = await ethers.provider.estimateGas({
        from: hr.address,
        to: await confidentialSalary.getAddress(),
      });

      for (let i = 0; i < 5; i++) {
        await confidentialSalary.connect(hr).createDepartment(`部门${i}`, encryptedBudget);
      }

      const endGas = await ethers.provider.estimateGas({
        from: hr.address,
        to: await confidentialSalary.getAddress(),
      });

      console.log(`批量创建部门 Gas 变化: ${startGas.toString()} -> ${endGas.toString()}`);
    });

    it("Should handle multiple employees efficiently", async function () {
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);

      const employees = await ethers.getSigners();
      const startTime = Date.now();

      for (let i = 1; i < 6; i++) {
        await confidentialSalary.connect(hr).addEmployee(
          employees[i].address,
          `员工${i}`,
          0,
          1
        );
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log(`批量添加员工耗时: ${duration}ms`);
      
      expect(duration).to.be.lessThan(10000); // 应该在 10 秒内完成
    });
  });

  describe("Storage Efficiency", function () {
    it("Should efficiently store encrypted data", async function () {
      const encryptedBudget = ethers.randomBytes(32);
      await confidentialSalary.connect(hr).createDepartment("技术部", encryptedBudget);
      
      const dept = await confidentialSalary.getDepartment(1);
      expect(dept.encryptedBudget.length).to.be.greaterThan(0);
      expect(dept.encryptedBudget.length).to.be.lessThanOrEqual(100); // 合理的加密数据大小
    });
  });
});

