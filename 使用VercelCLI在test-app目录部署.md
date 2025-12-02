# ✅ 使用 Vercel CLI 在 test-app 目录部署

## 🚨 问题

**在根目录执行 `vercel --prod --force` 时出现错误：**
```
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies". Also check your Root Directory setting matches the directory of your package.json file.
```

## 🔍 原因

**Vercel CLI 在根目录查找 Next.js 项目，但 Next.js 项目在 `test-app` 目录下。**

## ✅ 解决方案

**在 `test-app` 目录下执行 Vercel CLI 命令：**

```powershell
# 进入 test-app 目录
cd test-app

# 部署到生产环境
vercel --prod --force
```

## 📋 完整步骤

### 步骤 1: 进入 test-app 目录

```powershell
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\test-app
```

### 步骤 2: 部署到生产环境

```powershell
vercel --prod --force
```

### 步骤 3: 观察部署过程

**CLI 会显示：**
- 正在上传文件
- 正在构建
- 构建进度
- 部署 URL

### 步骤 4: 验证部署

**部署完成后：**
1. **访问部署 URL**
   - CLI 会显示部署 URL
   - 访问 URL，应该看到 "🚀 Vercel 测试应用"

2. **检查构建日志**
   - 在 Vercel Dashboard 中
   - 进入 Deployments
   - 查看最新部署的构建日志
   - 应该显示：
     - 执行了 `npm install`
     - Next.js 构建成功
     - 路由信息正确

## 💡 为什么在 test-app 目录下执行？

**Vercel CLI 会在当前目录查找：**
- `package.json`（包含 Next.js 依赖）
- `next.config.js`
- `app/` 或 `pages/` 目录

**在 `test-app` 目录下执行，Vercel CLI 可以：**
- ✅ 正确检测到 Next.js 项目
- ✅ 使用 `test-app/package.json` 中的依赖
- ✅ 使用 `test-app/vercel.json` 中的配置（如果有）
- ✅ 正确构建项目

## 🔍 如果仍然失败

**如果仍然出现错误，检查：**

1. **确认在 test-app 目录**
   ```powershell
   pwd  # 应该显示 test-app 路径
   ls   # 应该看到 package.json, app/, next.config.js
   ```

2. **检查 package.json**
   ```powershell
   cat package.json  # 应该看到 "next" 在 dependencies 中
   ```

3. **检查 vercel.json（如果有）**
   ```powershell
   cat vercel.json  # 应该看到正确的配置
   ```

---

**现在在 test-app 目录下执行 `vercel --prod --force` 应该可以成功部署了！** 🚀

