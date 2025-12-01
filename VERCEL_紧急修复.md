# Vercel 紧急修复 - packages 目录找不到

## 🚨 当前问题

构建日志显示：
```
No projects matched the filters in "/vercel/path0"
cd: packages/confidential-salary-frontend: No such file or directory
```

这说明 **packages 目录在 Vercel 构建环境中不存在**。

## 🔍 可能的原因

### 原因 1: Root Directory 设置了值（最可能！）

如果 Root Directory 设置了值（比如 `packages/confidential-salary-frontend`），Vercel 会：
1. 将工作目录切换到该路径
2. 在那里执行构建命令
3. 但我们的命令假设在项目根目录执行
4. 所以找不到 `packages` 目录

### 原因 2: 项目结构不同

Vercel 可能以不同的方式克隆项目。

## ✅ 立即解决方案

### 步骤 1: 检查 Root Directory（必须！）

1. **访问 Vercel Dashboard**
2. **进入项目** → **Settings** → **General**
3. **找到 Root Directory 设置**
4. **必须完全清空**（不要填写任何内容）
5. **点击 Save**

**这是最关键的一步！如果 Root Directory 有值，其他所有修复都不会工作！**

### 步骤 2: 在 Dashboard 中手动设置构建命令

由于 `vercel.json` 可能不生效，直接在 Dashboard 中设置：

1. **进入 Settings** → **General** → **Build & Development Settings**

2. **设置以下值**：

   **Root Directory**: **留空**（非常重要！）

   **Build Command**:
   ```bash
   echo "Current dir: $(pwd)" && ls -la && if [ -d packages ]; then echo "packages found" && cd packages/fhevm-sdk && pnpm build && cd ../confidential-salary-frontend && pnpm build; else echo "ERROR: packages not found!" && exit 1; fi
   ```

   **Output Directory**:
   ```
   packages/confidential-salary-frontend/build
   ```

   **Install Command**:
   ```
   pnpm install --frozen-lockfile
   ```

   **Node.js Version**: `20.x`

3. **点击 Save**

4. **重新部署**

### 步骤 3: 如果仍然失败，检查项目结构

如果 Root Directory 已经为空，但 packages 仍然找不到，可能是项目结构问题。

在构建命令中添加更多调试：

**Build Command**:
```bash
echo "=== DEBUG START ===" && \
echo "PWD: $(pwd)" && \
echo "=== ROOT FILES ===" && \
ls -la && \
echo "=== CHECKING FOR PACKAGES ===" && \
if [ -d packages ]; then \
  echo "packages directory EXISTS" && \
  ls -la packages/ && \
  echo "=== BUILDING SDK ===" && \
  cd packages/fhevm-sdk && \
  pnpm build && \
  echo "=== BUILDING FRONTEND ===" && \
  cd ../confidential-salary-frontend && \
  pnpm build && \
  echo "=== VERIFYING OUTPUT ===" && \
  cd ../.. && \
  ls -la packages/confidential-salary-frontend/build; \
else \
  echo "ERROR: packages directory NOT FOUND!" && \
  echo "Current directory structure:" && \
  find . -maxdepth 2 -type d | head -20 && \
  exit 1; \
fi
```

## 📋 检查清单

在重新部署前，确认：

- [ ] **Root Directory 为空**（最重要！必须检查！）
- [ ] 在 Dashboard 中手动设置了构建命令
- [ ] Build Command 包含调试信息
- [ ] Output Directory 正确设置
- [ ] Node.js 版本为 20.x

## 🔍 如何确认 Root Directory 是否为空

1. 进入 Vercel Dashboard
2. 项目 → Settings → General
3. 找到 "Root Directory" 字段
4. **如果显示任何路径（比如 `packages/confidential-salary-frontend`），请清空它**
5. 保存

## 💡 为什么 Root Directory 会导致这个问题？

如果 Root Directory 设置了值：
- Vercel 会在该目录中执行所有命令
- 但我们的构建命令假设在项目根目录执行
- 所以 `cd packages/...` 会失败，因为已经在子目录中了

**解决方案**: 保持 Root Directory 为空，让 Vercel 在项目根目录执行所有命令。

## 🆘 如果问题仍然存在

如果 Root Directory 已经为空，但 packages 仍然找不到：

1. **查看构建日志中的调试输出**
   - 查找 "Current dir: ..."
   - 查找 "packages directory EXISTS" 或 "packages directory NOT FOUND"
   - 查找文件列表

2. **检查 Git 仓库结构**
   - 确保 `packages` 目录已提交到 Git
   - 确保 `.gitignore` 没有忽略 `packages`

3. **尝试不同的方法**
   - 可能需要使用不同的构建策略
   - 或者调整项目结构

## ✅ 预期结果

成功的构建应该显示：

```
Current dir: /vercel/path0
packages directory EXISTS
=== BUILDING SDK ===
[SDK 构建输出]
=== BUILDING FRONTEND ===
[前端构建输出]
=== VERIFYING OUTPUT ===
[build 目录内容]
SUCCESS: Build directory found!
```

