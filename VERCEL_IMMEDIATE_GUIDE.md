# Vercel 构建错误 - 立即操作指南

## 🚨 当前问题

构建命令在 Vercel 上失败，但本地测试正常。

## ✅ 已修复的配置

已更新 `vercel.json`，使用更可靠的构建命令：

```json
{
  "buildCommand": "pnpm --filter ./packages/fhevm-sdk build && pnpm --filter confidential-salary-frontend build"
}
```

## 📝 立即执行步骤

### 步骤 1: 提交更改

```bash
# 在项目根目录执行
git add vercel.json
git add scripts/
git add VERCEL_*.md
git commit -m "修复 Vercel 构建命令：使用 pnpm filter 代替 cd"
git push
```

### 步骤 2: 在 Vercel Dashboard 中操作

#### 选项 A: 等待自动部署（推荐）

1. 推送代码后，Vercel 会自动检测并开始新部署
2. 在 **Deployments** 标签中查看构建进度

#### 选项 B: 手动重新部署

1. 访问 https://vercel.com/dashboard
2. 进入项目 **SalaryPrivacy**
3. 点击 **Deployments** 标签
4. 找到最新的部署，点击 **...** → **Redeploy**
5. 选择最新的提交，点击 **Redeploy**

### 步骤 3: 如果仍然失败

#### 方案 1: 在 Dashboard 中手动设置构建命令

1. 进入 **Settings** → **General**
2. 找到 **Build & Development Settings**
3. 设置 **Build Command** 为：
   ```
   pnpm --filter ./packages/fhevm-sdk build && pnpm --filter confidential-salary-frontend build
   ```
4. 点击 **Save**
5. 重新部署

#### 方案 2: 使用构建脚本（最可靠）

如果直接命令仍然失败，使用脚本文件：

1. **在 Vercel Dashboard 中设置 Build Command**:
   ```
   bash scripts/build-for-vercel.sh
   ```

2. **确保脚本有执行权限**（已创建，应该没问题）

#### 方案 3: 添加调试信息

如果还是失败，使用带调试信息的命令：

**Build Command**:
```bash
echo "🔨 Starting build..." && \
echo "Current directory: $(pwd)" && \
echo "Node version: $(node -v)" && \
echo "PNPM version: $(pnpm -v)" && \
pnpm --filter ./packages/fhevm-sdk build && \
echo "✅ SDK build completed" && \
pnpm --filter confidential-salary-frontend build && \
echo "✅ Frontend build completed"
```

## 🔍 查看构建日志

如果构建失败：

1. 在 **Deployments** 中点击失败的部署
2. 查看 **Build Logs**
3. 查找：
   - 红色错误信息
   - "exited with 1" 之前的最后几行
   - 具体的错误消息

## 📋 常见错误及解决

### 错误: "Cannot find module '@fhevm-sdk'"

**原因**: SDK 未构建或构建失败

**解决**: 
- 确保构建命令先执行 `pnpm --filter ./packages/fhevm-sdk build`
- 检查 SDK 构建是否成功

### 错误: "Command failed"

**原因**: 某个构建步骤失败

**解决**:
- 查看构建日志，找到具体失败的步骤
- 检查是否有 TypeScript 错误
- 检查是否有依赖问题

### 错误: "Build exceeded maximum build time"

**原因**: 构建时间超过 45 分钟

**解决**:
- 优化构建过程
- 使用构建缓存
- 考虑升级到 Pro 计划

## ✅ 验证清单

在重新部署前，确认：

- [ ] `vercel.json` 已更新并提交
- [ ] 已推送到 GitHub
- [ ] 本地测试构建成功
- [ ] Vercel 项目设置中 Root Directory 为空
- [ ] Node.js 版本设置为 20.x

## 🎯 预期结果

成功的构建应该显示：

```
🔨 Building SDK...
✅ SDK build completed
🔨 Building frontend...
✅ Frontend build completed
✅ Build completed successfully!
```

然后 Vercel 会找到输出目录并完成部署。

## 🆘 如果问题仍然存在

1. **复制完整的构建日志**
   - 从 "Running build command" 开始
   - 到 "exited with 1" 结束
   - 包括所有错误信息

2. **检查特定错误**
   - 是 SDK 构建失败？
   - 是前端构建失败？
   - 是依赖安装失败？

3. **尝试分步构建**
   - 先只构建 SDK
   - 再只构建前端
   - 确定哪个步骤失败

## 📞 需要帮助？

如果问题持续存在，请提供：
- 完整的构建日志
- 具体的错误信息
- 已尝试的解决方案


