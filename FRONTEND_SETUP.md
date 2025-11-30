# 🎨 前端应用设置指南

## ✅ 已创建的文件

我已经为你创建了前端应用的基础结构：

```
packages/confidential-salary-frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # 仪表板组件 ✅
│   │   └── DepartmentManagement.tsx # 部门管理组件 ✅
│   ├── config/
│   │   └── contracts.ts           # 合约配置 ✅
│   ├── App.tsx                     # 主应用组件 ✅
│   ├── App.css                     # 样式文件 ✅
│   ├── index.tsx                   # 入口文件 ✅
│   └── types/
│       └── global.d.ts            # 类型定义 ✅
├── public/
│   └── index.html                 # HTML 模板 ✅
├── package.json                    # 依赖配置 ✅
├── craco.config.js                 # Webpack 配置 ✅
├── tailwind.config.js              # Tailwind 配置 ✅
└── tsconfig.json                   # TypeScript 配置 ✅
```

## 🚀 立即开始（3步）

### 步骤 1: 更新合约地址（重要！）

```typescript
// 编辑 src/config/contracts.ts
export const CONTRACT_ADDRESSES = {
  11155111: 'YOUR_DEPLOYED_CONTRACT_ADDRESS', // 填入你的合约地址
};
```

**同时更新 `src/App.tsx` 中的地址**:
```typescript
const CONTRACT_ADDRESSES = {
  11155111: 'YOUR_DEPLOYED_CONTRACT_ADDRESS', // 填入你的合约地址
};
```

### 步骤 2: 安装依赖

```powershell
# 进入前端目录
cd packages\confidential-salary-frontend

# 安装依赖
pnpm install

# 如果缺少 Tailwind，安装它
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 步骤 3: 启动应用

```powershell
# 启动开发服务器
pnpm start

# 应用将在 http://localhost:3000 打开
```

## 📋 接下来需要创建的组件

### 1. 员工管理组件 (`EmployeeManagement.tsx`)

功能：
- 添加员工
- 查看员工列表
- 员工详情

### 2. 薪资管理组件 (`SalaryManagement.tsx`)

功能：
- 提交加密薪资
- 查看薪资（需要权限）
- 薪资历史

### 3. 统计分析组件 (`Statistics.tsx`)

功能：
- 部门统计
- 预算合规性
- 数据可视化

## 🎯 开发优先级

### 高优先级（今天完成）

1. **更新合约地址** ⚠️ 必须完成
2. **测试 Dashboard 组件**
3. **测试部门创建功能**

### 中优先级（本周完成）

4. **实现员工管理**
5. **实现薪资提交**
6. **实现统计查看**

### 低优先级（下周完成）

7. **UI/UX 优化**
8. **添加更多功能**
9. **响应式设计**

## 🔧 如果遇到问题

### 问题 1: 依赖安装失败

```powershell
# 从项目根目录安装
cd ..\..
pnpm install
cd packages\confidential-salary-frontend
```

### 问题 2: Tailwind CSS 未生效

```powershell
# 确保安装了 Tailwind
pnpm add -D tailwindcss postcss autoprefixer

# 初始化配置（如果还没有）
npx tailwindcss init -p
```

### 问题 3: FHEVM SDK 未找到

```powershell
# 确保 SDK 已构建
cd ..\..
pnpm sdk:build
cd packages\confidential-salary-frontend
pnpm install
```

## 📝 检查清单

在启动应用前，确保：

- [ ] ✅ 合约地址已更新
- [ ] ✅ 依赖已安装
- [ ] ✅ SDK 已构建
- [ ] ✅ 钱包已连接到 Sepolia
- [ ] ✅ 有足够的 Sepolia ETH

---

**现在更新合约地址，然后启动应用！** 🚀

