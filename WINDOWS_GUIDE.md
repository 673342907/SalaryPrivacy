# 🪟 Windows 使用指南

本指南将帮助你在 Windows 系统上运行 FHEVM SDK 项目。

## 📋 前置要求

### 1. 安装 Node.js

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 **LTS 版本**（推荐 20.x 或更高版本）
3. 运行安装程序，按默认设置安装
4. 验证安装：
   ```powershell
   node --version
   npm --version
   ```

### 2. 安装 pnpm（包管理器）

在 PowerShell 中运行：

```powershell
# 使用 npm 安装 pnpm
npm install -g pnpm

# 验证安装
pnpm --version
```

**或者使用其他方法：**
```powershell
# 使用 PowerShell 脚本安装
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 3. 安装 Git（如果还没有）

1. 访问 [Git 官网](https://git-scm.com/download/win)
2. 下载并安装 Git for Windows
3. 验证安装：
   ```powershell
   git --version
   ```

## 🚀 快速开始

### 步骤 1: 进入项目目录

```powershell
# 进入项目根目录
cd E:\code\fhe\ggg\fhevm-react-template-main\fhevm-react-template-main
```

### 步骤 2: 安装依赖

```powershell
# 安装所有依赖（这会自动构建 SDK）
pnpm install
```

**注意：** 首次安装可能需要几分钟时间，因为需要编译 TypeScript 和安装所有依赖。

### 步骤 3: 构建 SDK

```powershell
# 构建 FHEVM SDK
pnpm sdk:build
```

## 🎯 运行不同的展示应用

### 选项 1: React 展示应用（推荐新手）

```powershell
# 进入 React 展示目录
cd packages\react-showcase

# 启动开发服务器
pnpm start
```

应用将在 `http://localhost:3000` 打开。

**使用步骤：**
1. 确保已安装 MetaMask 浏览器扩展
2. 连接到 Sepolia 测试网
3. 确保钱包中有 Sepolia ETH（测试币）
4. 在应用中连接钱包
5. 开始使用加密功能

### 选项 2: Next.js 展示应用

```powershell
# 从项目根目录运行
pnpm --filter nextjs-showcase dev
```

应用将在 `http://localhost:3001` 打开。

### 选项 3: Vue 展示应用

```powershell
# 从项目根目录运行
pnpm --filter vue-showcase dev
```

应用将在 `http://localhost:3003` 打开。

### 选项 4: Node.js 命令行应用

#### 4.1 配置环境变量

首先创建环境变量文件：

```powershell
# 进入 node-showcase 目录
cd packages\node-showcase

# 创建 .env 文件（如果不存在）
if (!(Test-Path .env)) {
    New-Item -ItemType File -Path .env
}
```

编辑 `.env` 文件，添加以下内容：

```env
# RPC 节点 URL（使用 Infura 或 Alchemy）
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# 或者使用 Alchemy
# RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# 你的钱包私钥（用于签名交易）
PRIVATE_KEY=your_private_key_here

# 链 ID（Sepolia 测试网）
CHAIN_ID=11155111
```

**获取 RPC URL：**
- **Infura**: 访问 https://infura.io 注册并创建项目
- **Alchemy**: 访问 https://www.alchemy.com 注册并创建应用

**获取私钥：**
- 从 MetaMask 导出（设置 → 安全与隐私 → 显示私钥）
- ⚠️ **警告**: 永远不要分享你的私钥！

#### 4.2 运行 Node.js 应用

**交互式模式（推荐）：**
```powershell
# 进入 node-showcase 目录
cd packages\node-showcase

# 运行交互式探索器
pnpm explorer
```

这会打开一个交互式菜单，你可以选择要运行的演示。

**HTTP 服务器模式：**
```powershell
# 启动 HTTP 服务器
pnpm start

# 服务器运行在 http://localhost:3001
```

**使用 PowerShell 测试 API：**
```powershell
# 运行计数器演示
Invoke-RestMethod -Uri http://localhost:3001/counter -Method POST

# 运行投票演示
Invoke-RestMethod -Uri http://localhost:3001/voting -Method POST

# 获取配置
Invoke-RestMethod -Uri http://localhost:3001/config -Method GET
```

**非交互式 CLI 模式：**
```powershell
# 运行所有演示
pnpm cli
```

## 🔧 常见问题解决

### 问题 1: pnpm 命令未找到

**解决方案：**
```powershell
# 重新安装 pnpm
npm install -g pnpm

# 或者添加到 PATH 环境变量
# 1. 右键"此电脑" → 属性 → 高级系统设置
# 2. 环境变量 → 系统变量 → Path → 编辑
# 3. 添加: C:\Users\你的用户名\AppData\Roaming\npm
```

### 问题 2: 构建失败

**解决方案：**
```powershell
# 清理并重新安装
pnpm sdk:clean
pnpm install
pnpm sdk:build
```

### 问题 3: 端口被占用

**解决方案：**
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 结束进程（替换 PID 为实际进程 ID）
taskkill /PID <PID> /F
```

### 问题 4: 权限错误

**解决方案：**
```powershell
# 以管理员身份运行 PowerShell
# 右键 PowerShell → 以管理员身份运行
```

### 问题 5: Node.js 版本不兼容

**解决方案：**
```powershell
# 检查 Node.js 版本（需要 >= 20.0.0）
node --version

# 如果版本太低，从 nodejs.org 下载最新 LTS 版本
```

## 📝 开发工作流

### 开发模式（自动重新编译）

```powershell
# SDK 监听模式
pnpm sdk:watch

# 在另一个终端运行应用
pnpm --filter react-showcase start
```

### 运行测试

```powershell
# 运行所有测试
pnpm test

# 运行特定展示的测试
pnpm test:react
pnpm test:nextjs
pnpm test:vue
```

### 编译智能合约

```powershell
# 编译合约
pnpm hardhat:compile

# 部署到本地网络
pnpm deploy:localhost

# 部署到 Sepolia 测试网
pnpm deploy:sepolia
```

## 🎓 学习路径

### 初学者路径

1. **第一步：运行 React 展示**
   ```powershell
   cd packages\react-showcase
   pnpm start
   ```
   - 在浏览器中打开应用
   - 连接 MetaMask 钱包
   - 尝试计数器功能

2. **第二步：查看代码**
   - 打开 `packages\react-showcase\src\components\FheCounter.tsx`
   - 了解如何使用 `useEncrypt` 和 `useDecrypt` hooks

3. **第三步：运行 Node.js 演示**
   ```powershell
   cd packages\node-showcase
   pnpm explorer
   ```
   - 选择不同的演示
   - 观察控制台输出

### 进阶路径

1. **修改智能合约**
   - 编辑 `packages\hardhat\contracts\` 中的合约
   - 重新编译和部署

2. **创建自定义组件**
   - 参考现有组件创建新功能
   - 使用 SDK 的 hooks 或类适配器

3. **集成到现有项目**
   - 安装 `@fhevm-sdk` 包
   - 使用适配器 API

## 🔐 安全注意事项

1. **私钥安全**
   - 永远不要将私钥提交到 Git
   - 使用 `.env` 文件存储敏感信息
   - 将 `.env` 添加到 `.gitignore`

2. **测试网络**
   - 项目默认使用 Sepolia 测试网
   - 测试币可以从水龙头获取：
     - https://sepoliafaucet.com/
     - https://faucet.quicknode.com/ethereum/sepolia

3. **生产环境**
   - 不要在生产环境使用测试私钥
   - 使用环境变量管理配置
   - 使用硬件钱包管理主网私钥

## 📚 有用的命令速查

```powershell
# 项目根目录命令
pnpm install              # 安装所有依赖
pnpm sdk:build           # 构建 SDK
pnpm sdk:watch           # 监听模式构建 SDK
pnpm test                # 运行测试

# React 展示
pnpm --filter react-showcase start

# Next.js 展示
pnpm --filter nextjs-showcase dev

# Vue 展示
pnpm --filter vue-showcase dev

# Node.js 展示
cd packages\node-showcase
pnpm explorer            # 交互式模式
pnpm start               # HTTP 服务器
pnpm cli                 # 非交互式 CLI

# 智能合约
pnpm hardhat:compile     # 编译合约
pnpm deploy:localhost    # 部署到本地
pnpm deploy:sepolia      # 部署到 Sepolia
```

## 🆘 获取帮助

如果遇到问题：

1. 检查 Node.js 和 pnpm 版本
2. 查看错误日志
3. 确保环境变量配置正确
4. 尝试清理并重新安装：
   ```powershell
   pnpm sdk:clean
   pnpm install
   ```

## 🎉 开始使用

现在你已经准备好开始使用 FHEVM SDK 了！

**推荐第一步：**
```powershell
cd packages\react-showcase
pnpm start
```

然后在浏览器中打开 `http://localhost:3000`，连接钱包，开始探索加密计算的世界！

