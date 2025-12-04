#!/bin/bash

# 自动部署脚本：GitHub + Vercel
# 使用方法: ./deploy.sh "提交信息"

set -e

echo "=========================================="
echo "🚀 开始自动部署流程"
echo "=========================================="

# 检查是否有未提交的更改
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ 没有需要提交的更改"
else
    echo "📝 发现未提交的更改，开始提交..."
    
    # 添加所有更改
    git add .
    
    # 提交信息
    COMMIT_MSG=${1:-"优化代码：根据 Zama Bounty 要求改进"}
    echo "📝 提交信息: $COMMIT_MSG"
    
    # 提交
    git commit -m "$COMMIT_MSG"
    
    # 推送到 GitHub
    echo "📤 推送到 GitHub..."
    git push origin main
    
    echo "✅ GitHub 推送完成"
fi

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI 未安装，跳过 Vercel 部署"
    echo "💡 安装 Vercel CLI: npm i -g vercel"
    exit 0
fi

# 部署到 Vercel
echo "🌐 部署到 Vercel..."
cd packages/nextjs

# 检查是否已经链接到 Vercel 项目
if [ ! -f ".vercel/project.json" ]; then
    echo "🔗 首次部署，需要链接 Vercel 项目..."
    vercel --yes
else
    echo "🚀 部署到生产环境..."
    vercel --prod --yes
fi

cd ../..

echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo "📋 GitHub: https://github.com/673342907/SalaryPrivacy"
echo "🌐 Vercel: 检查 Vercel 仪表板获取部署 URL"

