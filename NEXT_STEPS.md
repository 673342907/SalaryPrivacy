# 🎯 下一步行动清单

## 📍 当前状态

✅ 项目环境已设置  
✅ 智能合约初始代码已创建 (`contracts/ConfidentialSalary.sol`)  
✅ 项目方案文档已准备  
✅ 有可参考的示例代码 (react-showcase)

---

## 🚀 立即开始（今天）

### 步骤 1: 将合约添加到 Hardhat 项目 (10分钟)

```powershell
# 1. 复制合约到 hardhat 目录
copy contracts\ConfidentialSalary.sol packages\hardhat\contracts\

# 2. 验证文件已复制
dir packages\hardhat\contracts\
```

### 步骤 2: 编译合约 (5分钟)

```powershell
# 进入 hardhat 目录
cd packages\hardhat

# 编译合约
pnpm compile

# 如果编译成功，你会看到：
# ✅ Compiled successfully
```

**如果编译出错**：
- 检查 Solidity 版本是否匹配 (0.8.24)
- 确保 FHEVM 依赖已安装

### 步骤 3: 测试合约是否能编译 (5分钟)

```powershell
# 在 packages/hardhat 目录下
pnpm test

# 或者只编译不测试
pnpm compile
```

---

## 📅 本周任务（Week 1）

### Day 1-2: 完善智能合约

#### ✅ 任务清单

- [ ] **修复合约中的问题**
  - 检查 `checkBudgetCompliance` 函数的返回值类型
  - 确保所有 FHE 操作正确
  - 添加缺失的功能

- [ ] **添加更多功能**
  ```solidity
  // 需要添加的功能：
  - 计算平均薪资（加密计算）
  - 薪资范围查询
  - 部门间薪资比较
  - 审计日志
  ```

- [ ] **优化权限系统**
  - 完善角色检查
  - 添加批量操作权限

#### 📝 具体操作

1. **打开合约文件**：
   ```powershell
   code packages\hardhat\contracts\ConfidentialSalary.sol
   ```

2. **修复 `checkBudgetCompliance` 函数**：
   ```solidity
   // 当前代码可能有问题，需要修复返回值
   function checkBudgetCompliance(uint256 departmentId)
       external
       view
       returns (ebool)  // 直接返回 ebool
   {
       // 实现逻辑
   }
   ```

3. **添加平均薪资计算**：
   ```solidity
   function calculateAverageSalary(uint256 departmentId)
       external
       view
       returns (bytes32)
   {
       Department storage dept = departments[departmentId];
       // 使用 FHE 除法计算平均值
       // 注意：FHE 可能不支持直接除法，需要特殊处理
   }
   ```

### Day 3-4: 编写测试

#### ✅ 任务清单

- [ ] **创建测试文件**
  ```powershell
  # 创建测试目录（如果不存在）
  mkdir packages\hardhat\test\confidential-salary
  
  # 创建测试文件
  New-Item packages\hardhat\test\confidential-salary\ConfidentialSalary.test.ts
  ```

- [ ] **编写基础测试**
  - 部门创建测试
  - 员工添加测试
  - 薪资提交测试
  - 权限测试

#### 📝 测试示例代码

