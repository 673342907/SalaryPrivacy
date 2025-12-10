# 精确映射表 - 重命名剩余的中文文件名
$renameMap = @{
    "VERCEL_推送新提交.md" = "VERCEL_PUSH_NEW_COMMIT.md"
    "VERCEL_操作步骤.md" = "VERCEL_OPERATION_STEPS.md"
    "VERCEL_最终解决方案.md" = "VERCEL_FINAL_SOLUTION.md"
    "VERCEL_构建状态说明.md" = "VERCEL_BUILD_STATUS.md"
    "VERCEL_检查清单.md" = "VERCEL_CHECKLIST.md"
    "VERCEL_立即操作指南.md" = "VERCEL_IMMEDIATE_GUIDE.md"
    "VERCEL_立即部署.md" = "VERCEL_IMMEDIATE_DEPLOY.md"
    "VERCEL_紧急修复.md" = "VERCEL_URGENT_FIX.md"
    "VERCEL_解决无法重新部署.md" = "VERCEL_FIX_REDEPLOY.md"
    "VERCEL_路径问题修复.md" = "VERCEL_PATH_FIX.md"
    "Vercel显示旧提交-解决方案.md" = "VERCEL_SHOW_OLD_COMMIT_SOLUTION.md"
    "Vercel未检测到新提交-解决方案.md" = "VERCEL_NO_NEW_COMMIT_SOLUTION.md"
    "Vercel构建失败-最终解决方案.md" = "VERCEL_BUILD_FAILED_FINAL_SOLUTION.md"
    "Vercel环境变量配置.md" = "VERCEL_ENV_VARS_CONFIG.md"
    "Vercel资源受限-最终解决方案.md" = "VERCEL_RESOURCE_LIMITED_SOLUTION.md"
    "Vercel连接到错误项目-解决方案.md" = "VERCEL_WRONG_PROJECT_SOLUTION.md"
    "Vercel部署完整检查清单.md" = "VERCEL_DEPLOY_CHECKLIST.md"
    "Vercel部署完整解决方案.md" = "VERCEL_DEPLOY_FULL_SOLUTION.md"
    "优化项目以符合评分要求-完整方案.md" = "OPTIMIZE_FOR_SCORING_PLAN.md"
    "修复Next.js识别问题.md" = "FIX_NEXTJS_DETECTION.md"
    "在Vercel上访问主项目-完整指南.md" = "ACCESS_MAIN_PROJECT_ON_VERCEL.md"
    "彻底解决Next.js检测问题.md" = "FIX_NEXTJS_DETECTION_COMPLETE.md"
    "彻底解决Next.js识别问题.md" = "FIX_NEXTJS_IDENTIFICATION_COMPLETE.md"
    "彻底解决Vercel使用旧提交问题.md" = "FIX_VERCEL_OLD_COMMIT_COMPLETE.md"
    "快速部署测试应用.md" = "QUICK_DEPLOY_TEST_APP.md"
    "手动推送Vercel-详细步骤.md" = "MANUAL_PUSH_VERCEL_STEPS.md"
    "推送最新提交-重要.md" = "PUSH_LATEST_COMMIT_IMPORTANT.md"
    "最终部署指南.md" = "FINAL_DEPLOYMENT_GUIDE.md"
    "本地运行项目指南.md" = "LOCAL_RUN_GUIDE.md"
    "正确启动本地开发服务器.md" = "START_LOCAL_DEV_SERVER.md"
    "深入诊断Vercel使用旧提交.md" = "DIAGNOSE_VERCEL_OLD_COMMIT.md"
    "深度诊断404问题.md" = "DIAGNOSE_404_DEEP.md"
    "立即修复步骤.md" = "IMMEDIATE_FIX_STEPS.md"
    "立即修复设置后404问题.md" = "IMMEDIATE_FIX_404_AFTER_SETUP.md"
    "立即开始优化-第一步.md" = "IMMEDIATE_START_OPTIMIZATION.md"
    "立即操作指南-完成部署.md" = "IMMEDIATE_OPERATION_GUIDE.md"
    "立即操作步骤.md" = "IMMEDIATE_OPERATION_STEPS.md"
    "立即解决404问题.md" = "IMMEDIATE_FIX_404.md"
    "立即解决Vercel构建失败-最佳方案.md" = "IMMEDIATE_FIX_VERCEL_BUILD_FAILED.md"
    "立即部署-选择正确提交.md" = "IMMEDIATE_DEPLOY_CHOOSE_COMMIT.md"
    "简单测试应用部署指南.md" = "SIMPLE_TEST_APP_DEPLOY_GUIDE.md"
    "解决Vercel未同步最新代码-详细步骤.md" = "FIX_VERCEL_SYNC_LATEST_CODE.md"
    "解决Vercel未同步问题-完整方案.md" = "FIX_VERCEL_SYNC_ISSUE_COMPLETE.md"
    "解决Vercel部署问题.md" = "FIX_VERCEL_DEPLOY_ISSUE.md"
    "解决构建日志问题.md" = "FIX_BUILD_LOG_ISSUE.md"
    "解决根目录不存在问题.md" = "FIX_ROOT_DIR_NOT_EXISTS.md"
    "解决设置后直接404问题.md" = "FIX_404_AFTER_SETUP.md"
    "解决路径重复问题-完整方案.md" = "FIX_PATH_DUPLICATE_COMPLETE.md"
    "触发Vercel部署-替代方案.md" = "TRIGGER_VERCEL_DEPLOY_ALTERNATIVE.md"
    "验证Vercel环境变量是否保存成功.md" = "VERIFY_VERCEL_ENV_VARS.md"
}

# test-app 目录的文件
$testAppMap = @{
    "本地测试指南.md" = "LOCAL_TEST_GUIDE.md"
    "构建说明.md" = "BUILD_INSTRUCTIONS.md"
    "测试结果.md" = "TEST_RESULTS.md"
}

$rootDir = Get-Location
$renamedCount = 0

# 重命名根目录的文件
foreach ($oldName in $renameMap.Keys) {
    $newName = $renameMap[$oldName]
    $oldPath = Join-Path $rootDir $oldName
    if (Test-Path $oldPath) {
        $newPath = Join-Path $rootDir $newName
        if (-not (Test-Path $newPath)) {
            Rename-Item -Path $oldPath -NewName $newName -ErrorAction SilentlyContinue
            Write-Host "Renamed: $oldName -> $newName"
            $renamedCount++
        } else {
            Write-Host "Skipped: $oldName (target exists: $newName)"
        }
    }
}

# 重命名 test-app 目录的文件
$testAppDir = Join-Path $rootDir "test-app"
if (Test-Path $testAppDir) {
    foreach ($oldName in $testAppMap.Keys) {
        $newName = $testAppMap[$oldName]
        $oldPath = Join-Path $testAppDir $oldName
        if (Test-Path $oldPath) {
            $newPath = Join-Path $testAppDir $newName
            if (-not (Test-Path $newPath)) {
                Rename-Item -Path $oldPath -NewName $newName -ErrorAction SilentlyContinue
                Write-Host "Renamed test-app: $oldName -> $newName"
                $renamedCount++
            } else {
                Write-Host "Skipped test-app: $oldName (target exists: $newName)"
            }
        }
    }
}

Write-Host "`nTotal renamed: $renamedCount files"

