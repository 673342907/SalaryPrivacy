# 验证 packages 目录脚本
# 在下载并复制 packages 目录后运行此脚本

Write-Host "`n=== 验证 packages 目录 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 packages 是否存在
if (Test-Path packages) {
    Write-Host "✅ packages 目录存在" -ForegroundColor Green
    Write-Host ""
    
    # 列出子目录
    Write-Host "包含的子目录：" -ForegroundColor Cyan
    $dirs = Get-ChildItem packages -Directory
    $dirs | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor White }
    Write-Host ""
    
    # 检查源代码文件
    Write-Host "检查源代码文件..." -ForegroundColor Cyan
    $sourceFiles = Get-ChildItem packages -Recurse -File | 
        Where-Object { $_.Extension -in '.ts', '.tsx', '.js', '.jsx', '.json' } | 
        Select-Object -First 20
    
    if ($sourceFiles) {
        Write-Host "✅ 找到源代码文件（显示前 10 个）：" -ForegroundColor Green
        $sourceFiles | Select-Object -First 10 | ForEach-Object { 
            $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "")
            Write-Host "  $relativePath" -ForegroundColor Gray
        }
        Write-Host ""
    } else {
        Write-Host "⚠️ 未找到源代码文件" -ForegroundColor Yellow
        Write-Host ""
    }
    
    # 检查是否有 node_modules（不应该有）
    $nodeModules = Get-ChildItem packages -Recurse -Directory -Filter "node_modules" -ErrorAction SilentlyContinue
    if ($nodeModules) {
        Write-Host "⚠️ 警告：发现 node_modules 目录" -ForegroundColor Yellow
        Write-Host "  这些目录应该在 .gitignore 中，不会被添加到 Git" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "✅ 未发现 node_modules 目录（正确）" -ForegroundColor Green
        Write-Host ""
    }
    
    # 检查 Git 状态
    Write-Host "检查 Git 状态..." -ForegroundColor Cyan
    $gitStatus = git status packages/ 2>&1
    if ($gitStatus -match "Untracked files" -or $gitStatus -match "Changes to be committed") {
        Write-Host "✅ packages 目录中有未跟踪的文件" -ForegroundColor Green
        Write-Host "  运行 'git add packages/' 来添加它们" -ForegroundColor Gray
    } else {
        Write-Host "ℹ️ packages 目录已在 Git 中" -ForegroundColor Blue
    }
    Write-Host ""
    
    Write-Host "=== 验证完成 ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "下一步操作：" -ForegroundColor Cyan
    Write-Host "1. 运行: git add packages/" -ForegroundColor White
    Write-Host "2. 运行: git commit -m '添加 packages 目录'" -ForegroundColor White
    Write-Host "3. 运行: git push" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "❌ packages 目录不存在" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先下载并复制 packages 目录到项目根目录" -ForegroundColor Yellow
    Write-Host "参考: 获取packages目录-操作指南.md" -ForegroundColor Gray
    Write-Host ""
}

