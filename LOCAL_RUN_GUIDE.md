# 🚀 本地运行项目指南

## 📋 快速开始

### 方法 1: 从项目根目录运行（推荐，使用 pnpm workspace）

```powershell
# 1. 确保在项目根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 2. 安装所有依赖（如果还没有）
pnpm install

# 3. 构建 SDK（如果需要）
pnpm sdk:build

# 4. 启动 Next.js 开发服务器
cd packages/nextjs
pnpm dev
```

### 方法 2: 直接在 packages/nextjs 目录运行

```powershell
# 1. 进入 Next.js 项目目录
cd packages\nextjs

# 2. 安装依赖（如果还没有）
pnpm install

# 3. 启动开发服务器
pnpm dev
```

## 🌐 访问应用

启动成功后，访问：
- **本地地址**: http://localhost:3000
- **首页**: http://localhost:3000/
- **ConfidentialSalary 页面**: http://localhost:3000/confidential-salary

## 🔍 如果遇到问题

### 问题 1: 端口被占用

如果 3000 端口被占用，Next.js 会自动使用下一个可用端口（如 3001）。

### 问题 2: 依赖缺失

```powershell
# 在项目根目录
pnpm install

# 或者在 packages/nextjs 目录
cd packages\nextjs
pnpm install
```

### 问题 3: SDK 未构建

```powershell
# 在项目根目录
pnpm sdk:build
```

### 问题 4: TypeScript 错误

如果遇到 TypeScript 错误，可以暂时忽略：

```powershell
# 在 packages/nextjs 目录
$env:NEXT_PUBLIC_IGNORE_BUILD_ERROR="true"
pnpm dev
```

## 📝 开发命令

### 在 packages/nextjs 目录下：

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器
- `pnpm lint` - 运行代码检查

### 在项目根目录下：

- `pnpm install` - 安装所有依赖
- `pnpm sdk:build` - 构建 SDK
- `cd packages/nextjs && pnpm dev` - 启动开发服务器

---

**现在开始运行项目！** 🚀




