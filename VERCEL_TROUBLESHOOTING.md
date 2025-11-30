# Vercel 部署故障排除指南

## 当前构建状态分析

根据您提供的日志，构建过程正在进行中：

### ✅ 正常进行的步骤

1. **仓库克隆** - ✅ 完成 (211ms)
2. **依赖检测** - ✅ 检测到 pnpm-lock.yaml
3. **依赖安装** - ⏳ 正在进行中

### 可能的问题和解决方案

## 问题 1: 构建卡在依赖安装阶段

**症状**: 构建日志显示 "Running install command" 后长时间无响应

**可能原因**:
- 依赖安装时间较长（特别是 native 模块编译）
- 网络问题
- 构建超时

**解决方案**:

1. **等待构建完成**（推荐）
   - 首次构建可能需要 5-10 分钟
   - native 模块（如 `keccak`, `bufferutil`）需要编译

2. **检查构建日志**
   - 在 Vercel Dashboard 中查看完整的构建日志
   - 查找错误信息（红色文本）

3. **优化构建命令**（如果持续失败）
   
   在 Vercel 项目设置中，尝试使用以下构建命令：
   ```bash
   pnpm install --frozen-lockfile && pnpm sdk:build && pnpm --filter confidential-salary-frontend build
   ```

## 问题 2: SDK 构建失败

**症状**: 错误信息包含 `@fhevm-sdk` 或 `Cannot find module`

**解决方案**:

1. **确保 SDK 先构建**
   - 构建命令已包含 `pnpm sdk:build`
   - 如果失败，检查 `packages/fhevm-sdk/tsconfig.json` 配置

2. **检查 TypeScript 配置**
   ```bash
   # 在本地测试
   pnpm sdk:build
   ```

## 问题 3: 构建超时

**症状**: 构建在 45 分钟后失败（免费版限制）

**解决方案**:

1. **优化构建过程**
   - 使用构建缓存
   - 减少不必要的步骤

2. **升级到 Vercel Pro**
   - Pro 计划有更长的构建时间限制

3. **使用构建缓存**
   
   在 `vercel.json` 中添加（已自动启用）：
   ```json
   {
     "buildCommand": "...",
     "installCommand": "pnpm install --frozen-lockfile"
   }
   ```

## 问题 4: 找不到模块错误

**症状**: `Module not found: Can't resolve '@fhevm-sdk'`

**解决方案**:

1. **确保工作区链接正确**
   - pnpm workspace 应该自动处理
   - 检查 `pnpm-workspace.yaml` 配置

2. **在构建命令中显式链接**
   ```bash
   pnpm install && pnpm sdk:build && pnpm --filter confidential-salary-frontend install && pnpm --filter confidential-salary-frontend build
   ```

## 问题 5: Node.js 版本不匹配

**症状**: 构建失败，提示 Node.js 版本问题

**解决方案**:

1. **在 Vercel 项目设置中指定 Node.js 版本**
   - 进入项目 Settings → General
   - 设置 Node.js Version 为 `20.x`

2. **或使用 `.nvmrc` 文件**
   ```bash
   echo "20" > .nvmrc
   ```

## 问题 6: WASM 文件加载失败

**症状**: 运行时错误，无法加载 `.wasm` 文件

**解决方案**:

1. **确保 WASM 文件在 public 目录**
   - 检查 `packages/confidential-salary-frontend/public/`

2. **添加正确的 Content-Type 头**
   - 已在 `vercel.json` 中配置路由重写

## 推荐的构建命令（优化版）

如果当前构建失败，尝试在 Vercel 项目设置中使用：

```bash
pnpm install --frozen-lockfile && pnpm sdk:build && pnpm --filter confidential-salary-frontend build
```

## 检查清单

在重新部署前，确认：

- [ ] `vercel.json` 文件在项目根目录
- [ ] `pnpm-lock.yaml` 已提交到 Git
- [ ] Node.js 版本设置为 20.x
- [ ] 构建命令正确配置
- [ ] 输出目录设置为 `packages/confidential-salary-frontend/build`

## 本地测试构建

在本地测试构建过程，确保一切正常：

```bash
# 1. 清理
rm -rf node_modules packages/*/node_modules packages/*/dist packages/*/build

# 2. 安装依赖
pnpm install

# 3. 构建 SDK
pnpm sdk:build

# 4. 构建前端
pnpm --filter confidential-salary-frontend build

# 5. 检查输出
ls -la packages/confidential-salary-frontend/build
```

如果本地构建成功，Vercel 构建也应该成功。

## 获取帮助

如果问题持续存在：

1. **查看完整构建日志**
   - 在 Vercel Dashboard → Deployments → 点击失败的部署
   - 查看 "Build Logs" 标签

2. **检查错误信息**
   - 查找红色错误文本
   - 复制完整的错误堆栈

3. **联系支持**
   - Vercel 支持: support@vercel.com
   - 或查看 [Vercel 文档](https://vercel.com/docs)

## 常见错误消息

### "Command failed with exit code 1"
- 检查构建命令是否正确
- 查看详细错误信息

### "Module not found"
- 确保 SDK 已构建
- 检查工作区配置

### "Build exceeded maximum build time"
- 优化构建过程
- 考虑升级计划

### "Out of memory"
- 减少并发构建
- 优化依赖

