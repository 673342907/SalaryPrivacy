# 🔧 故障排除指南

## ❌ 问题：连接钱包后没有权限

### 可能原因和解决方案

#### 1. 合约地址配置错误 ⚠️ 最常见

**症状：**
- 连接钱包后显示"无权限 (None)"
- 页面提示"合约地址无效"

**原因：**
- 填的是钱包地址，不是合约地址
- 合约地址格式错误

**解决：**
1. 检查配置文件 `packages/confidential-salary-frontend/src/config/contracts.ts`
2. 确保填的是**合约地址**（部署后输出的地址）
3. 合约地址应该：
   - 以 `0x` 开头
   - 42 个字符
   - 在 Etherscan 上显示为 "Contract" 类型

**如何获取正确的合约地址：**
```powershell
# 部署合约
cd packages\hardhat
pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia

# 复制输出的合约地址（例如: 0xABC123...）
# 更新到前端配置
```

#### 2. 使用错误的账户连接

**症状：**
- 连接的钱包不是部署者账户
- 显示"无权限 (None)"

**原因：**
- 只有部署合约的账户自动成为 Admin
- 其他账户需要被分配角色

**解决：**
1. 使用部署合约的账户连接钱包
2. 或者让 Admin 为你分配角色

#### 3. 合约未部署

**症状：**
- 页面提示"合约地址无效或合约未部署"
- 无法连接到合约

**解决：**
1. 先部署合约：
   ```powershell
   cd packages\hardhat
   pnpm compile
   pnpm exec hardhat run deploy/deploy-confidential-salary.ts --network sepolia
   ```
2. 复制合约地址到前端配置

#### 4. 网络不匹配

**症状：**
- 合约地址正确，但无法连接

**解决：**
1. 确保在 Sepolia 网络
2. 检查 MetaMask 网络设置
3. 使用页面上的"切换到 Sepolia"按钮

## ❌ 问题：Talisman 扩展错误

**症状：**
```
ERROR: Talisman extension has not been configured yet.
```

**原因：**
- Talisman 钱包扩展未配置
- 不影响功能，但会在控制台显示错误

**解决：**
- 已添加错误处理，会自动忽略
- 如果仍有问题，可以禁用 Talisman 扩展

## 🔍 调试步骤

### 步骤 1: 检查合约地址

在浏览器控制台运行：
```javascript
// 检查合约地址是否有代码
const code = await window.ethereum.request({
  method: 'eth_getCode',
  params: ['0x你的合约地址', 'latest']
});
console.log('合约代码:', code);
// 如果返回 '0x' 或 '0x0'，说明不是合约地址
```

### 步骤 2: 检查账户角色

在浏览器控制台运行：
```javascript
// 需要先连接钱包
const contract = new ethers.Contract(
  '0x你的合约地址',
  [...ABI],
  provider
);
const role = await contract.roles('0x你的账户地址');
console.log('角色:', role);
// 0 = None, 1 = Employee, 2 = Manager, 3 = HR, 4 = Admin
```

### 步骤 3: 验证部署

```powershell
# 检查合约是否部署
cd packages\hardhat
pnpm exec hardhat run deploy/check-contract.ts --network sepolia --address 0x你的合约地址
```

## 📝 检查清单

在报告问题前，请检查：

- [ ] 合约已编译 (`pnpm compile`)
- [ ] 合约已部署到 Sepolia
- [ ] 前端配置中使用的是**合约地址**（不是钱包地址）
- [ ] 使用部署合约的账户连接钱包
- [ ] 在 Sepolia 网络
- [ ] 账户有足够的 Sepolia ETH

## 🎯 快速修复

如果所有检查都正确但仍无权限：

1. **重新部署合约**（使用正确的账户）
2. **更新前端配置**（使用新的合约地址）
3. **清除浏览器缓存**
4. **重新连接钱包**

---

**如果问题仍然存在，请提供：**
- 合约地址
- 连接的钱包地址
- 浏览器控制台的错误信息

