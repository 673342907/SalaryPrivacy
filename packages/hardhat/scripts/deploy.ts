import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { HardhatRuntimeEnvironment } from "hardhat/types";

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
  const hre = require("hardhat") as HardhatRuntimeEnvironment;
  
  console.log("🚀 开始部署 ConfidentialSalary 合约...\n");

  // 获取部署账户
  const [deployer] = await ethers.getSigners();
  console.log("📝 部署账户:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 账户余额:", ethers.formatEther(balance), "ETH\n");

  if (balance === 0n) {
    console.error("❌ 账户余额为 0，请先充值 Sepolia ETH");
    process.exit(1);
  }

  // 部署合约
  const ConfidentialSalary = await ethers.getContractFactory("ConfidentialSalary");
  console.log("⏳ 正在部署合约...");
  
  const confidentialSalary = await ConfidentialSalary.deploy();
  await confidentialSalary.waitForDeployment();
  
  const contractAddress = await confidentialSalary.getAddress();
  const blockNumber = await ethers.provider.getBlockNumber();
  
  console.log("✅ 合约部署成功！");
  console.log("📍 合约地址:", contractAddress);
  console.log("📦 部署区块:", blockNumber);
  console.log("🔗 在 Etherscan 查看: https://sepolia.etherscan.io/address/" + contractAddress + "\n");

  // 保存部署信息
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: blockNumber,
  };

  const deploymentPath = path.join(__dirname, "../deployments/sepolia.json");
  const deploymentDir = path.dirname(deploymentPath);
  
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 部署信息已保存到:", deploymentPath);

  // 读取 ABI 并更新前端配置
  const artifactPath = path.join(__dirname, "../artifacts/contracts/ConfidentialSalary.sol/ConfidentialSalary.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
    updateFrontendContract(contractAddress, artifact.abi, blockNumber, 11155111);
    console.log("✅ 前端合约配置已更新");
  } else {
    console.log("⚠️  未找到合约 ABI 文件，请先编译合约");
  }

  console.log("\n🎉 部署完成！");
  console.log("\n📋 下一步：");
  console.log("1. 在 Vercel 环境变量中设置 NEXT_PUBLIC_CONTRACT_ADDRESS=" + contractAddress);
  console.log("2. 或更新 packages/nextjs/.env.local 文件");
  console.log("3. 重新部署前端应用");
}

/**
 * 更新前端合约配置
 */
function updateFrontendContract(
  contractAddress: string,
  abi: any[],
  deployedOnBlock: number,
  chainId: number
) {
  const frontendPath = path.join(__dirname, "../../nextjs/contracts/deployedContracts.ts");
  
  if (!fs.existsSync(frontendPath)) {
    console.log("⚠️  前端合约文件不存在，创建新文件...");
    // 创建新文件
    const newContent = generateDeployedContractsContent(contractAddress, abi, deployedOnBlock, chainId);
    const frontendDir = path.dirname(frontendPath);
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }
    fs.writeFileSync(frontendPath, newContent);
    return;
  }

  try {
    let content = fs.readFileSync(frontendPath, "utf-8");
    
    // 检查是否已存在 ConfidentialSalary 配置
    if (content.includes("ConfidentialSalary")) {
      // 更新现有配置
      // 更新地址
      const addressRegex = new RegExp(
        `(ConfidentialSalary[^}]*address:\\s*["'])([^"']+)(["'])`,
        "s"
      );
      if (addressRegex.test(content)) {
        content = content.replace(addressRegex, `$1${contractAddress}$3`);
      }
      
      // 更新 ABI（简化处理，只更新关键部分）
      // 注意：完整 ABI 更新需要更复杂的解析
      console.log("⚠️  已存在 ConfidentialSalary 配置，仅更新地址");
    } else {
      // 添加新配置
      const insertPosition = content.lastIndexOf("} as const;");
      if (insertPosition !== -1) {
        const newConfig = generateContractConfig(contractAddress, abi, deployedOnBlock, chainId);
        content = content.slice(0, insertPosition) + newConfig + "\n" + content.slice(insertPosition);
      }
    }
    
    fs.writeFileSync(frontendPath, content);
  } catch (error) {
    console.log("⚠️  更新前端合约配置失败:", error);
    console.log("请手动更新 packages/nextjs/contracts/deployedContracts.ts");
  }
}

/**
 * 生成合约配置
 */
function generateContractConfig(
  contractAddress: string,
  abi: any[],
  deployedOnBlock: number,
  chainId: number
): string {
  // 简化 ABI（只包含主要函数）
  const simplifiedAbi = abi.filter((item: any) => 
    item.type === "function" || item.type === "event"
  );
  
  return `    ConfidentialSalary: {
      address: "${contractAddress}",
      abi: ${JSON.stringify(simplifiedAbi, null, 8).replace(/^/gm, "      ")},
      inheritedFunctions: {},
      deployedOnBlock: ${deployedOnBlock},
    },
`;
}

/**
 * 生成完整的 deployedContracts.ts 内容
 */
function generateDeployedContractsContent(
  contractAddress: string,
  abi: any[],
  deployedOnBlock: number,
  chainId: number
): string {
  const simplifiedAbi = abi.filter((item: any) => 
    item.type === "function" || item.type === "event"
  );
  
  return `/**
 * This file is autogenerated by helper.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/helper/contract";

const deployedContracts = {
  ${chainId}: {
    ConfidentialSalary: {
      address: "${contractAddress}",
      abi: ${JSON.stringify(simplifiedAbi, null, 6)},
      inheritedFunctions: {},
      deployedOnBlock: ${deployedOnBlock},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
`;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 部署失败:", error);
    process.exit(1);
  });

