# 🚀 立即使用 CLI 部署 - 解决根目录不存在问题

## ✅ 已确认

- ✅ 本地 `packages/nextjs` 目录存在
- ✅ Git 中已包含 `packages/nextjs` 的文件
- ✅ 代码已同步到 GitHub

## 🚨 问题

Vercel Dashboard 提示"指定的根目录'packages/nextjs'不存在"，可能是因为：
1. Vercel 使用了旧的提交
2. Vercel 配置缓存问题
3. Root Directory 设置时机问题

## 🚀 解决方案：使用 CLI 直接部署（推荐）

**直接使用 CLI 部署，绕过所有配置问题：**

```powershell
# 1. 进入 packages/nextjs 目录
cd packages\nextjs

# 2. 部署到生产环境
vercel --prod --force
```

**优势：**
- ✅ 不依赖 Root Directory 设置
- ✅ 不依赖 Git 连接
- ✅ 直接使用当前代码
- ✅ 立即看到效果

## 📝 操作步骤

### 步骤 1: 进入项目目录

```powershell
cd packages\nextjs
```

### 步骤 2: 检查 Vercel 链接状态

```powershell
# 如果之前链接过，可能需要重新链接
vercel link
```

**如果提示选择项目：**
- 选择现有的项目：`salary-privacy`
- Root Directory: 输入 `.`（当前目录）

### 步骤 3: 部署到生产环境

```powershell
vercel --prod --force
```

**`--force` 参数会：**
- 跳过确认提示
- 强制重新部署
- 清除缓存

### 步骤 4: 等待部署完成

部署完成后，Vercel 会显示：
- ✅ 部署 URL
- ✅ 构建日志
- ✅ 路由信息

## 🔍 如果 CLI 部署也失败

### 检查 1: 确认 Vercel CLI 已安装

```powershell
vercel --version
```

**如果没有安装：**
```powershell
npm install -g vercel
```

### 检查 2: 确认已登录

```powershell
vercel whoami
```

**如果没有登录：**
```powershell
vercel login
```

### 检查 3: 重新链接项目

```powershell
# 删除旧的链接
Remove-Item -Recurse -Force .vercel -ErrorAction SilentlyContinue

# 重新链接
vercel link
# 选择项目：salary-privacy
# Root Directory: .（当前目录）

# 部署
vercel --prod --force
```

## 📋 完整命令序列

```powershell
# 进入项目目录
cd packages\nextjs

# 检查 Vercel CLI
vercel --version

# 登录（如果需要）
vercel login

# 链接项目（如果需要）
vercel link
# 选择：salary-privacy
# Root Directory: .

# 部署
vercel --prod --force
```

## 🎯 预期结果

部署成功后，你应该看到：
- ✅ 构建日志显示 `next build` 执行
- ✅ 构建时间需要几秒钟（不是 89 毫秒）
- ✅ 显示了路由信息
- ✅ 部署 URL 可以正常访问

---

**现在就执行：`cd packages\nextjs && vercel --prod --force`** 🚀

