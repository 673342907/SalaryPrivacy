# 修复 Vercel 路径问题 - 设置 Root Directory

## 问题诊断

根据构建日志：
- ✅ 构建只用了 **198 毫秒**（正常构建需要几分钟）
- ✅ 显示"没有准备任何文件，跳过缓存上传"
- ✅ Root Directory 设置为**空**

这说明 Vercel **没有找到正确的项目路径**，因为：
- Next.js 项目在 `packages/nextjs` 目录中
- 但 Vercel 从根目录开始构建
- 找不到 `next.config.ts` 和 `package.json`（Next.js 版本）

## 解决方案

### 方法 1：在 Vercel Dashboard 中设置 Root Directory（推荐）

1. **访问 Vercel Dashboard**
   - 打开：https://vercel.com/673342907s-projects/salary-privacy/settings

2. **进入 General 设置**
   - 点击左侧菜单的 **"Settings"**
   - 点击 **"General"** 标签

3. **设置 Root Directory**
   - 找到 **"Root Directory"** 设置
   - 点击 **"Edit"** 按钮
   - 输入：`packages/nextjs`
   - 点击 **"Save"** 保存

4. **重新部署**
   - 保存后，Vercel 会自动触发新的部署
   - 或者手动点击 **"Deployments"** → 最新部署 → **"Redeploy"**

### 方法 2：验证设置

部署后，检查构建日志应该显示：
- ✅ 构建时间：**几分钟**（不是 198 毫秒）
- ✅ 显示 "Installing dependencies..."
- ✅ 显示 "Running build command..."
- ✅ 显示 "Building Next.js application..."
- ✅ 显示 "Generating static pages..."

## 预期结果

设置 Root Directory 后，Vercel 会：
1. 从 `packages/nextjs` 目录开始构建
2. 找到 `next.config.ts` 和 `package.json`
3. 正确识别 Next.js 版本
4. 执行完整的构建过程
5. 生成正确的输出文件

## 验证步骤

1. 设置 Root Directory 为 `packages/nextjs`
2. 等待自动部署完成
3. 检查构建日志：
   - 应该看到完整的构建过程
   - 构建时间应该超过 1 分钟
   - 应该看到 "Deployment ready" 或类似成功消息
4. 访问网站验证功能是否正常

## 注意事项

- ⚠️ 设置 Root Directory 后，Vercel 会立即触发新的部署
- ⚠️ 确保 GitHub 代码是最新的（已经是 `52d9131`）
- ⚠️ 如果构建仍然很快，检查 `packages/nextjs/vercel.json` 配置是否正确


