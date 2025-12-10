# Vercel 部署操作步骤

## 📋 完整操作流程

### 第一步：提交代码更改

1. **打开终端/命令行**（在项目根目录）

2. **检查文件状态**
   ```bash
   git status
   ```

3. **添加更改的文件**
   ```bash
   git add vercel.json
   git add VERCEL_DEPLOYMENT.md
   git add VERCEL_FIX_OUTPUT_DIRECTORY.md
   git add VERCEL_TROUBLESHOOTING.md
   ```

4. **提交更改**
   ```bash
   git commit -m "修复 Vercel 部署配置：更新构建命令和输出目录"
   ```

5. **推送到 GitHub**
   ```bash
   git push
   ```

### 第二步：在 Vercel Dashboard 中配置

#### 选项 A：使用 vercel.json（自动配置，推荐）

如果 `vercel.json` 已提交，Vercel 会自动读取配置。只需：

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com/dashboard
   - 登录您的账户

2. **进入项目**
   - 找到您的项目（SalaryPrivacy）
   - 点击进入项目详情

3. **检查设置**
   - 点击 **Settings** → **General**
   - 确认 **Root Directory** 为空白（使用根目录）
   - 如果显示其他路径，请清空

4. **触发重新部署**
   - 方法 1：等待自动部署（推送代码后会自动触发）
   - 方法 2：手动触发
     - 进入 **Deployments** 标签
     - 点击右上角 **...** → **Redeploy**
     - 选择最新的提交
     - 点击 **Redeploy**

#### 选项 B：手动配置（如果自动配置不生效）

1. **进入项目设置**
   - 在 Vercel Dashboard 中打开项目
   - 点击 **Settings** → **General**

2. **配置构建设置**
   找到 **Build & Development Settings** 部分，设置：

   - **Framework Preset**: 选择 `Other`
   
   - **Root Directory**: 留空（不要填写任何内容）
   
   - **Build Command**: 
     ```
     pnpm sdk:build && cd packages/confidential-salary-frontend && pnpm build
     ```
   
   - **Output Directory**: 
     ```
     packages/confidential-salary-frontend/build
     ```
   
   - **Install Command**: 
     ```
     pnpm install
     ```
   
   - **Node.js Version**: 选择 `20.x`（重要！）

3. **保存设置**
   - 滚动到页面底部
   - 点击 **Save** 按钮

4. **重新部署**
   - 进入 **Deployments** 标签
   - 点击最新的部署右侧的 **...** → **Redeploy**
   - 或等待下一次 Git 推送自动触发

### 第三步：等待构建完成

1. **查看构建进度**
   - 在 **Deployments** 标签中
   - 点击正在构建的部署
   - 查看 **Build Logs** 标签

2. **构建过程**
   - 安装依赖（约 2-5 分钟）
   - 构建 SDK（约 1-2 分钟）
   - 构建前端应用（约 3-5 分钟）
   - 总时间：约 5-10 分钟

3. **成功标志**
   - ✅ 看到 "Build completed"
   - ✅ 看到 "Output directory found"
   - ✅ 部署状态变为 "Ready"

### 第四步：验证部署

1. **访问网站**
   - 构建成功后，Vercel 会提供一个 URL
   - 格式：`https://your-project-name.vercel.app`
   - 点击 URL 访问网站

2. **检查功能**
   - 确认页面可以正常加载
   - 测试主要功能是否正常

## 🔧 如果构建失败

### 查看错误信息

1. **进入部署详情**
   - 在 **Deployments** 中点击失败的部署
   - 查看 **Build Logs**

2. **常见错误及解决**

   **错误 1: "Cannot find module '@fhevm-sdk'"**
   - **原因**: SDK 未构建
   - **解决**: 确保构建命令包含 `pnpm sdk:build`

   **错误 2: "Build exceeded maximum build time"**
   - **原因**: 构建时间超过 45 分钟
   - **解决**: 
     - 检查是否有无限循环
     - 优化构建过程
     - 考虑升级到 Pro 计划

   **错误 3: "Command failed with exit code 1"**
   - **原因**: 构建过程中出现错误
   - **解决**: 查看详细错误信息，通常是：
     - TypeScript 编译错误
     - 依赖安装失败
     - 代码语法错误

### 本地测试构建

在推送代码前，可以在本地测试构建：

```bash
# 1. 确保在项目根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 2. 安装依赖
pnpm install

# 3. 构建 SDK
pnpm sdk:build

# 4. 构建前端
cd packages/confidential-salary-frontend
pnpm build

# 5. 检查输出
# Windows PowerShell:
Test-Path build
dir build
```

如果本地构建成功，Vercel 构建也应该成功。

## 📝 快速检查清单

在重新部署前，确认：

- [ ] `vercel.json` 文件已提交到 Git
- [ ] 已推送到 GitHub
- [ ] Vercel 项目设置中 Root Directory 为空
- [ ] Node.js 版本设置为 20.x
- [ ] 构建命令正确配置

## 🆘 需要帮助？

如果问题仍然存在：

1. **查看完整构建日志**
   - 复制完整的错误信息

2. **检查本地构建**
   - 确保本地可以成功构建

3. **查看文档**
   - `VERCEL_FIX_OUTPUT_DIRECTORY.md` - 详细的故障排除
   - `VERCEL_TROUBLESHOOTING.md` - 常见问题解答

4. **联系支持**
   - 提供构建日志
   - 说明已尝试的解决方案


