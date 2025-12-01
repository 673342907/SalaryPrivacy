# 修复 Vercel 构建错误

## 错误信息

```
Error: Command "pnpm sdk:build && cd packages/confidential-salary-frontend && pnpm build" exited with 1
```

## 问题分析

这个错误通常由以下原因引起：

1. **工作目录问题** - `cd` 命令在 Vercel 的构建环境中可能不会正确保持
2. **命令链失败** - 如果 `pnpm sdk:build` 失败，整个命令链会中断
3. **路径解析问题** - 相对路径在 Vercel 环境中可能解析不正确

## 解决方案

### ✅ 方案 1: 使用 pnpm filter（已修复，推荐）

已更新 `vercel.json`，使用 `pnpm --filter` 代替 `cd` 命令：

```json
{
  "buildCommand": "pnpm --filter ./packages/fhevm-sdk build && pnpm --filter confidential-salary-frontend build"
}
```

**优点**：
- 不依赖 `cd` 命令
- 在 monorepo 中更可靠
- 工作目录始终是项目根目录

### ✅ 方案 2: 分步执行（如果方案 1 失败）

如果使用 `--filter` 仍然失败，可以尝试分步执行：

在 Vercel Dashboard 中设置：

**Build Command**:
```bash
pnpm install && pnpm --filter ./packages/fhevm-sdk build && pnpm --filter confidential-salary-frontend build
```

### ✅ 方案 3: 使用脚本文件（最可靠）

创建一个构建脚本：

1. **创建构建脚本**

   创建 `scripts/build-for-vercel.sh`:
   ```bash
   #!/bin/bash
   set -e  # 遇到错误立即退出
   
   echo "🔨 Building SDK..."
   pnpm --filter ./packages/fhevm-sdk build
   
   echo "🔨 Building frontend..."
   pnpm --filter confidential-salary-frontend build
   
   echo "✅ Build completed!"
   ```

2. **更新 vercel.json**
   ```json
   {
     "buildCommand": "bash scripts/build-for-vercel.sh"
   }
   ```

### ✅ 方案 4: 调试构建过程

如果仍然失败，添加调试信息：

**Build Command**:
```bash
echo "Current directory: $(pwd)" && \
echo "Listing packages:" && ls -la packages/ && \
pnpm --filter ./packages/fhevm-sdk build && \
echo "SDK build completed" && \
pnpm --filter confidential-salary-frontend build && \
echo "Frontend build completed"
```

## 常见构建失败原因

### 1. SDK 构建失败

**检查**：
- TypeScript 编译错误
- 缺少依赖
- tsconfig.json 配置问题

**解决**：
```bash
# 本地测试
cd packages/fhevm-sdk
pnpm install
pnpm build
```

### 2. 前端构建失败

**检查**：
- `@fhevm-sdk` 模块找不到
- TypeScript 错误
- Webpack 配置问题

**解决**：
```bash
# 确保 SDK 已构建
pnpm sdk:build

# 然后构建前端
cd packages/confidential-salary-frontend
pnpm install
pnpm build
```

### 3. 依赖安装失败

**检查**：
- pnpm-lock.yaml 是否最新
- 是否有网络问题
- Node.js 版本是否正确

**解决**：
```bash
# 更新 lockfile
pnpm install --no-frozen-lockfile
```

## 调试步骤

### 1. 查看完整构建日志

在 Vercel Dashboard 中：
1. 进入 **Deployments**
2. 点击失败的部署
3. 查看 **Build Logs**
4. 查找具体的错误信息

### 2. 本地复现问题

尝试在类似环境中测试：

```bash
# 清理
rm -rf node_modules packages/*/node_modules packages/*/dist packages/*/build

# 重新安装
pnpm install

# 测试构建命令
pnpm --filter ./packages/fhevm-sdk build
pnpm --filter confidential-salary-frontend build
```

### 3. 检查环境差异

Vercel 环境特点：
- Linux 环境（不是 Windows）
- 使用 pnpm 10.x
- Node.js 20.x
- 有限的内存和 CPU

## 推荐的最终配置

### vercel.json（推荐）

```json
{
  "version": 2,
  "buildCommand": "pnpm --filter ./packages/fhevm-sdk build && pnpm --filter confidential-salary-frontend build",
  "outputDirectory": "packages/confidential-salary-frontend/build",
  "installCommand": "pnpm install",
  "framework": null
}
```

### Vercel Dashboard 设置

- **Framework Preset**: `Other`
- **Root Directory**: 留空
- **Node.js Version**: `20.x`
- **Build Command**: （使用 vercel.json 中的配置）
- **Output Directory**: （使用 vercel.json 中的配置）

## 如果问题仍然存在

1. **提供构建日志**
   - 复制完整的错误信息
   - 包括错误前后的上下文

2. **检查特定错误**
   - TypeScript 错误？
   - 模块找不到？
   - 权限问题？

3. **尝试简化构建**
   - 先只构建 SDK
   - 再只构建前端
   - 确定哪个步骤失败

## 验证修复

修复后，成功的构建应该显示：
- ✅ SDK 构建成功
- ✅ 前端构建成功
- ✅ 找到输出目录
- ✅ 部署就绪


