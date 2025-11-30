# Node.js 展示应用启动脚本
# 使用方法: .\start-node.ps1

Write-Host "🖥️  启动 Node.js FHEVM 展示应用..." -ForegroundColor Green
Write-Host ""

# 检查是否在项目根目录
if (-not (Test-Path "packages\node-showcase")) {
    Write-Host "❌ 错误: 请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 检查 pnpm 是否安装
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm 已安装 (版本: $pnpmVersion)" -ForegroundColor Green
} catch {
    Write-Host "❌ 错误: 未找到 pnpm，请先安装: npm install -g pnpm" -ForegroundColor Red
    exit 1
}

# 检查环境变量文件
$envFile = "packages\node-showcase\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  警告: 未找到 .env 文件" -ForegroundColor Yellow
    Write-Host "📝 正在创建 .env 文件模板..." -ForegroundColor Yellow
    Write-Host ""
    
    $envContent = @"
# RPC 节点 URL（使用 Infura 或 Alchemy）
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# 你的钱包私钥（用于签名交易）
PRIVATE_KEY=your_private_key_here

# 链 ID（Sepolia 测试网）
CHAIN_ID=11155111
"@
    
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✅ 已创建 .env 文件模板" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  请编辑 $envFile 文件，填入你的配置信息：" -ForegroundColor Yellow
    Write-Host "   1. RPC_URL - 你的 Infura 或 Alchemy RPC URL" -ForegroundColor Yellow
    Write-Host "   2. PRIVATE_KEY - 你的钱包私钥" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "按任意键继续（确保已配置 .env 文件）..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# 检查依赖是否安装
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 首次运行，正在安装依赖..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        exit 1
    }
}

# 检查 SDK 是否构建
if (-not (Test-Path "packages\fhevm-sdk\dist")) {
    Write-Host "🔨 正在构建 SDK..." -ForegroundColor Yellow
    pnpm sdk:build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ SDK 构建失败" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ 准备就绪！" -ForegroundColor Green
Write-Host ""
Write-Host "请选择运行模式：" -ForegroundColor Cyan
Write-Host "  1. 交互式探索器 (推荐) - pnpm explorer" -ForegroundColor White
Write-Host "  2. HTTP 服务器模式 - pnpm start" -ForegroundColor White
Write-Host "  3. 非交互式 CLI - pnpm cli" -ForegroundColor White
Write-Host ""
$choice = Read-Host "请输入选项 (1-3)"

Set-Location packages\node-showcase

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 启动交互式探索器..." -ForegroundColor Green
        pnpm explorer
    }
    "2" {
        Write-Host ""
        Write-Host "🌐 启动 HTTP 服务器..." -ForegroundColor Green
        Write-Host "📡 服务器将在 http://localhost:3001 运行" -ForegroundColor Cyan
        Write-Host ""
        pnpm start
    }
    "3" {
        Write-Host ""
        Write-Host "⚡ 运行非交互式 CLI..." -ForegroundColor Green
        pnpm cli
    }
    default {
        Write-Host "❌ 无效选项，启动交互式探索器..." -ForegroundColor Yellow
        pnpm explorer
    }
}

