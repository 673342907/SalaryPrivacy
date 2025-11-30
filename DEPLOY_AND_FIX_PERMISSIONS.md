# 🔧 解决权限问题指南

## 🔍 问题诊断

你遇到的"权限不够"问题可能有以下原因：

1. **合约地址配置错误** - 你填的是钱包地址，不是合约地址
2. **合约未部署** - 合约还没有部署到 Sepolia
3. **使用错误的账户** - 连接的钱包不是部署者账户

## ✅ 解决方案

### 步骤 1: 部署合约（使用新地址作为部署者）

```powershell
# 1. 进入 hardhat 目录
cd packages\hardhat

# 2. 编译合约
pnpm compile

# 3. 在 MetaMask 中切换到地址: 0x6419cd60481d30528eb28005154169dd3c53e8b2
# 确保这个地址有 Sepolia ETH

# 4. 部署合约
pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia
```

部署成功后，你会看到类似输出：
```
✅ 部署成功！
==========================================
合约名称: ConfidentialSalary
合约地址: 0x...  ← 这是真正的合约地址！
网络: Sepolia (Chain ID: 11155111)
==========================================
```

### 步骤 2: 更新前端配置

复制部署输出的**合约地址**（不是钱包地址），更新配置文件：

```typescript
// packages/confidential-salary-frontend/src/config/contracts.ts
export const CONTRACT_ADDRESSES = {
  31337: '',
  11155111: '0x...', // ← 粘贴这里（合约地址，不是钱包地址）
};
```

### 步骤 3: 验证部署

检查合约是否正确部署：

```powershell
# 使用部署的账户检查
pnpm exec hardhat run deploy/check-contract.ts --network sepolia --address 0x你的合约地址
```

### 步骤 4: 连接正确的钱包

1. **使用部署合约的账户连接钱包**
   - 地址: `0x6419cd60481d30528eb28005154169dd3c53e8b2`
   - 这个地址会自动成为 Admin

2. **刷新前端页面**

3. **检查角色显示**
   - 应该显示"管理员 (Admin)"

## 🔍 如何区分合约地址和钱包地址

- **钱包地址（EOA）**: 通常以 `0x` 开头，42 个字符，没有代码
- **合约地址**: 也是 42 个字符，但包含智能合约代码

### 检查方法

在 Etherscan 上查看：
- 钱包地址：显示为 "Address" 类型
- 合约地址：显示为 "Contract" 类型，有 "Contract" 标签

## 📝 完整操作流程

```powershell
# 1. 编译合约
cd packages\hardhat
pnpm compile

# 2. 切换到新地址的 MetaMask 账户
# 地址: 0x6419cd60481d30528eb28005154169dd3c53e8b2

# 3. 部署合约
pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia

# 4. 复制输出的合约地址（例如: 0xABC123...）

# 5. 更新前端配置
# 编辑: packages/confidential-salary-frontend/src/config/contracts.ts
# 将合约地址粘贴到 11155111 对应的值

# 6. 重启前端（如果正在运行）
cd ..\confidential-salary-frontend
pnpm start

# 7. 使用部署账户连接钱包
# 应该显示"管理员 (Admin)"
```

## ⚠️ 常见错误

### 错误 1: "合约地址无效"
- **原因**: 填的是钱包地址，不是合约地址
- **解决**: 使用部署输出的合约地址

### 错误 2: "权限不够"
- **原因**: 使用的账户不是部署者
- **解决**: 使用部署合约的账户连接钱包

### 错误 3: "无法连接到合约"
- **原因**: 合约地址错误或合约未部署
- **解决**: 检查合约是否已部署，地址是否正确

## 🎯 快速检查清单

- [ ] 合约已编译 (`pnpm compile`)
- [ ] 使用正确的账户部署（`0x6419cd60481d30528eb28005154169dd3c53e8b2`）
- [ ] 部署成功并复制了合约地址
- [ ] 前端配置中填的是合约地址（不是钱包地址）
- [ ] 使用部署账户连接钱包
- [ ] 在 Sepolia 网络

---

**按照以上步骤操作，权限问题应该就能解决了！** ✅

