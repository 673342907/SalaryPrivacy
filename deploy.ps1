# 自动部署脚本：GitHub + Vercel (PowerShell)
# 使用方法: .\deploy.ps1 "提交信息"

param(
    [string]$CommitMessage = "优化代码：根据 Zama Bounty 要求改进"
)

Write-Host "==========================================" -ForegroundColor Green
Write-Host "🚀 开始自动部署流程" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# 检查 Git 状态
$gitStatus = git status --porcelain
if ([string]::IsNullOrWhiteSpace($gitStatus)) {
    Write-Host "✅ 没有需要提交的更改" -ForegroundColor Yellow
} else {
    Write-Host "📝 发现未提交的更改，开始提交..." -ForegroundColor Cyan
    
    # 添加所有更改
    git add .
    
    Write-Host "📝 提交信息: $CommitMessage" -ForegroundColor Cyan
    
    # 提交
    git commit -m $CommitMessage
    
    # 推送到 GitHub
    Write-Host "📤 推送到 GitHub..." -ForegroundColor Cyan
    git push origin main
    
    Write-Host "✅ GitHub 推送完成" -ForegroundColor Green
}

# 检查是否安装了 Vercel CLI
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI 已安装: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Vercel CLI 未安装，跳过 Vercel 部署" -ForegroundColor Yellow
    Write-Host "💡 安装 Vercel CLI: npm i -g vercel" -ForegroundColor Cyan
    exit 0
}

# 部署到 Vercel
Write-Host "🌐 部署到 Vercel..." -ForegroundColor Cyan
Set-Location packages/nextjs

# 检查是否已经链接到 Vercel 项目
if (-not (Test-Path ".vercel/project.json")) {
    Write-Host "🔗 首次部署，需要链接 Vercel 项目..." -ForegroundColor Yellow
    vercel --yes
} else {
    Write-Host "🚀 部署到生产环境..." -ForegroundColor Cyan
    vercel --prod --yes
}

Set-Location ../..

Write-Host "==========================================" -ForegroundColor Green
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "📋 GitHub: https://github.com/673342907/SalaryPrivacy" -ForegroundColor Cyan
Write-Host "🌐 Vercel: 检查 Vercel 仪表板获取部署 URL" -ForegroundColor Cyan

