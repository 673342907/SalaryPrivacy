# Vercel 部署检查清单

## 🔍 请检查以下设置

### 1. Root Directory 设置（最重要！）

在 Vercel Dashboard 中：
- 进入项目 → **Settings** → **General**
- 找到 **Root Directory** 设置
- **必须为空**（不要填写任何内容）
- 如果填写了内容，请清空并保存

### 2. Build & Development Settings

在 **Settings** → **General** → **Build & Development Settings** 中：

**Build Command**:
```
bash scripts/build-for-vercel.sh
```

或者：
```
pnpm --filter ./packages/fhevm-sdk build && cd packages/confidential-salary-frontend && pnpm build && cd ../.. && ls -la packages/confidential-salary-frontend/build
```

**Output Directory**:
```
packages/confidential-salary-frontend/build
```

**Install Command**:
```
pnpm install --frozen-lockfile
```

**Node.js Version**: `20.x`

### 3. 构建日志中需要查找的信息

请提供构建日志中的以下信息：

1. **构建是否成功？**
   - 查找 "Compiled successfully" 或 "Build folder is ready"
   - 查找 "Build completed"

2. **工作目录是什么？**
   - 查找 "Current directory: ..."
   - 查找 "Changed to: ..."

3. **build 目录是否存在？**
   - 查找 "Build directory found" 或 "Build directory not found"
   - 查找任何关于 "build" 目录的消息

4. **错误信息**
   - 所有红色错误文本
   - "exited with 1" 之前的最后几行
   - 任何关于路径的错误

## 📋 请提供的信息

1. **完整的构建日志文本**（从开始到结束）
2. **错误信息**（如果有）
3. **Root Directory 的当前设置**（是否为空？）
4. **Build Command 的当前设置**（是什么？）

## 🔧 快速修复尝试

如果构建日志显示构建成功但找不到目录，尝试：

### 方法 1: 清空 Root Directory

1. Settings → General
2. Root Directory → 清空
3. Save
4. 重新部署

### 方法 2: 使用绝对路径验证

在 Build Command 中添加：
```bash
pnpm --filter ./packages/fhevm-sdk build && \
cd packages/confidential-salary-frontend && \
pnpm build && \
cd ../.. && \
echo "Current directory: $(pwd)" && \
echo "Checking build directory..." && \
ls -la packages/confidential-salary-frontend/build && \
echo "Build directory exists at: $(pwd)/packages/confidential-salary-frontend/build"
```

### 方法 3: 检查 vercel.json

确保项目根目录有 `vercel.json` 文件，并且已提交到 Git。

