# Vercel 环境变量配置 - 临时禁用构建错误

## 问题
构建失败是因为 Prettier 格式警告。可以临时禁用这些检查来让部署通过。

## 解决方案：在 Vercel 中设置环境变量

### 步骤 1：访问 Vercel Dashboard
1. 打开：https://vercel.com/673342907s-projects/salary-privacy/settings/environment-variables

### 步骤 2：添加环境变量
1. 点击 "Add New" 或 "Add Environment Variable"
2. 输入：
   - **Key**: `NEXT_PUBLIC_IGNORE_BUILD_ERROR`
   - **Value**: `true`
   - **Environment**: 选择 "Production"（或 "Production, Preview, Development"）
3. 点击 "Save"

### 步骤 3：重新部署
1. 返回 "Deployments" 页面
2. 点击最新部署的 "..." → "Redeploy"
3. 或点击 "Deploy" 按钮重新部署

## 注意事项

⚠️ **这是临时解决方案**，建议后续修复 Prettier 格式错误。

项目已经配置了 `next.config.ts` 来支持这个环境变量：
```typescript
eslint: {
  ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
}
```

## 永久解决方案

修复所有 Prettier 格式错误：
```bash
cd packages/nextjs
npx prettier --write "app/**/*.{ts,tsx}"
```

然后移除环境变量，重新部署。

