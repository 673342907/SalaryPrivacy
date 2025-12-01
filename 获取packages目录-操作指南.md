# 📦 获取 packages 目录 - 完整操作指南

## 🎯 目标

获取 `packages` 目录并添加到 Git，以便在 Vercel 上成功部署。

## 方法 1: 从 GitHub 网页下载（推荐，最简单）

### 步骤 1: 访问原始模板仓库

1. 打开浏览器，访问：
   ```
   https://github.com/zama-ai/fhevm-react-template
   ```

2. 如果仓库是私有的或不存在，尝试：
   ```
   https://github.com/zama-ai/fhevm-react-template-main
   ```
   或者搜索 "fhevm-react-template"

### 步骤 2: 下载 packages 目录

**选项 A: 使用 GitHub 的下载功能**

1. 在仓库页面，找到 `packages` 文件夹
2. 点击进入 `packages` 目录
3. 点击绿色的 **"Code"** 按钮
4. 选择 **"Download ZIP"**
5. 解压 ZIP 文件
6. 将 `packages` 文件夹复制到你的项目根目录

**选项 B: 使用 GitZip 浏览器扩展**

1. 安装 GitZip 扩展（Chrome/Firefox）
2. 在 GitHub 仓库页面，点击 `packages` 文件夹
3. 使用 GitZip 下载整个 `packages` 目录

**选项 C: 使用 DownGit 工具**

1. 访问：https://minhaskamal.github.io/DownGit/#/home
2. 输入仓库 URL：`https://github.com/zama-ai/fhevm-react-template/tree/main/packages`
3. 点击下载

## 方法 2: 使用 Git 命令行（如果网络允许）

```powershell
# 在项目父目录执行
cd E:\code\fhe\ggg\fhevm-react-template-main

# 克隆仓库（浅克隆，只获取最新版本）
git clone --depth 1 https://github.com/zama-ai/fhevm-react-template.git temp-template

# 复制 packages 目录
Copy-Item -Path "temp-template\packages" -Destination "SalaryPrivacy\packages" -Recurse

# 清理临时目录
Remove-Item -Path "temp-template" -Recurse -Force

# 回到项目目录
cd SalaryPrivacy
```

## 方法 3: 从其他位置复制

如果你在其他地方有完整的 `fhevm-react-template` 项目：

```powershell
# 找到包含 packages 的目录
$sourcePath = "E:\path\to\fhevm-react-template\packages"
$targetPath = "E:\code\fhe\ggg\fhevm-react-template-main\SalaryPrivacy\packages"

# 复制
Copy-Item -Path $sourcePath -Destination $targetPath -Recurse
```

## 📋 验证 packages 目录

复制完成后，验证目录结构：

```powershell
# 检查 packages 是否存在
if (Test-Path packages) {
    Write-Host "✅ packages 目录存在" -ForegroundColor Green
    
    # 列出子目录
    Write-Host "`n包含的子目录：" -ForegroundColor Cyan
    Get-ChildItem packages -Directory | Select-Object Name
    
    # 检查源代码文件
    $sourceFiles = Get-ChildItem packages -Recurse -File | 
        Where-Object { $_.Extension -in '.ts', '.tsx', '.js', '.jsx', '.json' } | 
        Select-Object -First 10
    
    if ($sourceFiles) {
        Write-Host "`n✅ 找到源代码文件（示例）：" -ForegroundColor Green
        $sourceFiles | ForEach-Object { Write-Host "  $($_.Name)" }
    } else {
        Write-Host "`n⚠️ 未找到源代码文件" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ packages 目录不存在" -ForegroundColor Red
}
```

## ✅ 添加到 Git

### 步骤 1: 检查哪些文件会被添加

```powershell
# 查看会被添加的文件（不实际添加）
git add packages/ --dry-run | Select-Object -First 20

# 确认没有 node_modules 被添加
git status packages/ | Select-String "node_modules"
```

**重要**: 应该看到源代码文件（.ts, .tsx, .js, .json），但**不应该**看到 `node_modules` 或 `dist`。

### 步骤 2: 添加到 Git

```powershell
# 添加 packages 目录
git add packages/

# 检查状态
git status
```

### 步骤 3: 提交

```powershell
git commit -m "添加 packages 源代码目录"
```

### 步骤 4: 推送到 GitHub

```powershell
git push
```

如果推送失败（网络问题），可以稍后重试，或者使用 GitHub Desktop 等工具。

## 🔍 最终验证

### 1. 检查 GitHub 仓库

访问：https://github.com/673342907/SalaryPrivacy

确认：
- ✅ `packages` 目录存在
- ✅ 可以看到源代码文件
- ✅ 没有 `node_modules` 目录

### 2. 在 Vercel 上重新部署

1. 访问 https://vercel.com
2. 进入你的项目
3. 点击 **"Redeploy"** 或等待自动部署
4. 查看构建日志，确认成功

## ⚠️ 注意事项

### 确保 .gitignore 正确

检查 `.gitignore` 文件，确保包含：

```
packages/*/node_modules
packages/*/dist
packages/*/.env
```

但**不包含**：
```
packages/
```

### 如果 packages 目录很大

如果 `packages` 目录包含很多文件：

1. 确保只添加源代码，不添加 `node_modules` 和 `dist`
2. 如果文件太多，Git 可能较慢，这是正常的
3. 首次推送可能需要一些时间

## 🆘 如果遇到问题

### 问题 1: 找不到原始模板仓库

**解决方案**:
- 检查仓库 URL 是否正确
- 确认仓库是公开的
- 或者联系项目维护者获取访问权限

### 问题 2: 下载的文件不完整

**解决方案**:
- 重新下载
- 使用 Git 命令行方式（如果网络允许）
- 检查 ZIP 文件是否完整

### 问题 3: Git 推送失败

**解决方案**:
- 检查网络连接
- 使用 GitHub Desktop 等 GUI 工具
- 或者稍后重试

## 📝 快速检查清单

- [ ] 获取了 `packages` 目录
- [ ] `packages` 目录包含源代码文件
- [ ] 运行 `git status` 确认没有 `node_modules` 被添加
- [ ] 提交到 Git
- [ ] 推送到 GitHub
- [ ] 在 GitHub 上验证 `packages` 目录存在
- [ ] 在 Vercel 上重新部署
- [ ] 验证构建成功

---

**现在开始获取 packages 目录吧！** 🚀

推荐使用方法 1（从 GitHub 网页下载），最简单直接。


