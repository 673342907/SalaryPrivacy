# 🚀 部署 ConfidentialSalary 合约指南

## 📋 当前状态

你已经成功部署了示例合约到 Sepolia，现在需要部署 ConfidentialSalary 合约。

## 🎯 部署步骤

### 方法 1: 使用单独部署脚本（推荐）

```powershell
# 在 packages/hardhat 目录
cd packages\hardhat

# 部署 ConfidentialSalary 合约
pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia
```

### 方法 2: 使用更新后的部署脚本

```powershell
# 在 packages/hardhat 目录
cd packages\hardhat

# 这会部署所有合约，包括 ConfidentialSalary
pnpm deploy:sepolia
```

## 📝 部署后需要做的事情

### 步骤 1: 记录合约地址

部署成功后，你会看到类似输出：

```
✅ 部署成功！
==========================================
合约名称: ConfidentialSalary
合约地址: 0x...
网络: Sepolia (Chain ID: 11155111)
==========================================
```

**请复制这个地址！**

### 步骤 2: 更新前端配置

更新以下两个文件中的合约地址：

**文件 1**: `packages/confidential-salary-frontend/src/config/contracts.ts`

```typescript
export const CONTRACT_ADDRESSES = {
  11155111: '0x你的合约地址', // 粘贴你的合约地址
};
```

**文件 2**: `packages/confidential-salary-frontend/src/App.tsx`

```typescript
const CONTRACT_ADDRESSES = {
  11155111: '0x你的合约地址', // 粘贴你的合约地址
};
```

### 步骤 3: 启动前端应用

```powershell
# 进入前端目录
cd packages\confidential-salary-frontend

# 安装依赖（如果还没有）
pnpm install

# 启动应用
pnpm start
```

## ✅ 验证部署

### 在 Etherscan 上查看

1. 访问 https://sepolia.etherscan.io/
2. 搜索你的合约地址
3. 验证合约代码（可选）

### 在前端应用中测试

1. 连接钱包
2. 切换到 Sepolia 网络
3. 尝试创建部门
4. 查看部门列表

## 🎯 快速命令

```powershell
# 1. 部署合约
cd packages\hardhat
pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia

# 2. 复制合约地址

# 3. 更新前端配置（手动编辑文件）

# 4. 启动前端
cd ..\confidential-salary-frontend
pnpm install
pnpm start
```

---

**现在运行部署命令，然后更新前端配置！** 🚀

