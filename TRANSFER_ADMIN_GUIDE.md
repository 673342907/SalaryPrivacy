# 🔄 转移 Admin 角色指南

## 📋 概述

如果你想要将 Admin 角色转移给新地址 `0x6419cd60481d30528eb28005154169dd3c53e8b2`，需要完成以下步骤：

## ⚠️ 重要说明

### 如果合约已经部署

**已部署的合约无法修改！** 你需要：

1. **重新部署合约**（会丢失现有数据）
2. **或者使用代理合约模式**（复杂，需要升级机制）

### 如果合约还未部署

直接部署新合约即可，新地址会自动成为 Admin。

## 🚀 操作步骤

### 方法 1: 重新部署合约（推荐，如果数据不重要）

1. **更新部署脚本**
   ```typescript
   // 在 deploy/deploy-confidential-salary.ts 中
   // 使用新地址作为部署者
   ```

2. **使用新地址部署**
   ```powershell
   # 确保 MetaMask 切换到新地址
   cd packages\hardhat
   pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia
   ```

3. **更新前端配置**
   - 更新 `packages/confidential-salary-frontend/src/config/contracts.ts` 中的合约地址

### 方法 2: 使用转移功能（如果合约已更新）

如果合约已经包含 `transferAdmin` 函数：

1. **重新编译合约**
   ```powershell
   cd packages\hardhat
   pnpm compile
   ```

2. **重新部署合约**
   ```powershell
   pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia
   ```

3. **使用前端转移**
   - 使用当前 Admin 账户连接钱包
   - 在"角色权限管理"部分
   - 点击"转移 Admin 角色"
   - 输入新地址：`0x6419cd60481d30528eb28005154169dd3c53e8b2`
   - 确认转移

## 📝 详细步骤（使用转移功能）

### 步骤 1: 重新编译合约

合约代码已更新，包含 `transferAdmin` 函数：

```solidity
function transferAdmin(address newAdmin) external onlyAdmin {
    require(newAdmin != address(0), "Invalid address");
    require(newAdmin != msg.sender, "Cannot transfer to yourself");
    require(roles[newAdmin] != Role.Admin, "Address is already Admin");
    
    // 将当前 Admin 降级为 HR
    roles[msg.sender] = Role.HR;
    if (employees[msg.sender].exists) {
        employees[msg.sender].role = Role.HR;
    }
    
    // 将新地址设置为 Admin
    roles[newAdmin] = Role.Admin;
    if (employees[newAdmin].exists) {
        employees[newAdmin].role = Role.Admin;
    }
    
    emit AdminTransferred(msg.sender, newAdmin);
}
```

### 步骤 2: 重新部署合约

```powershell
# 1. 进入 hardhat 目录
cd packages\hardhat

# 2. 编译合约
pnpm compile

# 3. 部署到 Sepolia（使用新地址的账户）
# 确保 MetaMask 切换到新地址 0x6419cd60481d30528eb28005154169dd3c53e8b2
pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia
```

### 步骤 3: 更新前端配置

更新合约地址：

```typescript
// packages/confidential-salary-frontend/src/config/contracts.ts
export const CONTRACT_ADDRESSES = {
  31337: '',
  11155111: '新的合约地址', // 更新这里
};
```

### 步骤 4: 使用前端转移（如果使用旧合约）

如果旧合约已经部署，但你想保留数据：

1. **使用当前 Admin 账户连接**
2. **打开"角色权限管理"**
3. **点击"转移 Admin 角色"**
4. **输入新地址**：`0x6419cd60481d30528eb28005154169dd3c53e8b2`
5. **确认转移**

⚠️ **注意**：如果旧合约没有 `transferAdmin` 函数，此方法不可用。

## 🔍 验证转移

转移完成后：

1. **使用新地址连接钱包**
2. **刷新页面**
3. **检查角色显示**：应该显示"管理员 (Admin)"
4. **测试 Admin 功能**：尝试创建部门、管理角色等

## ⚠️ 注意事项

1. **不可逆操作**
   - 转移后，原 Admin 变为 HR
   - 无法撤销转移

2. **数据保留**
   - 如果重新部署，所有数据会丢失
   - 如果使用转移功能，数据会保留

3. **Gas 费用**
   - 转移操作需要支付 Gas 费用
   - 确保账户有足够的 Sepolia ETH

4. **地址验证**
   - 确保新地址格式正确
   - 不能转移给自己
   - 不能转移给已经是 Admin 的地址

## 🎯 快速操作（推荐）

如果你想立即使用新地址作为 Admin：

```powershell
# 1. 编译合约
cd packages\hardhat
pnpm compile

# 2. 切换到新地址的 MetaMask 账户

# 3. 部署合约（新地址自动成为 Admin）
pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia

# 4. 复制新合约地址

# 5. 更新前端配置
# 编辑 packages/confidential-salary-frontend/src/config/contracts.ts
# 更新合约地址

# 6. 重启前端
cd ..\confidential-salary-frontend
pnpm start
```

---

**现在你可以将 Admin 角色转移给新地址了！** 🔄✨

