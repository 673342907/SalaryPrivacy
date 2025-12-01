# 🚀 快速部署测试应用

## ✅ 已创建

一个极简的 Next.js 测试应用，位于 `test-app/` 目录。

## 📋 应用特点

- ✅ **极简配置**：只有 Next.js 15 + React 19
- ✅ **无复杂依赖**：不需要构建 SDK、monorepo 等
- ✅ **标准结构**：使用 Next.js App Router
- ✅ **自动识别**：Vercel 会自动检测 Next.js

## 🚀 部署方法

### 方法 1: 在当前仓库中部署（最简单）

#### 步骤 1: 提交到 Git

```powershell
# 在项目根目录
git add test-app/
git commit -m "添加简单的 Vercel 测试应用"
git push
```

#### 步骤 2: 在 Vercel Dashboard 中设置

1. 访问 https://vercel.com
2. 进入你的项目（SalaryPrivacy）
3. **Settings** → **General**
4. **Root Directory**: 设置为 `test-app`
5. 点击 **Save**

#### 步骤 3: 重新部署

- **Deployments** → **"..."** → **"Redeploy"**
- 选择最新提交
- 点击 **"Redeploy"**

### 方法 2: 创建新仓库单独部署（推荐，更干净）

#### 步骤 1: 在 GitHub 上创建新仓库

1. 访问 https://github.com/new
2. 仓库名：`vercel-test-app`
3. 选择 Public 或 Private
4. **不要**初始化 README、.gitignore 等
5. 点击 "Create repository"

#### 步骤 2: 推送 test-app 到新仓库

```powershell
# 进入 test-app 目录
cd test-app

# 初始化 Git
git init
git add .
git commit -m "初始提交: 简单的 Vercel 测试应用"

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/vercel-test-app.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 步骤 3: 在 Vercel 中部署

1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 选择新创建的仓库（vercel-test-app）
4. Vercel 会自动检测 Next.js
5. 点击 "Deploy"

### 方法 3: 使用 Vercel CLI（最快）

```powershell
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 进入 test-app 目录
cd test-app

# 部署
vercel

# 按照提示操作：
# - 登录 Vercel
# - 选择项目或创建新项目
# - 确认设置
# - 部署

# 部署到生产环境
vercel --prod
```

## ✅ 验证部署

部署成功后：

1. **访问提供的 URL**
   - Vercel 会提供一个 URL
   - 格式：`https://vercel-test-app.vercel.app`

2. **检查页面**
   - 应该看到 "🚀 Vercel 测试应用" 标题
   - 显示 "部署成功" 消息
   - 显示当前时间

3. **检查构建日志**
   - 在 Vercel Dashboard 中查看
   - 确认使用 Next.js
   - 确认构建成功

## 🎯 如果测试应用部署成功

说明：
- ✅ Vercel 配置正确
- ✅ Next.js 可以正常部署
- ✅ 问题在于复杂的 monorepo 配置

**下一步**：
1. 对比测试应用和主项目的配置
2. 逐步修复主项目的配置
3. 或者简化主项目的构建流程

## 🔍 如果测试应用也失败

可能的原因：
- Vercel 账户问题
- GitHub 连接问题
- 网络问题
- 其他基础配置问题

## 📝 测试应用文件列表

```
test-app/
├── app/
│   ├── page.tsx          # 主页面
│   └── layout.tsx        # 布局
├── package.json          # 只有 Next.js 和 React
├── next.config.js        # 简单配置
├── tsconfig.json         # TypeScript 配置
├── vercel.json           # 最简单的配置
└── README.md             # 说明文档
```

## 💡 推荐方案

**推荐使用方法 2（创建新仓库）**，因为：
- ✅ 更干净，不影响主项目
- ✅ 可以独立测试
- ✅ 成功后可以删除或保留作为参考

---

**现在选择一种方法部署测试应用，验证 Vercel 基本功能！** 🚀

