# 🔧 Vercel 部署失败 - 完整解决方案

## 🚨 常见问题诊断

### 问题 1: 构建命令失败
**症状：**
- 构建日志显示 "Command failed"
- 依赖安装失败
- 找不到模块

**解决方案：**

#### 方案 A: 优化 vercel.json 配置

更新 `packages/nextjs/vercel.json`：

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm install --no-frozen-lockfile && cd packages/nextjs && pnpm run build",
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile",
  "outputDirectory": ".next"
}
```

**注意：** 不要在 vercel.json 中设置 `rootDirectory`，应该在 Vercel Dashboard 中设置。

#### 方案 B: 在 Vercel Dashboard 中配置

1. **访问 Vercel Dashboard**
   - 进入项目 Settings → General

2. **设置 Root Directory**
   - **Root Directory**: `packages/nextjs`
   - 确保没有前导或尾随空格

3. **Build & Development Settings**
   - **Framework Preset**: `Next.js`
   - **Build Command**: 留空（使用 vercel.json 中的配置）
   - **Install Command**: 留空（使用 vercel.json 中的配置）
   - **Output Directory**: 留空（Next.js 自动处理）
   - **Node.js Version**: `20.x`

### 问题 2: 环境变量缺失
**症状：**
- 运行时错误
- API 调用失败

**解决方案：**
在 Vercel Dashboard → Settings → Environment Variables 中添加：

```
NEXT_PUBLIC_IGNORE_BUILD_ERROR=false
NODE_ENV=production
```

### 问题 3: 依赖安装失败
**症状：**
- `pnpm install` 失败
- 找不到 workspace 依赖

**解决方案：**

#### 更新 vercel.json 的 installCommand：

```json
{
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile --shamefully-hoist"
}
```

### 问题 4: 构建超时
**症状：**
- 构建时间过长
- 超时错误

**解决方案：**
1. 优化构建命令
2. 使用构建缓存
3. 减少不必要的依赖

## ✅ 推荐配置

### 1. packages/nextjs/vercel.json

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm install --no-frozen-lockfile && cd packages/nextjs && pnpm run build",
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile --shamefully-hoist",
  "outputDirectory": ".next"
}
```

### 2. Vercel Dashboard 设置

- **Root Directory**: `packages/nextjs`
- **Framework Preset**: `Next.js`
- **Build Command**: (留空，使用 vercel.json)
- **Install Command**: (留空，使用 vercel.json)
- **Output Directory**: (留空)
- **Node.js Version**: `20.x`

### 3. 环境变量

在 Vercel Dashboard → Settings → Environment Variables 中添加：

```
NEXT_PUBLIC_IGNORE_BUILD_ERROR=false
NODE_ENV=production
```

## 🔄 重新部署步骤

1. **更新配置**
   - 更新 `packages/nextjs/vercel.json`
   - 提交并推送到 GitHub

2. **清除缓存**
   - Vercel Dashboard → Deployments
   - 点击最新部署的 "..." → "Redeploy"
   - **取消勾选** "Use existing Build Cache"
   - 点击 "Redeploy"

3. **检查构建日志**
   - 查看构建日志中的错误信息
   - 根据错误信息调整配置

## 📝 调试命令

### 本地测试构建

```bash
# 从项目根目录
cd packages/nextjs
pnpm install
pnpm run build
```

### 使用 Vercel CLI 部署

```bash
# 从 packages/nextjs 目录
cd packages/nextjs
vercel --prod
```

## 🆘 如果仍然失败

1. **查看构建日志**
   - 在 Vercel Dashboard 中查看详细的构建日志
   - 找到具体的错误信息

2. **检查依赖**
   - 确保所有依赖都在 `package.json` 中
   - 检查 workspace 依赖是否正确配置

3. **简化配置**
   - 暂时移除复杂的构建步骤
   - 逐步添加功能

4. **联系支持**
   - 如果问题持续，联系 Vercel 支持
   - 提供构建日志和配置信息
