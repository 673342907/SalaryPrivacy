# 手动推送代码到 Vercel - 解决方案

## 问题：路径重复错误

**错误信息：**
```
Error: The provided path "E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\packages\nextjs\packages\nextjs" does not exist.
```

**原因：**
- Vercel Dashboard 中的 Root Directory 设置为 `packages/nextjs`
- 从 `packages/nextjs` 目录执行 `vercel --prod` 命令
- 导致路径重复：`packages/nextjs/packages/nextjs`

## 解决方案

### 方案 1：清除 Vercel Dashboard 中的 Root Directory（推荐）

1. **访问 Vercel Dashboard 设置**
   - 打开：https://vercel.com/673342907s-projects/salary-privacy/settings

2. **清除 Root Directory**
   - 在 "General" 标签页中
   - 找到 "Root Directory" 设置
   - **将其设置为空（留空）** 或删除所有内容
   - 点击 "Save" 保存

3. **从根目录部署**
   ```powershell
   # 在根目录执行
   cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy
   vercel --prod --yes
   ```

### 方案 2：从根目录部署（Root Directory 保持为 packages/nextjs）

如果不想修改 Dashboard 设置，可以从根目录部署：

```powershell
# 1. 返回根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 2. 部署（vercel.json 会处理路径）
vercel --prod --yes
```

**注意：** 需要确保根目录有 `vercel.json` 文件，或者 `packages/nextjs/vercel.json` 配置正确。

### 方案 3：使用 Vercel Dashboard 手动触发（最简单）

1. **访问部署页面**
   - 打开：https://vercel.com/673342907s-projects/salary-privacy

2. **触发重新部署**
   - 点击 "Deployments" 标签
   - 找到最新的部署
   - 点击右侧的 "..." 菜单
   - 选择 "Redeploy"
   - 确保选择了最新的 GitHub 提交
   - 点击 "Redeploy" 按钮

## 推荐配置

### Vercel Dashboard 设置（推荐）

- **Root Directory**: 留空（不设置）
- **Framework Preset**: Next.js（自动检测）
- **Build Command**: 留空（使用 vercel.json）
- **Install Command**: 留空（使用 vercel.json）
- **Output Directory**: 留空（Next.js 自动处理）

### vercel.json 配置

`packages/nextjs/vercel.json`:
```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile",
  "outputDirectory": ".next"
}
```

## 快速命令

### 从根目录部署（推荐）
```powershell
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy
vercel --prod --yes
```

### 从 packages/nextjs 目录部署（需要先清除 Root Directory）
```powershell
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\packages\nextjs
vercel --prod --yes
```

## 验证部署

部署成功后，访问：
- Vercel Dashboard: https://vercel.com/673342907s-projects/salary-privacy
- 查看部署状态和 URL




