# Vercel 部署配置指南

## 重要配置

### 1. Vercel Dashboard 设置

访问 Vercel Dashboard → 项目 Settings → General：

- **Root Directory**: `packages/nextjs`
- **Framework Preset**: `Next.js`
- **Build Command**: 留空（使用 `vercel.json` 中的配置）
- **Install Command**: 留空（使用 `vercel.json` 中的配置）
- **Output Directory**: 留空（Next.js 自动处理）

### 2. vercel.json 配置

当前配置（`packages/nextjs/vercel.json`）：

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile && cd packages/nextjs",
  "outputDirectory": ".next"
}
```

### 3. 关键点

- **Root Directory**: 必须设置为 `packages/nextjs`
- **Install Command**: 从根目录安装依赖，然后切换到 `packages/nextjs`
- **Build Command**: 在 `packages/nextjs` 目录中执行构建
- **Framework**: 明确指定为 `nextjs`

### 4. 部署步骤

1. 确保代码已推送到 GitHub
2. Vercel 会自动检测新的提交并触发部署
3. 如果自动部署失败，可以：
   - 在 Vercel Dashboard 中手动触发 Redeploy
   - 使用 Vercel CLI: `cd packages/nextjs && vercel --prod`

### 5. 常见问题

#### 问题：构建失败，提示找不到 Next.js
**解决**：确保 Root Directory 设置为 `packages/nextjs`

#### 问题：构建失败，提示依赖安装失败
**解决**：`installCommand` 已配置为从根目录安装依赖

#### 问题：构建成功但显示 404
**解决**：
- 检查 `app/page.tsx` 是否存在
- 检查 `app/layout.tsx` 是否存在
- 确保 Root Directory 正确设置

### 6. 验证部署

部署成功后，访问 Vercel 提供的 URL，应该能看到：
- 深色主题的首页
- 渐变 Logo "ConfidentialSalary"
- 功能导航卡片
- 状态徽章（如果连接了钱包）

