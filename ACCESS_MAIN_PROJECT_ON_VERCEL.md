# 🚀 在 Vercel 上访问主项目 - 完整指南

## 📋 当前情况

- ✅ 之前成功部署了 `test-app`（测试应用）
- 🎯 现在需要部署主项目 `packages/nextjs`（ConfidentialSalary 应用）

## 🎯 部署方案

### 方案 1: 使用 Vercel CLI 部署主项目（推荐）

**这是最可靠的方法，直接使用当前代码。**

#### 步骤 1: 进入主项目目录

```powershell
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\packages\nextjs
```

#### 步骤 2: 部署到 Vercel

```powershell
# 如果还没有安装 Vercel CLI
npm install -g vercel

# 如果还没有登录
vercel login

# 部署到生产环境
vercel --prod --force
```

#### 步骤 3: 获取部署 URL

**CLI 会显示部署 URL，例如：**
```
✅ Production: https://your-project.vercel.app
```

### 方案 2: 在 Vercel Dashboard 中配置

#### 步骤 1: 创建新项目或修改现有项目

1. **访问 Vercel Dashboard**
   - https://vercel.com
   - 进入你的账户

2. **创建新项目**（推荐）
   - 点击 "Add New..." → "Project"
   - 选择 GitHub 仓库：`673342907/SalaryPrivacy`
   - 项目名称：`confidential-salary`（或你喜欢的名称）

3. **配置项目设置**
   - **Root Directory**: 设置为 `packages/nextjs`
   - **Framework Preset**: Next.js
   - **Build Command**: 留空（自动检测）
   - **Install Command**: 留空（自动检测）
   - **Output Directory**: 留空（Next.js 自动处理）

4. **环境变量**（如果需要）
   - 添加必要的环境变量

5. **点击 Deploy**

#### 步骤 2: 等待部署完成

- 查看构建日志
- 确认构建成功
- 获取部署 URL

### 方案 3: 修改现有项目配置

**如果你想在现有的 `salary-privacy` 项目中部署主项目：**

1. **访问 Vercel Dashboard**
   - 进入 `salary-privacy` 项目

2. **Settings → General**
   - **Root Directory**: 修改为 `packages/nextjs`（之前是 `test-app`）
   - 点击 **Save**

3. **清除缓存并重新部署**
   - Deployments → 最新部署 → "..." → "Redeploy"
   - 取消勾选 "Use existing Build Cache"
   - 点击 "Redeploy"

## ✅ 验证部署

部署成功后：

1. **访问部署 URL**
   - 应该看到 ConfidentialSalary 首页
   - 显示项目介绍和功能导航

2. **测试功能**
   - 连接钱包
   - 浏览各个功能模块
   - 确认所有组件正常显示

3. **检查构建日志**
   - 确认 Next.js 构建成功
   - 确认没有错误

## 🔍 如果遇到问题

### 问题 1: 构建失败

**可能原因：**
- 依赖安装失败
- TypeScript 错误
- 构建配置问题

**解决方案：**
- 检查构建日志中的错误信息
- 确保所有依赖都在 `dependencies` 中（不是 `devDependencies`）
- 检查 `package.json` 中的构建脚本

### 问题 2: 404 错误

**可能原因：**
- Root Directory 设置错误
- 路由配置问题

**解决方案：**
- 确认 Root Directory 设置为 `packages/nextjs`
- 检查 `app/page.tsx` 是否存在
- 清除缓存并重新部署

### 问题 3: 找不到 Next.js

**可能原因：**
- Root Directory 设置错误
- package.json 不在正确位置

**解决方案：**
- 确认 Root Directory 设置为 `packages/nextjs`
- 确认 `packages/nextjs/package.json` 存在
- 确认 `packages/nextjs/package.json` 包含 `next` 依赖

## 📝 推荐方案

**推荐使用方案 1（Vercel CLI）：**
- ✅ 最可靠
- ✅ 直接使用当前代码
- ✅ 不依赖 Git 连接
- ✅ 可以立即看到效果

## 🎯 快速命令

```powershell
# 进入主项目目录
cd packages\nextjs

# 部署到生产环境
vercel --prod --force
```

---

**部署完成后，访问 CLI 显示的 URL 即可看到 ConfidentialSalary 应用！** 🚀




