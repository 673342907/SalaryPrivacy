# Vercel 部署失败修复指南

## 🔍 常见部署失败原因

### 1. Root Directory 未设置

**问题：** Vercel 无法找到 Next.js 项目

**解决：**
1. 进入 Vercel Dashboard
2. 选择项目 → Settings → General
3. 找到 **Root Directory** 设置
4. 设置为：`packages/nextjs`
5. 保存并重新部署

### 2. 依赖安装失败

**问题：** 这是一个 monorepo 项目，需要从根目录安装依赖

**解决：** 已更新 `vercel.json` 配置：
```json
{
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile",
  "buildCommand": "cd ../.. && pnpm install --no-frozen-lockfile && cd packages/nextjs && pnpm run build"
}
```

### 3. 缺少环境变量

**问题：** 生产环境缺少必需的环境变量

**必需的环境变量：**
- `NEXT_PUBLIC_ALCHEMY_API_KEY` - **必需**（生产环境）
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` - 推荐设置
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - 如果已部署合约

**设置步骤：**
1. Vercel Dashboard → 项目 → Settings → Environment Variables
2. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | 你的 Alchemy API Key | Production, Preview, Development |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | 你的 WalletConnect Project ID | Production, Preview, Development |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | 合约地址（如果已部署） | Production, Preview, Development |

### 4. 构建命令错误

**问题：** 构建命令在错误的目录执行

**解决：** 已更新 `vercel.json`，确保：
1. 从根目录安装依赖
2. 切换到 `packages/nextjs` 目录
3. 执行构建命令

### 5. TypeScript/ESLint 错误

**问题：** 构建时 TypeScript 或 ESLint 错误

**临时解决：** 在环境变量中添加：
```
NEXT_PUBLIC_IGNORE_BUILD_ERROR=true
```

**注意：** 这只是临时方案，应该修复实际的错误

## 🛠️ 完整修复步骤

### 步骤 1: 更新 Vercel 配置

已更新 `packages/nextjs/vercel.json`，确保包含：
- 正确的 `installCommand`
- 正确的 `buildCommand`
- `rootDirectory` 设置

### 步骤 2: 设置 Root Directory

1. 登录 Vercel Dashboard
2. 选择项目
3. Settings → General
4. **Root Directory**: 设置为 `packages/nextjs`
5. 保存

### 步骤 3: 配置环境变量

1. Settings → Environment Variables
2. 添加必需的环境变量（见上方表格）
3. 确保选择正确的环境（Production, Preview, Development）

### 步骤 4: 重新部署

**方法 1: 通过 Dashboard**
1. Deployments 标签页
2. 找到最新的部署
3. 点击 "..." → Redeploy

**方法 2: 通过 CLI**
```bash
cd packages/nextjs
vercel --prod
```

**方法 3: 推送新提交**
```bash
git commit --allow-empty -m "触发 Vercel 重新部署"
git push origin main
```

## 📋 验证清单

部署前检查：

- [ ] Root Directory 设置为 `packages/nextjs`
- [ ] `vercel.json` 已更新
- [ ] 环境变量已配置
- [ ] `NEXT_PUBLIC_ALCHEMY_API_KEY` 已设置
- [ ] 代码已推送到 GitHub

## 🔧 调试技巧

### 查看构建日志

1. Vercel Dashboard → Deployments
2. 点击失败的部署
3. 查看 Build Logs
4. 查找错误信息

### 常见错误信息

**错误：** `Cannot find module '@fhevm-sdk'`
**原因：** 依赖未正确安装
**解决：** 确保 `installCommand` 从根目录安装

**错误：** `NEXT_PUBLIC_ALCHEMY_API_KEY is required in production`
**原因：** 缺少环境变量
**解决：** 在 Vercel 中设置环境变量

**错误：** `Type error: ...`
**原因：** TypeScript 错误
**解决：** 修复代码错误，或临时设置 `NEXT_PUBLIC_IGNORE_BUILD_ERROR=true`

## 🚀 快速修复命令

如果使用 Vercel CLI：

```bash
# 1. 进入 Next.js 目录
cd packages/nextjs

# 2. 登录 Vercel（如果未登录）
vercel login

# 3. 链接项目（如果未链接）
vercel link

# 4. 部署到生产环境
vercel --prod
```

## 📞 获取帮助

如果问题仍然存在：

1. 查看 Vercel 构建日志获取详细错误信息
2. 检查 GitHub Actions（如果配置了）
3. 查看 Vercel 文档：https://vercel.com/docs

---

**最后更新：** 2024-12-03

