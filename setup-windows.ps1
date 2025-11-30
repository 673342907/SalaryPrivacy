# Windows 环境设置脚本
# 使用方法: .\setup-windows.ps1

Write-Host "🔧 FHEVM SDK Windows 环境设置" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# 检查 Node.js
Write-Host "检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js 已安装: $nodeVersion" -ForegroundColor Green
        
        # 检查版本是否 >= 20
        $versionMatch = $nodeVersion | Select-String -Pattern "v(\d+)" -AllMatches
        if ($versionMatch) {
            $versionNumber = [int]$versionMatch.Matches[0].Groups[1].Value
            if ($versionNumber -lt 20) {
                Write-Host "⚠️  警告: Node.js 版本低于 20，建议升级到 20.x 或更高版本" -ForegroundColor Yellow
            }
        }
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ 错误: 未找到 Node.js" -ForegroundColor Red
    Write-Host "   请访问 https://nodejs.org/ 下载并安装 Node.js LTS 版本" -ForegroundColor Yellow
    exit 1
}

# 检查 npm
Write-Host "检查 npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm 已安装: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "❌ 错误: 未找到 npm" -ForegroundColor Red
    exit 1
}

# 检查 pnpm
Write-Host "检查 pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ pnpm 已安装: $pnpmVersion" -ForegroundColor Green
    } else {
        throw "pnpm not found"
    }
} catch {
    Write-Host "⚠️  pnpm 未安装，正在安装..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ pnpm 安装成功" -ForegroundColor Green
    } else {
        Write-Host "❌ pnpm 安装失败" -ForegroundColor Red
        Write-Host "   请手动运行: npm install -g pnpm" -ForegroundColor Yellow
        exit 1
    }
}

# 检查 Git
Write-Host "检查 Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git 已安装: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git not found"
    }
} catch {
    Write-Host "⚠️  警告: 未找到 Git（可选，但推荐安装）" -ForegroundColor Yellow
    Write-Host "   请访问 https://git-scm.com/download/win 下载 Git" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 安装项目依赖..." -ForegroundColor Yellow
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 依赖安装失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔨 构建 SDK..." -ForegroundColor Yellow
pnpm sdk:build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ SDK 构建失败" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ 环境设置完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📚 下一步：" -ForegroundColor Cyan
Write-Host "   1. 运行 React 展示: .\start-react.ps1" -ForegroundColor White
Write-Host "   2. 运行 Node.js 展示: .\start-node.ps1" -ForegroundColor White
Write-Host "   3. 查看完整指南: 阅读 WINDOWS_GUIDE.md" -ForegroundColor White
Write-Host ""
