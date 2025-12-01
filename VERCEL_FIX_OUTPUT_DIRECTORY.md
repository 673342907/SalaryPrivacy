# 修复 Vercel 输出目录错误

## 错误信息

```
构建完成后未找到名为"build"的输出目录。请更新 vercel.json#outputDirectory 以确保生成正确的输出目录。
```

## 问题原因

这个错误通常由以下原因引起：

1. **构建命令失败** - 如果构建过程中出现错误，`build` 目录不会被创建
2. **工作目录不正确** - 构建命令在错误的目录执行
3. **输出路径配置错误** - `outputDirectory` 路径不正确

## 解决方案

### ✅ 方案 1: 使用已修复的 vercel.json（推荐）

项目根目录的 `vercel.json` 已更新，包含正确的配置：

```json
{
  "version": 2,
  "buildCommand": "pnpm sdk:build && cd packages/confidential-salary-frontend && pnpm build",
  "outputDirectory": "packages/confidential-salary-frontend/build",
  "installCommand": "pnpm install"
}
```

**操作步骤**：
1. 确保 `vercel.json` 已提交到 Git 仓库
2. 在 Vercel Dashboard 中，进入项目设置
3. 确保 **Root Directory** 留空（使用项目根目录）
4. 重新部署

### ✅ 方案 2: 在 Vercel Dashboard 中手动配置

如果 `vercel.json` 不生效，可以在 Dashboard 中手动设置：

1. 进入项目 **Settings** → **General**
2. 找到 **Build & Development Settings**
3. 配置以下设置：
   - **Framework Preset**: `Other`
   - **Root Directory**: 留空
   - **Build Command**: 
     ```bash
     pnpm sdk:build && cd packages/confidential-salary-frontend && pnpm build
     ```
   - **Output Directory**: 
     ```
     packages/confidential-salary-frontend/build
     ```
   - **Install Command**: 
     ```bash
     pnpm install
     ```
   - **Node.js Version**: `20.x`

4. 点击 **Save**
5. 重新部署

### ✅ 方案 3: 验证构建命令

在本地测试构建命令，确保能成功生成 `build` 目录：

```bash
# 在项目根目录执行
pnpm install
pnpm sdk:build
cd packages/confidential-salary-frontend
pnpm build

# 检查 build 目录是否存在
ls -la build
# 或 Windows PowerShell
Test-Path build
```

如果本地构建成功，Vercel 构建也应该成功。

## 调试步骤

### 1. 检查构建日志

在 Vercel Dashboard 中：
1. 进入 **Deployments**
2. 点击失败的部署
3. 查看 **Build Logs**
4. 查找错误信息（红色文本）

### 2. 常见构建错误

#### 错误: "Cannot find module '@fhevm-sdk'"
**原因**: SDK 未构建
**解决**: 确保构建命令包含 `pnpm sdk:build`

#### 错误: "Command failed with exit code 1"
**原因**: 构建过程中出现错误
**解决**: 查看详细错误信息，通常是 TypeScript 编译错误或依赖问题

#### 错误: "Build exceeded maximum build time"
**原因**: 构建时间超过 45 分钟（免费版限制）
**解决**: 
- 优化构建过程
- 使用构建缓存
- 考虑升级到 Pro 计划

### 3. 验证输出目录

构建成功后，检查以下路径是否存在：

```
packages/confidential-salary-frontend/build/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── ...
```

## 完整的构建命令（调试用）

如果需要更详细的输出，可以使用：

```bash
pnpm install && \
pnpm sdk:build && \
cd packages/confidential-salary-frontend && \
pnpm build && \
echo "Build completed. Checking output..." && \
ls -la build
```

## 如果问题仍然存在

1. **检查 Git 提交**
   - 确保 `vercel.json` 已提交
   - 确保所有必要的文件都在仓库中

2. **清理并重新部署**
   - 在 Vercel Dashboard 中，进入项目设置
   - 找到 **Build & Development Settings**
   - 清除构建缓存
   - 重新部署

3. **联系支持**
   - 提供完整的构建日志
   - 说明已尝试的解决方案

## 验证修复

修复后，成功的部署应该显示：
- ✅ Build completed
- ✅ Output directory found: `packages/confidential-salary-frontend/build`
- ✅ Deployment ready


