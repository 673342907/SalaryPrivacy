import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * 部署 ConfidentialSalary 智能合约到 Sepolia 测试网
 * 
 * 使用方法：
 * 1. 设置环境变量：
 *    export PRIVATE_KEY=your_private_key
 *    export SEPOLIA_RPC_URL=https://rpc.sepolia.org
 * 
 * 2. 运行部署：
 *    pnpm deploy:sepolia
 */
async function main() {
  console.log("🚀 开始部署 ConfidentialSalary 合约...\n");

  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("📝 部署账户:", deployer.address);
  console.log("💰 账户余额:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // 部署合约
  const ConfidentialSalary = await ethers.getContractFactory("ConfidentialSalary");
  console.log("⏳ 正在部署合约...");
  
  const confidentialSalary = await ConfidentialSalary.deploy();
  await confidentialSalary.waitForDeployment();
  
  const contractAddress = await confidentialSalary.getAddress();
  console.log("✅ 合约部署成功！");
  console.log("📍 合约地址:", contractAddress);
  console.log("🔗 在 Etherscan 查看: https://sepolia.etherscan.io/address/" + contractAddress + "\n");

  // 保存部署信息
  const deploymentInfo = {
    network: "sepolia",
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  const deploymentPath = path.join(__dirname, "../deployments/sepolia.json");
  const deploymentDir = path.dirname(deploymentPath);
  
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 部署信息已保存到:", deploymentPath);

  // 更新前端合约地址
  updateFrontendContractAddress(contractAddress);

  console.log("\n🎉 部署完成！");
}

/**
 * 更新前端合约地址配置
 */
function updateFrontendContractAddress(contractAddress: string) {
  const frontendPath = path.join(__dirname, "../../nextjs/contracts/deployedContracts.ts");
  
  if (!fs.existsSync(frontendPath)) {
    console.log("⚠️  前端合约文件不存在，跳过更新");
    return;
  }

  try {
    let content = fs.readFileSync(frontendPath, "utf-8");
    
    // 查找并更新 ConfidentialSalary 合约地址
    const regex = /(ConfidentialSalary.*?address:\s*["'])([^"']+)(["'])/s;
    if (regex.test(content)) {
      content = content.replace(regex, `$1${contractAddress}$3`);
      fs.writeFileSync(frontendPath, content);
      console.log("✅ 前端合约地址已更新");
    } else {
      console.log("⚠️  未找到 ConfidentialSalary 合约配置，请手动更新");
    }
  } catch (error) {
    console.log("⚠️  更新前端合约地址失败:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });

