# Vercel 部署指南

本指南将帮助您将 ConfidentialSalary 项目部署到 Vercel。

## 前置要求

1. **Vercel 账户**：访问 [vercel.com](https://vercel.com) 注册或登录
2. **Git 仓库**：确保项目已推送到 GitHub、GitLab 或 Bitbucket
3. **Node.js 版本**：项目要求 Node.js >= 20.0.0

## 部署步骤

### 方法一：通过 Vercel Dashboard（推荐）

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账户登录

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 选择您的 Git 仓库
   - 如果仓库未显示，点击 "Adjust GitHub App Permissions" 授权访问

3. **配置项目设置**
   - **Framework Preset**: 选择 "Other" 或 "Create React App"
   - **Root Directory**: 保持为空（使用项目根目录）
   - **Build Command**: `cd packages/confidential-salary-frontend && pnpm install && pnpm build`
   - **Output Directory**: `packages/confidential-salary-frontend/build`
   - **Install Command**: `pnpm install`
   - **Node.js Version**: 选择 20.x

4. **环境变量**（如果需要）
   - 在 "Environment Variables" 部分添加必要的环境变量
   - 例如：合约地址、RPC URL 等

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成

### 方法二：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **在项目根目录部署**
   ```bash
   vercel
   ```

4. **生产环境部署**
   ```bash
   vercel --prod
   ```

## 项目配置说明

项目已包含 `vercel.json` 配置文件，包含以下设置：

- **构建命令**: 构建 confidential-salary-frontend 应用
- **输出目录**: React 构建产物目录
- **路由重写**: 所有路由重定向到 index.html（支持 React Router）
- **缓存策略**: 静态资源长期缓存

## Monorepo 配置

由于这是一个 pnpm monorepo，Vercel 会自动：
- 检测到 `pnpm-workspace.yaml`
- 使用 pnpm 安装依赖
- 在构建前自动构建 `fhevm-sdk`（通过 preinstall 脚本）

## 常见问题

### 1. 构建失败：找不到模块

**问题**: 构建时提示找不到 `@fhevm-sdk` 模块

**解决方案**:
- 确保 `packages/fhevm-sdk` 已构建
- 检查 `vercel.json` 中的构建命令是否正确
- 可以在构建命令前添加：`pnpm sdk:build &&`

### 2. 构建超时

**问题**: 构建时间过长导致超时

**解决方案**:
- Vercel 免费版构建时间限制为 45 分钟
- 优化构建命令，减少不必要的步骤
- 考虑使用 Vercel Pro 计划

### 3. 路由 404 错误

**问题**: 直接访问路由返回 404

**解决方案**:
- 确保 `vercel.json` 中的 `rewrites` 配置正确
- 所有路由应重定向到 `/index.html`

### 4. WASM 文件加载失败

**问题**: WebAssembly 文件无法加载

**解决方案**:
- 确保 WASM 文件在 `public` 目录中
- 检查 `craco.config.js` 中的 WASM 配置
- 可能需要添加特定的 Content-Type 头

## 环境变量配置

如果需要配置环境变量，在 Vercel Dashboard 中：

1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加变量，例如：
   - `REACT_APP_CONTRACT_ADDRESS`: 智能合约地址
   - `REACT_APP_RPC_URL`: RPC 节点 URL
   - `REACT_APP_CHAIN_ID`: 链 ID

## 自定义域名

1. 在 Vercel Dashboard 中进入项目
2. 选择 "Settings" → "Domains"
3. 添加您的域名
4. 按照提示配置 DNS 记录

## 持续部署

Vercel 默认启用自动部署：
- 每次推送到主分支会自动部署到生产环境
- 推送到其他分支会创建预览部署
- 可以通过 Pull Request 创建预览部署

## 监控和日志

- **构建日志**: 在 Vercel Dashboard 的 "Deployments" 中查看
- **运行时日志**: 在 "Functions" 标签中查看（如果使用 Serverless Functions）
- **性能监控**: Vercel Analytics（需要启用）

## 更新部署

每次推送到 Git 仓库，Vercel 会自动：
1. 检测更改
2. 触发新的构建
3. 部署到预览或生产环境

## 回滚部署

如果需要回滚到之前的版本：
1. 在 Vercel Dashboard 中进入 "Deployments"
2. 找到要回滚的部署
3. 点击 "..." 菜单 → "Promote to Production"

## 技术支持

- [Vercel 文档](https://vercel.com/docs)
- [Vercel 社区](https://github.com/vercel/vercel/discussions)
- [项目 Issues](https://github.com/your-repo/issues)

