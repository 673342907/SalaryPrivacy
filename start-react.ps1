# React 展示应用启动脚本
# 使用方法: .\start-react.ps1

Write-Host "🚀 启动 React FHEVM 展示应用..." -ForegroundColor Green
Write-Host ""

# 检查是否在项目根目录
if (-not (Test-Path "packages\react-showcase")) {
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
Write-Host "✅ 准备就绪！正在启动 React 应用..." -ForegroundColor Green
Write-Host "📱 应用将在 http://localhost:3000 打开" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 提示:" -ForegroundColor Yellow
Write-Host "   - 确保已安装 MetaMask 浏览器扩展" -ForegroundColor Yellow
Write-Host "   - 连接到 Sepolia 测试网" -ForegroundColor Yellow
Write-Host "   - 确保钱包中有 Sepolia ETH" -ForegroundColor Yellow
Write-Host ""

# 启动应用
Set-Location packages\react-showcase
pnpm start

