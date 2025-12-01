# 🚀 Vercel 立即部署指南

## 📋 当前状态

- ✅ 项目已推送到 GitHub: https://github.com/673342907/SalaryPrivacy.git
- ✅ 已配置 `vercel.json` 文件
- ⚠️ 项目缺少 `packages` 目录（代码包）

## 🎯 部署步骤

### 方法一：通过 Vercel Dashboard（推荐）

#### 步骤 1: 访问 Vercel

1. 打开浏览器，访问 [https://vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录（如果没有账户，先注册）

#### 步骤 2: 导入项目

1. 点击右上角 **"Add New..."** → **"Project"**
2. 在仓库列表中找到 **"673342907/SalaryPrivacy"**
3. 如果看不到，点击 **"Adjust GitHub App Permissions"** 授权访问
4. 点击 **"Import"** 按钮

#### 步骤 3: 配置项目设置

**重要配置：**

1. **Framework Preset**: 选择 **"Other"** 或 **"Create React App"**

2. **Root Directory**: 
   - ⚠️ **必须留空**（不要填写任何内容）
   - 这是最关键的一步！

3. **Build Command**: 
   ```
   pnpm install && pnpm sdk:build && cd packages/confidential-salary-frontend && pnpm build
   ```
   或者使用 vercel.json 中的配置（如果已提交）

4. **Output Directory**: 
   ```
   packages/confidential-salary-frontend/build
   ```

5. **Install Command**: 
   ```
   pnpm install --frozen-lockfile
   ```

6. **Node.js Version**: 选择 **20.x**（重要！）

#### 步骤 4: 环境变量（可选）

如果需要配置环境变量：
- 点击 **"Environment Variables"**
- 添加必要的变量（如合约地址、RPC URL 等）

#### 步骤 5: 部署

1. 点击 **"Deploy"** 按钮
2. 等待构建完成（约 5-10 分钟）

### 方法二：使用 Vercel CLI

#### 步骤 1: 安装 Vercel CLI

```powershell
npm i -g vercel
```

#### 步骤 2: 登录

```powershell
vercel login
```

#### 步骤 3: 部署

```powershell
# 在项目根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

## ⚠️ 重要提示

### 如果构建失败：找不到 packages 目录

**问题**: 当前项目缺少 `packages` 目录，这会导致构建失败。

**解决方案**:

1. **检查 GitHub 仓库**
   - 访问 https://github.com/673342907/SalaryPrivacy
   - 确认是否有 `packages` 目录
   - 如果没有，需要先添加代码包

2. **如果需要添加代码包**
   - 从 fhevm-react-template 主仓库获取完整代码
   - 或者手动创建 `packages` 目录结构

3. **临时解决方案**
   - 如果只是演示，可以使用在线演示：
     - React: https://react-showcase-1738.up.railway.app/
     - Next.js: https://nextjs-showcase-1661.up.railway.app/
     - Vue: https://vue-showcase-2780.up.railway.app/

## 📝 部署后检查

部署成功后：

1. **访问部署的 URL**
   - Vercel 会提供一个 URL，格式：`https://salary-privacy.vercel.app`
   - 点击访问网站

2. **验证功能**
   - 确认页面可以正常加载
   - 测试主要功能
   - 检查控制台是否有错误

3. **查看部署日志**
   - 在 Vercel Dashboard 中查看构建日志
   - 确认所有步骤都成功

## 🔧 常见问题

### 问题 1: 构建失败 - 找不到模块

**错误**: `Cannot find module '@fhevm-sdk'`

**解决**: 
- 确保构建命令包含 `pnpm sdk:build`
- 检查 `packages/fhevm-sdk` 是否存在

### 问题 2: 构建超时

**错误**: `Build exceeded maximum build time`

**解决**:
- Vercel 免费版限制 45 分钟
- 优化构建命令
- 考虑升级到 Pro 计划

### 问题 3: 路由 404

**错误**: 直接访问路由返回 404

**解决**:
- 确保 `vercel.json` 中的 `rewrites` 配置正确
- 所有路由应重定向到 `/index.html`

## 🎯 快速操作清单

- [ ] 访问 https://vercel.com 并登录
- [ ] 导入 GitHub 仓库
- [ ] 确认 Root Directory 为空
- [ ] 配置 Build Command 和 Output Directory
- [ ] 设置 Node.js 版本为 20.x
- [ ] 点击 Deploy
- [ ] 等待构建完成
- [ ] 访问部署的 URL 验证

## 📚 相关文档

- [Vercel 官方文档](https://vercel.com/docs)
- [项目部署文档](./VERCEL_DEPLOYMENT.md)
- [故障排除](./VERCEL_TROUBLESHOOTING.md)

---

**现在就开始部署吧！** 🚀

访问 [https://vercel.com](https://vercel.com) 开始部署。

