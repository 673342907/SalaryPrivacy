# 解决 Vercel 构建失败 - 缺少 ALCHEMY_API_KEY

## 问题诊断

构建失败原因：
```
Error: Environment variable NEXT_PUBLIC_ALCHEMY_API_KEY is required in production.
```

这是一个必需的环境变量，用于连接 Alchemy RPC 节点。

## 解决方案

### 方案 1：在 Vercel 中添加环境变量（推荐）

#### 步骤：

1. **访问 Vercel 环境变量设置**
   - 打开：https://vercel.com/673342907s-projects/salary-privacy/settings/environment-variables

2. **添加环境变量**
   - 点击 "Add New" 或 "Add Environment Variable"
   - 输入：
     - **Key**: `NEXT_PUBLIC_ALCHEMY_API_KEY`
     - **Value**: 你的 Alchemy API Key（见下方获取方法）
     - **Environment**: 选择 "Production, Preview, Development"（全选）
   - 点击 "Save"

3. **获取 Alchemy API Key**
   - 访问：https://www.alchemy.com/
   - 注册/登录账户
   - 创建新应用或使用现有应用
   - 复制 API Key

4. **重新部署**
   - 返回 "Deployments" 页面
   - 点击最新部署的 "..." → "Redeploy"
   - 或点击 "Deploy" 按钮重新部署

### 方案 2：使用公共 RPC 端点（临时方案）

如果不想使用 Alchemy，可以修改代码使用公共 RPC 端点。但这需要修改代码。

### 方案 3：检查代码中的使用

检查代码中 `NEXT_PUBLIC_ALCHEMY_API_KEY` 的使用位置，看是否可以设为可选。

## 快速解决步骤

1. ✅ 访问 Vercel 环境变量设置
2. ✅ 添加 `NEXT_PUBLIC_ALCHEMY_API_KEY` 环境变量
3. ✅ 获取 Alchemy API Key（如果没有）
4. ✅ 重新部署

## 注意事项

- ⚠️ Alchemy API Key 是公开的（因为是 `NEXT_PUBLIC_`），但建议使用只读权限的 Key
- ⚠️ 如果使用免费套餐，有请求限制
- ⚠️ 可以创建多个 Key 用于不同环境

## 获取 Alchemy API Key 详细步骤

1. 访问 https://www.alchemy.com/
2. 点击 "Sign Up" 或 "Log In"
3. 创建新应用：
   - 选择网络（Sepolia 测试网或主网）
   - 输入应用名称
4. 在应用详情页面，找到 "API Key"
5. 复制 API Key
6. 在 Vercel 中添加到环境变量


