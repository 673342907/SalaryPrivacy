# 📦 test-app 构建说明

## 🔍 为什么根目录没有 `build` 脚本？

这个项目是 **monorepo**（使用 pnpm workspaces），结构如下：

```
SalaryPrivacy/
├── package.json          # 根目录配置（monorepo）
├── packages/             # 工作区目录
│   ├── fhevm-sdk/
│   ├── nextjs/
│   └── hardhat/
└── test-app/             # 独立应用（不在工作区中）
    └── package.json      # 自己的配置
```

**原因：**
- 根目录的 `package.json` 只管理 `packages/*` 下的项目
- `test-app` 是独立应用，不在工作区中
- 所以需要在 `test-app` 目录中单独构建

## ✅ 正确的构建方法

### 方法 1: 进入 test-app 目录（推荐）

```powershell
cd test-app
npm run build
```

### 方法 2: 在根目录直接构建

```powershell
cd test-app; npm run build
```

### 方法 3: 使用完整路径

```powershell
npm run build --prefix test-app
```

## 🚀 可选：在根目录添加 build 脚本

如果你想在根目录直接运行 `npm run build:test-app`，可以：

### 方案 A: 使用 npm（简单）

在根目录的 `package.json` 中添加：

```json
{
  "scripts": {
    "build:test-app": "cd test-app && npm run build"
  }
}
```

### 方案 B: 使用 pnpm（与项目一致）

在根目录的 `package.json` 中添加：

```json
{
  "scripts": {
    "build:test-app": "npm run build --prefix test-app"
  }
}
```

## 📋 当前构建结果

✅ **构建成功！**

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (4/4)
✓ Collecting build traces
✓ Finalizing page optimization
```

**输出：**
- 主页面：127 B
- First Load JS：102 kB
- 所有页面都成功生成为静态内容

## ⚠️ 警告说明

Next.js 检测到多个 lockfile：
- `pnpm-lock.yaml`（根目录）
- `package-lock.json`（test-app 目录）

**这个警告不影响功能**，但如果你想消除警告：

1. **删除 test-app 的 package-lock.json**（如果使用 pnpm）
2. **或者在 next.config.js 中设置 `outputFileTracingRoot`**

## 💡 建议

对于 `test-app`，建议：
- 保持独立构建（`cd test-app && npm run build`）
- 或者添加便捷脚本到根目录的 `package.json`



