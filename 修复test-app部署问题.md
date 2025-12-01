# 🔧 修复 test-app 在 Vercel 上找不到的问题

## 🚨 问题

在 Vercel Dashboard 中设置了 Root Directory 为 `test-app`，但提示：
```
指定的根目录"test-app"不存在。请更新您的项目设置。
```

## ✅ 解决方案

### 方案 1: 使用 vercel.json 配置（推荐，已更新）

**已更新根目录的 `vercel.json`**，现在会构建 `test-app`：

```json
{
  "buildCommand": "cd test-app && npm install && npm run build",
  "installCommand": "cd test-app && npm install",
  "framework": "nextjs"
}
```

**重要：在 Vercel Dashboard 中：**
1. **Settings → General → Root Directory**: **必须留空**（不要填写任何内容）
2. 保存设置
3. 重新部署

### 方案 2: 在 Dashboard 中设置 Root Directory（如果方案 1 不工作）

如果使用 Dashboard 设置 Root Directory，请按以下步骤：

1. **访问 Vercel Dashboard**
   - https://vercel.com
   - 进入你的项目

2. **进入项目设置**
   - **Settings** → **General**

3. **设置 Root Directory**
   - 找到 **Root Directory** 设置
   - **重要**：输入 `test-app`（不要加斜杠，不要加引号）
   - 点击 **Save**

4. **检查 Build & Development Settings**
   - **Build Command**: 留空（让 Vercel 自动检测）
   - **Install Command**: 留空（让 Vercel 自动检测）
   - **Framework Preset**: Next.js（应该自动检测）

5. **重新部署**
   - 进入 **Deployments**
   - 点击 **"..."** → **"Redeploy"**
   - 选择最新提交
   - 点击 **"Redeploy"**

### 方案 3: 创建新项目（最干净的方法）

如果上述方案都不工作，建议创建一个新的 Vercel 项目：

1. **在 GitHub 上创建新仓库**
   - 仓库名：`vercel-test-app`
   - 将 `test-app` 目录的内容推送到新仓库

2. **在 Vercel 中导入新仓库**
   - Vercel Dashboard → **Add New Project**
   - 选择新创建的仓库
   - Vercel 会自动检测 Next.js
   - 直接部署

## 📝 立即操作步骤

### 步骤 1: 提交更新的 vercel.json

```powershell
git add vercel.json
git commit -m "更新 vercel.json 以支持 test-app 部署"
git push
```

### 步骤 2: 在 Vercel Dashboard 中设置

1. **清空 Root Directory**
   - Settings → General → Root Directory: **留空**
   - 保存

2. **检查构建设置**
   - Settings → General → Build & Development Settings
   - 确保 Framework Preset 是 Next.js
   - 保存

### 步骤 3: 重新部署

1. 进入 **Deployments**
2. 点击 **"..."** → **"Redeploy"**
3. 选择最新提交
4. 点击 **"Redeploy"**

## 🔍 调试信息

如果仍然失败，检查：

1. **GitHub 上的文件结构**
   - 访问 https://github.com/673342907/SalaryPrivacy
   - 确认 `test-app` 目录存在
   - 确认 `test-app/package.json` 存在

2. **Vercel 构建日志**
   - 查看构建日志中的错误信息
   - 检查工作目录路径

3. **Root Directory 格式**
   - 确保没有前导斜杠：`test-app` ✅（正确）
   - 不要使用：`/test-app` ❌（错误）
   - 不要使用：`./test-app` ❌（错误）

## 💡 为什么会出现这个问题？

1. **Root Directory 设置冲突**：如果 Root Directory 设置了值，Vercel 会从该目录开始，但根目录的 `vercel.json` 可能还在使用旧的路径
2. **路径格式错误**：Root Directory 的格式必须正确（相对路径，无斜杠）
3. **GitHub 同步问题**：虽然文件在 Git 中，但 Vercel 可能还没有拉取最新代码

## ✅ 验证步骤

部署成功后，你应该看到：
- ✅ 构建成功
- ✅ 部署成功
- ✅ 可以访问应用（显示 "Hello Vercel!"）

