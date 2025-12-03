# 🚀 部署指南

## 📋 目录

1. [智能合约部署](#智能合约部署)
2. [前端与智能合约连接](#前端与智能合约连接)
3. [环境变量配置](#环境变量配置)
4. [验证部署](#验证部署)

---

## 1. 智能合约部署

### 1.1 准备工作

#### 安装依赖
```bash
cd packages/hardhat
pnpm install
```

#### 配置环境变量
创建 `.env` 文件：
```bash
# 部署账户私钥（不要提交到 Git）
PRIVATE_KEY=your_private_key_here

# Sepolia RPC URL（可以使用 Infura、Alchemy 等）
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Etherscan API Key（用于验证合约）
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 1.2 编译合约
```bash
cd packages/hardhat
pnpm compile
```

### 1.3 部署到 Sepolia 测试网
```bash
pnpm deploy:sepolia
```

### 1.4 验证合约（可选）
```bash
pnpm verify <CONTRACT_ADDRESS>
```

### 1.5 更新合约地址
部署成功后，合约地址会自动保存到 `packages/hardhat/deployments/sepolia.json`。

**手动更新前端合约地址：**
1. 打开 `packages/nextjs/contracts/deployedContracts.ts`
2. 更新 `ConfidentialSalary` 合约地址
3. 或设置环境变量 `NEXT_PUBLIC_CONTRACT_ADDRESS`

---

## 2. 前端与智能合约连接

### 2.1 安装依赖
前端依赖已包含在 `packages/nextjs/package.json` 中，无需额外安装。

### 2.2 使用 Hook

在组件中使用 `useConfidentialSalary` Hook：

```typescript
import { useConfidentialSalary } from "~~/hooks/confidential-salary/useConfidentialSalary";

function MyComponent() {
  const {
    createDepartment,
    addEmployee,
    submitSalary,
    fhevmStatus,
    isPending,
  } = useConfidentialSalary();

  const handleCreateDepartment = async () => {
    await createDepartment("技术部", 100000);
  };

  return (
    <div>
      <button onClick={handleCreateDepartment}>
        创建部门
      </button>
    </div>
  );
}
```

### 2.3 更新组件

#### 更新 SalaryManagement.tsx

```typescript
import { useConfidentialSalary } from "~~/hooks/confidential-salary/useConfidentialSalary";

export function SalaryManagement() {
  const { submitSalary, isPending } = useConfidentialSalary();

  const handleSubmitSalary = async () => {
    await submitSalary(formData.employeeAddress, parseFloat(formData.amount));
  };

  // ... 其他代码
}
```

#### 更新 DepartmentManagement.tsx

```typescript
import { useConfidentialSalary } from "~~/hooks/confidential-salary/useConfidentialSalary";

export function DepartmentManagement() {
  const { createDepartment, isPending } = useConfidentialSalary();

  const handleCreateDepartment = async () => {
    await createDepartment(formData.name, parseFloat(formData.budget));
  };

  // ... 其他代码
}
```

---

## 3. 环境变量配置

### 3.1 本地开发

创建 `packages/nextjs/.env.local`：
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### 3.2 Vercel 部署

1. 进入 Vercel 项目设置
2. 添加环境变量：
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: 部署的合约地址

### 3.3 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | 部署的合约地址 | 是 |
| `PRIVATE_KEY` | 部署账户私钥（仅部署时） | 是 |
| `SEPOLIA_RPC_URL` | Sepolia RPC 端点 | 是 |
| `ETHERSCAN_API_KEY` | Etherscan API Key（验证用） | 否 |

---

## 4. 验证部署

### 4.1 检查合约部署
1. 在 [Sepolia Etherscan](https://sepolia.etherscan.io/) 查看合约
2. 验证合约代码（如果已验证）
3. 检查合约状态

### 4.2 测试前端连接
1. 连接钱包到 Sepolia 测试网
2. 检查 FHEVM 初始化状态
3. 尝试创建部门（需要测试 ETH）
4. 检查交易是否成功

### 4.3 常见问题

#### FHEVM 初始化失败
- 检查是否连接到 Sepolia 测试网
- 检查 Relayer SDK 是否已加载
- 查看浏览器控制台错误信息

#### 交易失败
- 检查账户是否有足够的 ETH
- 检查合约地址是否正确
- 检查函数参数是否正确

#### 加密/解密失败
- 检查 FHEVM 实例是否已初始化
- 检查数据类型是否匹配（uint32）
- 查看浏览器控制台错误信息

---

## 5. 测试流程

### 5.1 完整测试流程

1. **部署合约**
   ```bash
   cd packages/hardhat
   pnpm deploy:sepolia
   ```

2. **更新前端配置**
   - 更新 `deployedContracts.ts` 中的合约地址
   - 或设置环境变量

3. **运行前端**
   ```bash
   cd packages/nextjs
   pnpm dev
   ```

4. **测试功能**
   - 连接钱包
   - 创建部门
   - 添加员工
   - 提交薪资
   - 查看统计

### 5.2 自动化测试

运行测试套件：
```bash
cd packages/hardhat
pnpm test
```

---

## 6. 生产环境部署

### 6.1 合约部署到主网（未来）

1. 更新 `hardhat.config.ts` 添加主网配置
2. 使用主网 RPC URL
3. 使用主网部署账户
4. 部署并验证合约

### 6.2 前端部署

前端已自动部署到 Vercel，每次推送到 main 分支会自动触发部署。

---

## 📚 相关文档

- [Hardhat 文档](https://hardhat.org/docs)
- [FHEVM 文档](https://docs.zama.org)
- [Wagmi 文档](https://wagmi.sh)
- [Vercel 部署文档](https://vercel.com/docs)

