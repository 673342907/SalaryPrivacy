import { expect } from "chai";
import { ethers } from "hardhat";
import { describe, it, beforeEach } from "mocha";

describe("{{CONTRACT_NAME}}", function () {
  let contract: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("{{CONTRACT_NAME}}");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  describe("Store and Access Control", function () {
    it("Should store encrypted value", async function () {
      const encryptedValue = ethers.randomBytes(32);
      const id = await contract.storeValue(encryptedValue);
      expect(id).to.equal(1);
    });

    it("Should allow user access", async function () {
      const encryptedValue = ethers.randomBytes(32);
      const id = await contract.storeValue(encryptedValue);
      
      await contract.allowUserAccess(id, user1.address);
      
      const value = await contract.connect(user1).getValue(id);
      expect(value.length).to.be.greaterThan(0);
    });

    it("Should deny access without permission", async function () {
      const encryptedValue = ethers.randomBytes(32);
      const id = await contract.storeValue(encryptedValue);
      
      await expect(
        contract.connect(user2).getValue(id)
      ).to.be.revertedWith("Access denied");
    });
  });
});

