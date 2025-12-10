# Vercel 路径问题修复

## 🚨 问题分析

根据构建日志：

```
No projects matched the filters in "/vercel/path0"
cd: packages/confidential-salary-frontend: No such file or directory
```

**问题原因**：
1. pnpm filter 找不到项目（可能是工作区配置问题）
2. packages 目录不存在（可能是 Root Directory 设置错误）

## ✅ 解决方案

### 方案 1: 检查 Root Directory（最重要！）

**这是最可能的原因！**

1. 进入 Vercel Dashboard
2. 项目 → **Settings** → **General**
3. 找到 **Root Directory** 设置
4. **必须完全清空**（不要填写任何内容）
5. 点击 **Save**

### 方案 2: 使用直接路径构建（已更新）

已更新 `vercel.json`，使用直接路径而不是 filter：

```json
{
  "buildCommand": "cd packages/fhevm-sdk && pnpm build && cd ../.. && cd packages/confidential-salary-frontend && pnpm build"
}
```

### 方案 3: 在 Dashboard 中手动设置

如果 `vercel.json` 不生效，在 Dashboard 中设置：

**Build Command**:
```bash
cd packages/fhevm-sdk && pnpm build && cd ../.. && cd packages/confidential-salary-frontend && pnpm build
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

## 📝 立即操作步骤

### 步骤 1: 检查 Root Directory

1. 访问 Vercel Dashboard
2. 进入项目 → **Settings** → **General**
3. 找到 **Root Directory**
4. **清空它**（如果填写了任何内容）
5. 保存

### 步骤 2: 提交更新的配置

```bash
git add vercel.json
git commit -m "修复 Vercel 构建：使用直接路径代替 pnpm filter"
git push
```

### 步骤 3: 重新部署

在 Vercel Dashboard 中：
1. 进入 **Deployments**
2. 点击 **...** → **Redeploy**
3. 选择最新提交
4. 点击 **Redeploy**

## 🔍 调试信息

新的构建命令会输出调试信息：

```
=== Debug: Current directory ===
/vercel/path0
=== Debug: Listing root ===
[文件列表]
=== Debug: Checking packages ===
[packages 目录内容]
=== Building SDK ===
[SDK 构建输出]
=== Building frontend ===
[前端构建输出]
=== Verifying output ===
[build 目录内容]
```

这些信息可以帮助我们确定：
1. 工作目录是否正确
2. packages 目录是否存在
3. 构建是否成功

## ⚠️ 常见问题

### 问题 1: Root Directory 设置了值

**症状**: `No such file or directory`

**解决**: 清空 Root Directory

### 问题 2: pnpm filter 不工作

**症状**: `No projects matched the filters`

**解决**: 使用直接路径 `cd packages/fhevm-sdk && pnpm build`

### 问题 3: 工作区配置问题

**症状**: pnpm 找不到工作区包

**解决**: 确保 `pnpm-workspace.yaml` 已提交到 Git

## 🎯 验证清单

- [ ] **Root Directory 为空**（最重要！）
- [ ] 使用直接路径构建命令
- [ ] `pnpm-workspace.yaml` 已提交
- [ ] `vercel.json` 已更新并提交
- [ ] Node.js 版本设置为 20.x

## 💡 为什么 Root Directory 会导致这个问题？

如果 Root Directory 设置了值（比如 `packages/confidential-salary-frontend`），Vercel 会：
1. 将工作目录切换到该路径
2. 在那里执行构建命令
3. 但我们的命令假设在项目根目录执行
4. 所以找不到 `packages` 目录

**解决方案**: 保持 Root Directory 为空，让 Vercel 在项目根目录执行所有命令。

