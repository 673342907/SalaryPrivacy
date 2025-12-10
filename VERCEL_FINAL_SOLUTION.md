# Vercel 输出目录问题 - 最终解决方案

## 🚨 问题

Vercel 提示：`No Output Directory named "build" found after the Build completed`

## 🔍 根本原因

使用 `pnpm --filter` 时，构建命令在项目根目录执行，但 `craco build` 会在**当前工作目录**创建 `build` 文件夹。如果工作目录不对，build 目录可能创建在错误的位置。

## ✅ 解决方案

### 方案 1: 使用子 shell（已更新到 vercel.json，推荐）

```json
{
  "buildCommand": "pnpm --filter ./packages/fhevm-sdk build && (cd packages/confidential-salary-frontend && pnpm build)"
}
```

**关键点**：
- 使用 `(cd ... && pnpm build)` 子 shell，确保在正确目录执行构建
- 子 shell 结束后会回到原目录，不影响后续步骤
- 构建输出会在 `packages/confidential-salary-frontend/build`

### 方案 2: 使用构建脚本（备用）

如果方案 1 仍然失败，使用脚本：

**在 Vercel Dashboard 中设置 Build Command**:
```
bash scripts/build-for-vercel.sh
```

脚本会：
1. 构建 SDK
2. 切换到前端目录
3. 执行构建
4. 验证 build 目录存在

### 方案 3: 在 Dashboard 中手动设置（最可靠）

如果 `vercel.json` 不生效，直接在 Dashboard 中设置：

1. **进入项目 Settings → General**
2. **Build & Development Settings** 中设置：

   **Build Command**:
   ```bash
   pnpm --filter ./packages/fhevm-sdk build && (cd packages/confidential-salary-frontend && pnpm build)
   ```

   **Output Directory**:
   ```
   packages/confidential-salary-frontend/build
   ```

   **Install Command**:
   ```
   pnpm install --frozen-lockfile
   ```

   **Root Directory**: 留空

3. **保存并重新部署**

## 📝 立即操作步骤

### 步骤 1: 提交更改

```bash
git add vercel.json
git add scripts/build-for-vercel.sh
git commit -m "修复 Vercel 构建输出目录问题：使用子 shell 确保正确的工作目录"
git push
```

### 步骤 2: 在 Vercel 中重新部署

**方法 A: 自动部署**
- 推送代码后，Vercel 会自动检测并开始新部署

**方法 B: 手动触发**
1. 访问 Vercel Dashboard
2. 进入项目 → Deployments
3. 点击 **...** → **Redeploy**

### 步骤 3: 如果仍然失败

在 Vercel Dashboard 中手动设置构建命令（见方案 3）

## 🔍 调试步骤

### 1. 查看构建日志

在 Vercel Dashboard 中：
1. 进入 **Deployments**
2. 点击失败的部署
3. 查看 **Build Logs**
4. 查找：
   - "Building frontend..." 消息
   - "Build completed" 消息
   - 任何错误信息

### 2. 验证构建输出

在构建日志中查找：
```
Creating an optimized production build...
Compiled successfully.
The build folder is ready to be deployed.
```

如果看到这些消息，说明构建成功了，但 Vercel 可能找不到输出目录。

### 3. 检查输出目录路径

构建成功后，Vercel 会在以下路径查找：
```
packages/confidential-salary-frontend/build
```

确保：
- 路径完全匹配（大小写敏感）
- 没有多余的空格
- 使用正斜杠 `/`（不是反斜杠 `\`）

## 🎯 验证清单

在重新部署前，确认：

- [ ] `vercel.json` 已更新并提交
- [ ] 构建命令使用子 shell：`(cd packages/confidential-salary-frontend && pnpm build)`
- [ ] 输出目录路径：`packages/confidential-salary-frontend/build`
- [ ] Root Directory 在 Dashboard 中为空
- [ ] Node.js 版本设置为 20.x

## 💡 为什么这个方案有效？

1. **子 shell 确保工作目录正确**
   - `(cd ... && pnpm build)` 在子 shell 中执行
   - 构建在正确的目录执行
   - 输出在正确的位置生成

2. **明确的路径**
   - 输出目录路径明确指定
   - 不依赖相对路径解析

3. **错误处理**
   - 如果构建失败，命令会立即退出
   - 不会继续执行后续步骤

## 🆘 如果问题仍然存在

### 检查构建日志中的关键信息

1. **构建是否成功？**
   - 查找 "Compiled successfully" 或 "Build folder is ready"
   - 如果看到这些，构建成功了

2. **输出目录在哪里？**
   - 在构建日志中查找 "The build folder is ready"
   - 检查实际创建的目录路径

3. **路径是否匹配？**
   - 确保 `outputDirectory` 与实际路径完全匹配
   - 检查大小写、斜杠方向

### 尝试绝对路径（最后手段）

如果相对路径不工作，可以尝试：

在构建命令中添加验证：
```bash
pnpm --filter ./packages/fhevm-sdk build && \
(cd packages/confidential-salary-frontend && pnpm build) && \
echo "Verifying build output..." && \
ls -la packages/confidential-salary-frontend/build && \
echo "Build directory exists at: $(pwd)/packages/confidential-salary-frontend/build"
```

## ✅ 预期结果

成功的构建应该显示：

```
🔨 Building SDK...
✅ SDK build completed
🔨 Building frontend...
Creating an optimized production build...
Compiled successfully.
The build folder is ready to be deployed.
✅ Build completed
✅ Output directory found
✅ Deployment ready
```

## 📞 需要帮助？

如果问题持续存在，请提供：
1. 完整的构建日志（从开始到结束）
2. 构建命令的完整输出
3. 任何错误消息


