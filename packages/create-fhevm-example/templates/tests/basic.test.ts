import { expect } from "chai";
import { ethers } from "hardhat";
import { describe, it, beforeEach } from "mocha";

describe("{{CONTRACT_NAME}}", function () {
  let contract: any;
  let owner: any;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("{{CONTRACT_NAME}}");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await contract.getAddress()).to.be.properAddress;
    });
  });

  describe("Store and Retrieve", function () {
    it("Should store and retrieve encrypted value", async function () {
      const encryptedValue = ethers.randomBytes(32);
      const id = await contract.storeValue(encryptedValue);
      expect(id).to.equal(1);
      
      const retrieved = await contract.getValue(1);
      expect(retrieved.length).to.be.greaterThan(0);
    });
  });
});

