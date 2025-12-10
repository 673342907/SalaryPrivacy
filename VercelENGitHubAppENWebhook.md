# 🔍 Vercel 使用 GitHub App 而非传统 Webhook

## 🔍 问题分析

**当前状态：**
- ✅ Vercel Dashboard 显示 Git 已连接（"Connected 18m ago"）
- ❌ GitHub Webhooks 页面没有显示 Vercel Webhook

**可能的原因：**
- **Vercel 现在使用 GitHub App 而不是传统 Webhook**（新版本的 Vercel）
- GitHub App 不会在 Webhooks 页面显示，而是在 GitHub Apps 页面显示

## ✅ 解决方案

### 方案 1: 检查 GitHub App（最重要）

**Vercel 可能使用 GitHub App 集成：**

1. **在 GitHub 上检查 GitHub Apps**
   - 访问：https://github.com/settings/installations
   - 或者：https://github.com/673342907/SalaryPrivacy/settings/installations
   - 查找 **"Vercel"** 应用
   - 确认状态是 **"Active"**

2. **如果 Vercel App 存在**
   - 说明 Vercel 使用 GitHub App 集成
   - 这是正常的，不需要传统 Webhook
   - 继续下一步

3. **如果 Vercel App 不存在**
   - 可能需要重新授权
   - 或者在 Vercel Dashboard 中重新连接

### 方案 2: 使用 Deploy Hooks 手动触发部署

**即使没有自动 Webhook，可以使用 Deploy Hooks 手动触发：**

1. **在 Vercel Dashboard 中**
   - Settings → Git → 滚动到底部
   - 找到 **"Deploy Hooks"** 部分

2. **创建 Deploy Hook**
   - **Name**: `Manual Deploy`
   - **Branch**: `main`
   - 点击 **"Create Hook"**

3. **获取 Hook URL**
   - 复制生成的 Hook URL
   - 这个 URL 可以用来手动触发部署

4. **使用 Hook 触发部署**
   - 使用 curl 或浏览器访问 Hook URL
   - 或者使用 GitHub Actions 在推送时调用

### 方案 3: 检查 Vercel 的自动部署设置

**即使使用 GitHub App，也需要确认自动部署已启用：**

1. **Settings → Git**
   - 确认 **"Connected"** 状态
   - 确认 **"Automatic deployments from Git"** 已启用（如果有这个选项）

2. **Settings → General**
   - 确认 **"Production Branch"** 是 `main`
   - 确认 **"Root Directory"** 是 **留空**

### 方案 4: 手动触发部署并观察

**即使没有自动 Webhook，手动触发应该使用最新提交：**

1. **Deployments → "Redeploy"**
   - 点击 **"Redeploy"**
   - **取消勾选** "Use existing Build Cache"
   - 点击 **"Redeploy"**

2. **观察构建日志**
   - 确认提交是否是 `3a143ff`（不是 `13efed2`）
   - 如果仍然是 `13efed2`，说明有其他问题

## 🎯 推荐操作流程

### 步骤 1: 检查 GitHub App

1. **访问 GitHub App 设置**
   - https://github.com/settings/installations
   - 或者：https://github.com/673342907/SalaryPrivacy/settings/installations

2. **查找 Vercel App**
   - 应该会看到 **"Vercel"** 应用
   - 确认状态是 **"Active"**
   - 确认有访问 `673342907/SalaryPrivacy` 的权限

### 步骤 2: 在 Vercel Dashboard 中手动触发部署

1. **Deployments → "Redeploy"**
   - 点击 **"Redeploy"**
   - **取消勾选** "Use existing Build Cache"
   - 点击 **"Redeploy"**

2. **观察构建日志的第一行**
   - 应该显示：`克隆 github.com/673342907/SalaryPrivacy（分支：main，提交：3a143ff）`
   - 如果显示 `3a143ff`，说明连接正常，只是自动部署可能有问题
   - 如果仍然显示 `13efed2`，说明有更深层的问题

### 步骤 3: 创建 Deploy Hook（备选方案）

**如果自动部署不工作，可以使用 Deploy Hook：**

1. **Settings → Git → Deploy Hooks**
   - **Name**: `Manual Deploy`
   - **Branch**: `main`
   - 点击 **"Create Hook"**

2. **使用 Hook 触发部署**
   - 复制 Hook URL
   - 使用 curl 或浏览器访问：
   ```powershell
   curl -X POST "你的HookURL"
   ```

## 🔍 诊断步骤

### 检查 1: 确认 Vercel 使用 GitHub App

**如果 GitHub App 存在：**
- ✅ 这是正常的，Vercel 使用 GitHub App 而不是传统 Webhook
- ✅ 不需要在 Webhooks 页面看到 Webhook
- ✅ 继续检查自动部署是否工作

**如果 GitHub App 不存在：**
- ❌ 可能需要重新授权
- ❌ 或者在 Vercel Dashboard 中重新连接

### 检查 2: 测试手动部署

**手动触发部署，观察使用的提交：**
- 如果使用 `3a143ff`：说明连接正常，只是自动部署可能有问题
- 如果仍然使用 `13efed2`：说明 Git 连接有严重问题

### 检查 3: 检查 Vercel 的部署历史

**在 Vercel Dashboard 中：**
- 查看 **Deployments** 历史
- 确认是否有新的部署
- 确认新部署使用的提交是什么

## ✅ 完成后的检查清单

- [ ] 检查 GitHub App 是否存在（https://github.com/settings/installations）
- [ ] Vercel App 状态是 Active
- [ ] 手动触发部署，构建日志显示提交是 `3a143ff`（不是 `13efed2`）
- [ ] 构建日志显示 `cd test-app && npm install`
- [ ] 构建日志显示 Next.js 构建输出
- [ ] 构建时间需要几秒钟（不是 113 毫秒）

## 💡 重要说明

**现代版本的 Vercel 使用 GitHub App 而不是传统 Webhook：**
- GitHub App 不会在 Webhooks 页面显示
- 需要在 GitHub Apps 页面查看
- 功能相同，只是实现方式不同

**如果手动部署使用最新提交，说明连接正常：**
- 自动部署可能只是延迟
- 或者需要等待一段时间
- 或者需要检查 Vercel 的自动部署设置

---

**最重要：先检查 GitHub App，然后手动触发部署观察使用的提交！** 🚀

