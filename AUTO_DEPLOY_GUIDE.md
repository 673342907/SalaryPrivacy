# 自动部署指南：GitHub + Vercel

本指南说明如何自动将代码部署到 GitHub 和 Vercel。

## 🚀 快速开始

### 方法 1: 使用 PowerShell 脚本（Windows）

```powershell
# 基本使用（使用默认提交信息）
.\deploy.ps1

# 自定义提交信息
.\deploy.ps1 "修复 bug：更新智能合约"
```

### 方法 2: 使用 Bash 脚本（Linux/Mac）

```bash
# 基本使用
chmod +x deploy.sh
./deploy.sh

# 自定义提交信息
./deploy.sh "修复 bug：更新智能合约"
```

### 方法 3: 手动部署

#### 1. 推送到 GitHub

```bash
# 添加所有更改
git add .

# 提交
git commit -m "你的提交信息"

# 推送
git push origin main
```

#### 2. 部署到 Vercel

**使用 Vercel CLI：**

```bash
# 安装 Vercel CLI（如果未安装）
npm i -g vercel

# 进入 Next.js 目录
cd packages/nextjs

# 首次部署（需要登录和链接项目）
vercel

# 后续部署到生产环境
vercel --prod
```

**使用 GitHub Actions（自动）：**

1. 在 GitHub 仓库设置中添加 Secrets：
   - `VERCEL_TOKEN` - 从 [Vercel Settings](https://vercel.com/account/tokens) 获取
   - `VERCEL_ORG_ID` - 从 Vercel 项目设置获取
   - `VERCEL_PROJECT_ID` - 从 Vercel 项目设置获取

2. 推送代码到 GitHub，GitHub Actions 会自动部署

## 📋 部署脚本功能

### deploy.ps1 / deploy.sh

**功能：**
- ✅ 自动检测未提交的更改
- ✅ 自动添加所有文件到 Git
- ✅ 自动提交更改
- ✅ 自动推送到 GitHub
- ✅ 自动部署到 Vercel（如果已安装 CLI）

**使用场景：**
- 开发完成后一键部署
- CI/CD 流程
- 快速迭代部署

## 🔧 Vercel 配置

### 环境变量

在 Vercel 项目设置中配置以下环境变量：

```
NEXT_PUBLIC_CONTRACT_ADDRESS=你的合约地址
NEXT_PUBLIC_ALCHEMY_API_KEY=你的 Alchemy API Key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=你的 WalletConnect Project ID
```

### 构建配置

项目已配置 `packages/nextjs/vercel.json`：

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "pnpm run build",
  "installCommand": "cd ../.. && pnpm install --no-frozen-lockfile",
  "outputDirectory": ".next"
}
```

## 🔐 GitHub Actions 自动部署

### 设置 Secrets

1. 进入 GitHub 仓库
2. 点击 Settings → Secrets and variables → Actions
3. 添加以下 Secrets：

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel API Token | [Vercel Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel 组织 ID | Vercel 项目设置 → General |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | Vercel 项目设置 → General |

### 工作流程

当代码推送到 `main` 分支时，GitHub Actions 会自动：
1. 检出代码
2. 安装依赖
3. 构建项目
4. 部署到 Vercel 生产环境

## 📝 提交信息规范

建议使用以下格式的提交信息：

```
类型: 简短描述

详细描述（可选）
```

**类型：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例：**
```
feat: 添加智能合约部署功能

- 添加部署脚本
- 更新前端配置
- 添加部署文档
```

## 🐛 故障排除

### Git 推送失败

**问题：** 权限不足
**解决：** 检查 GitHub 访问权限，确保已配置 SSH 密钥或 Personal Access Token

### Vercel 部署失败

**问题：** 构建错误
**解决：** 
1. 检查 `packages/nextjs/vercel.json` 配置
2. 检查环境变量是否正确设置
3. 查看 Vercel 构建日志

### Vercel CLI 未安装

**问题：** `vercel: command not found`
**解决：** 
```bash
npm i -g vercel
```

## 📚 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel CLI 文档](https://vercel.com/docs/cli)
- [Vercel 部署文档](https://vercel.com/docs/deployments)

---

**最后更新：** 2024-12-03

