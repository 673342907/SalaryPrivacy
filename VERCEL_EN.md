# Vercel 输出目录问题 - 关键修复

## 🚨 问题

构建完成后，Vercel 提示：`No Output Directory named "build" found after the Build completed`

这说明构建可能成功了，但 Vercel 找不到输出目录。

## 🔍 根本原因

可能的原因：
1. **构建命令执行了，但 build 目录没有在预期位置创建**
2. **工作目录问题** - 构建在错误的位置执行
3. **路径解析问题** - Vercel 无法找到相对路径

## ✅ 最终解决方案

### 方案 1: 使用构建脚本（最可靠，推荐）

在 Vercel Dashboard 中设置：

**Build Command**:
```
bash scripts/build-for-vercel.sh
```

这个脚本会：
1. 构建 SDK
2. 切换到前端目录
3. 执行构建
4. **验证 build 目录存在**
5. 返回根目录并再次验证路径

### 方案 2: 在 Dashboard 中手动设置（如果脚本不工作）

1. **进入项目 Settings → General**
2. **Build & Development Settings** 中设置：

   **Build Command**:
   ```bash
   pnpm --filter ./packages/fhevm-sdk build && cd packages/confidential-salary-frontend && pnpm build && cd ../.. && ls -la packages/confidential-salary-frontend/build
   ```

   **Output Directory**:
   ```
   packages/confidential-salary-frontend/build
   ```

   **Install Command**:
   ```
   pnpm install --frozen-lockfile
   ```

   **Root Directory**: **留空**（非常重要！）

3. **保存并重新部署**

### 方案 3: 检查 Root Directory 设置

**这是最常见的问题！**

1. 进入项目 **Settings → General**
2. 找到 **Root Directory** 设置
3. **确保它是空的**（不要填写任何内容）
4. 如果填写了内容，清空它
5. 保存并重新部署

## 📝 立即操作步骤

### 步骤 1: 检查 Root Directory

**这是最关键的一步！**

1. 访问 Vercel Dashboard
2. 进入项目 → **Settings** → **General**
3. 找到 **Root Directory** 设置
4. **确保它是空的**（如果填写了内容，清空它）
5. 点击 **Save**

### 步骤 2: 使用构建脚本

在 **Build & Development Settings** 中：

**Build Command**:
```
bash scripts/build-for-vercel.sh
```

**Output Directory**:
```
packages/confidential-salary-frontend/build
```

**Install Command**:
```
pnpm install --frozen-lockfile
```

### 步骤 3: 重新部署

1. 进入 **Deployments**
2. 点击 **...** → **Redeploy**
3. 选择最新的提交
4. 点击 **Redeploy**

## 🔍 调试步骤

### 1. 查看构建日志

在构建日志中查找：

```
✅ Build directory found in: /vercel/path0/packages/confidential-salary-frontend/build
✅ Build directory found at: packages/confidential-salary-frontend/build
```

如果看到这些消息，说明构建成功了。

### 2. 检查路径

在构建日志中查找：
- "Current directory: ..."
- "Changed to: ..."
- "Back to root: ..."

确保路径是正确的。

### 3. 查找 build 目录

如果构建失败，脚本会搜索所有 build 目录：
```
Searching for build directories...
./packages/confidential-salary-frontend/build
```

## ⚠️ 常见错误

### 错误 1: Root Directory 设置了错误的值

**症状**: 构建成功，但找不到输出目录

**解决**: 清空 Root Directory 设置

### 错误 2: 路径大小写不匹配

**症状**: 路径看起来正确，但找不到

**解决**: 确保路径完全匹配（Linux 大小写敏感）

### 错误 3: 构建在错误的目录执行

**症状**: build 目录创建了，但不在预期位置

**解决**: 使用脚本确保在正确目录执行

## 🎯 验证清单

在重新部署前，确认：

- [ ] **Root Directory 为空**（最重要！）
- [ ] 使用构建脚本：`bash scripts/build-for-vercel.sh`
- [ ] Output Directory: `packages/confidential-salary-frontend/build`
- [ ] Node.js 版本设置为 20.x
- [ ] 构建脚本已提交到 Git

## 💡 为什么 Root Directory 很重要？

如果 Root Directory 设置了值（比如 `packages/confidential-salary-frontend`），Vercel 会：
1. 将工作目录切换到该路径
2. 在那里执行构建命令
3. 在那里查找输出目录

但我们的构建命令假设在项目根目录执行，所以会失败。

**解决方案**: 保持 Root Directory 为空，让 Vercel 在项目根目录执行所有命令。

## 🆘 如果问题仍然存在

1. **查看完整的构建日志**
   - 复制从开始到结束的所有日志
   - 特别关注路径相关的消息

2. **检查构建脚本输出**
   - 查找 "Current directory" 消息
   - 查找 "Build directory found" 消息

3. **尝试绝对路径**
   - 如果相对路径不工作，可能需要使用不同的方法

## ✅ 预期结果

成功的构建应该显示：

```
✅ SDK build completed
✅ Frontend build completed
✅ Build directory found in: /vercel/path0/packages/confidential-salary-frontend/build
✅ Build directory found at: packages/confidential-salary-frontend/build
✅ All builds completed successfully!
✅ Output directory found
✅ Deployment ready
```


