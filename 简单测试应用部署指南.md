# 🚀 简单测试应用部署指南

## 📋 目标

创建一个最简单的 Next.js 应用，在 Vercel 上成功部署，验证配置是否正确。

## ✅ 已创建的测试应用

### 目录结构

```
test-app/
├── app/
│   ├── page.tsx          # 主页面（显示成功消息）
│   └── layout.tsx        # 布局组件
├── public/               # 静态文件目录
├── package.json          # 依赖配置（只有 Next.js 和 React）
├── next.config.js        # Next.js 配置
├── tsconfig.json         # TypeScript 配置
├── vercel.json           # Vercel 配置（最简单）
└── README.md             # 说明文档
```

### 特点

- ✅ **极简配置**：只有 Next.js 和 React
- ✅ **无复杂依赖**：不需要构建 SDK 或其他包
- ✅ **标准结构**：使用 Next.js App Router
- ✅ **自动检测**：Vercel 会自动识别 Next.js

## 🚀 部署步骤

### 选项 1: 部署 test-app 目录（推荐）

#### 步骤 1: 创建独立的 Git 仓库

```powershell
# 进入 test-app 目录
cd test-app

# 初始化 Git 仓库
git init
git add .
git commit -m "初始提交: 简单的 Vercel 测试应用"

# 在 GitHub 上创建新仓库，然后推送
# git remote add origin https://github.com/你的用户名/vercel-test-app.git
# git push -u origin main
```

#### 步骤 2: 在 Vercel 中部署

1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 选择新创建的仓库（vercel-test-app）
4. Vercel 会自动检测 Next.js
5. 点击 "Deploy"

### 选项 2: 在当前仓库中部署 test-app 子目录

#### 步骤 1: 提交 test-app 到当前仓库

```powershell
# 在项目根目录
git add test-app/
git commit -m "添加简单的 Vercel 测试应用"
git push
```

#### 步骤 2: 在 Vercel 中设置 Root Directory

1. 访问 Vercel Dashboard
2. 进入项目设置
3. **Settings** → **General**
4. **Root Directory**: 设置为 `test-app`
5. 保存并重新部署

### 选项 3: 使用 Vercel CLI（最快）

```powershell
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 进入 test-app 目录
cd test-app

# 部署
vercel

# 按照提示操作
# 选择项目或创建新项目
# 部署到生产环境: vercel --prod
```

## 📋 验证部署

部署成功后：

1. **访问提供的 URL**
   - Vercel 会提供一个 URL，如：`https://vercel-test-app.vercel.app`

2. **检查页面**
   - 应该看到 "Vercel 测试应用" 标题
   - 显示 "部署成功" 消息
   - 显示当前时间

3. **检查构建日志**
   - 在 Vercel Dashboard 中查看构建日志
   - 确认使用 Next.js
   - 确认构建成功

## ✅ 如果测试应用部署成功

说明：
- ✅ Vercel 配置正确
- ✅ Next.js 可以正常部署
- ✅ 问题在于复杂的 monorepo 配置

然后可以：
1. 逐步添加复杂性
2. 或者修复主项目的配置

## 🔍 如果测试应用也失败

说明可能是：
- Vercel 账户问题
- 网络问题
- 其他基础配置问题

## 📝 测试应用的特点

### 为什么这么简单？

1. **只有 Next.js**
   - 不需要构建 SDK
   - 不需要 monorepo 配置
   - 不需要复杂的依赖

2. **标准结构**
   - 使用 Next.js App Router
   - Vercel 自动识别

3. **最小配置**
   - `vercel.json` 只有 `{"framework": "nextjs"}`
   - 其他都使用默认值

## 🎯 下一步

### 如果测试应用成功：

1. **验证主项目配置**
   - 对比测试应用和主项目的配置差异
   - 逐步修复主项目

2. **或者简化主项目**
   - 暂时移除复杂的构建步骤
   - 先让基本部署成功
   - 再逐步添加功能

### 如果测试应用失败：

1. **检查基础配置**
   - Vercel 账户设置
   - GitHub 连接
   - 网络问题

---

**现在先部署这个简单的测试应用，验证 Vercel 基本功能！** 🚀