创建 `packages/hardhat/test/confidential-salary/ConfidentialSalary.test.ts`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ConfidentialSalary", function () {
  let salary: any;
  let owner: HardhatEthersSigner;
  let hr: HardhatEthersSigner;
  let employee: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, hr, employee] = await ethers.getSigners();
    
    const ConfidentialSalary = await ethers.getContractFactory("ConfidentialSalary");
    salary = await ConfidentialSalary.deploy();
  });

  describe("部门管理", function () {
    it("应该允许 HR 创建部门", async function () {
      // 先设置 HR 角色
      await salary.updateRole(hr.address, 3); // Role.HR
      
      // 创建部门（需要加密预算）
      // 这里需要 FHEVM 测试环境
    });
  });

  describe("员工管理", function () {
    it("应该允许 HR 添加员工", async function () {
      // 测试逻辑
    });
  });

  describe("薪资提交", function () {
    it("应该允许 HR 提交加密薪资", async function () {
      // 测试逻辑
    });
  });
});
```

### Day 5: 本地测试和调试

#### ✅ 任务清单

- [ ] **运行所有测试**
  ```powershell
  cd packages\hardhat
  pnpm test
  ```

- [ ] **修复测试中的错误**
- [ ] **确保测试覆盖率 > 50%**（本周目标）

---

## 📅 下周任务（Week 2）

### Day 1-3: 前端开发 - 基础结构

#### ✅ 任务清单

- [ ] **创建新的前端项目**（基于 react-showcase）
  ```powershell
  # 复制 react-showcase 作为基础
  xcopy packages\react-showcase packages\confidential-salary-frontend /E /I
  
  # 或者创建新的 React 项目
  cd packages
  npm create vite@latest confidential-salary-frontend -- --template react-ts
  ```

- [ ] **安装依赖**
  ```powershell
  cd packages\confidential-salary-frontend
  pnpm install
  pnpm add @fhevm-sdk ethers
  ```

- [ ] **创建基础页面结构**
  ```
  src/
  ├── pages/
  │   ├── Dashboard.tsx
  │   ├── Departments.tsx
  │   ├── Employees.tsx
  │   ├── Salary.tsx
  │   └── Statistics.tsx
  ├── components/
  │   ├── Layout/
  │   ├── DepartmentCard.tsx
  │   └── EmployeeCard.tsx
  └── hooks/
      ├── useSalary.ts
      └── useDepartment.ts
  ```

### Day 4-5: 前端开发 - 核心功能

#### ✅ 任务清单

- [ ] **实现钱包连接**
- [ ] **实现部门管理页面**
- [ ] **实现员工管理页面**
- [ ] **实现薪资提交功能**

---

## 📅 第三周任务（Week 3）

### Day 1-3: UI/UX 优化

- [ ] 使用 Tailwind CSS 美化界面
- [ ] 添加加载状态
- [ ] 添加错误处理
- [ ] 响应式设计

### Day 4-5: 测试和完善

- [ ] 端到端测试
- [ ] 修复 bug
- [ ] 性能优化

---

## 📅 第四周任务（Week 4）

### Day 1-2: 部署

- [ ] 部署合约到 Sepolia
- [ ] 部署前端到 Vercel/Netlify
- [ ] 配置环境变量

### Day 3-4: 文档

- [ ] 编写 README.md
- [ ] 编写技术文档
- [ ] 编写用户指南

### Day 5: 演示视频

- [ ] 录制演示视频
- [ ] 编辑视频
- [ ] 上传到 YouTube

---

## 🎯 今天立即执行（按顺序）

### 1️⃣ 复制合约到 Hardhat (2分钟)

```powershell
# 在项目根目录
copy contracts\ConfidentialSalary.sol packages\hardhat\contracts\ConfidentialSalary.sol
```

### 2️⃣ 编译合约 (3分钟)

```powershell
cd packages\hardhat
pnpm compile
```

### 3️⃣ 检查编译结果 (2分钟)

如果编译成功 ✅ → 继续下一步  
如果编译失败 ❌ → 查看错误信息，修复后重试

### 4️⃣ 创建测试文件 (5分钟)

```powershell
# 在 packages/hardhat 目录
mkdir test\confidential-salary
New-Item test\confidential-salary\ConfidentialSalary.test.ts
```

### 5️⃣ 编写第一个测试 (10分钟)

参考上面的测试示例，编写一个简单的测试。

### 6️⃣ 运行测试 (2分钟)

```powershell
pnpm test
```

---

## 🆘 如果遇到问题

### 编译错误

1. **检查 Solidity 版本**
   ```solidity
   pragma solidity ^0.8.24;
   ```

2. **检查导入路径**
   ```solidity
   import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
   ```

3. **查看详细错误**
   ```powershell
   pnpm compile --verbose
   ```

### 测试错误

1. **检查 Hardhat 配置**
   - 确保 FHEVM 插件已配置
   - 检查网络配置

2. **查看测试日志**
   ```powershell
   pnpm test --verbose
   ```

---

## 📚 参考资源

- **现有示例**: `packages/react-showcase/src/components/`
- **合约示例**: `packages/hardhat/contracts/`
- **测试示例**: `packages/react-showcase/test/`
- **项目方案**: `ZAMA_PROJECT_PLAN.md`

---

## ✅ 每日检查清单

每天结束时检查：

- [ ] 今天完成了什么？
- [ ] 遇到了什么问题？
- [ ] 明天要做什么？
- [ ] 代码是否已提交到 Git？

---

## 🎯 本周目标

**Week 1 结束前应该完成**：
- ✅ 合约可以编译
- ✅ 至少 3 个基础测试通过
- ✅ 前端项目结构已创建
- ✅ 至少一个页面可以运行

**开始吧！从步骤 1 开始执行。** 🚀

