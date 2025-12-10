# 🧪 test-app 本地测试指南

## ✅ 已完成的步骤

1. ✅ 安装依赖：`npm install`
2. ✅ 启动开发服务器：`npm run dev`

## 🌐 访问应用

开发服务器应该运行在：
- **URL**: http://localhost:3000
- **端口**: 3000（如果被占用，Next.js 会自动使用下一个可用端口）

## 📋 测试步骤

### 1. 打开浏览器

访问 http://localhost:3000

你应该看到：
- ✅ 标题："🚀 Vercel 测试应用"
- ✅ 说明文字
- ✅ 当前时间显示

### 2. 检查功能

- [ ] 页面正常加载
- [ ] 样式正确显示
- [ ] 时间动态更新（刷新页面查看）

### 3. 测试构建（模拟 Vercel 部署）

在终端中运行：

```powershell
cd test-app
npm run build
```

如果构建成功，你会看到：
- ✅ 构建完成信息
- ✅ `.next` 目录被创建

### 4. 测试生产模式

```powershell
npm run start
```

然后访问 http://localhost:3000（生产模式）

## 🔍 常见问题

### 端口被占用

如果 3000 端口被占用，Next.js 会自动使用 3001、3002 等。

查看终端输出，找到实际使用的端口。

### 构建错误

如果 `npm run build` 失败：
1. 检查 TypeScript 错误
2. 检查依赖是否完整安装
3. 查看错误信息

### 样式问题

如果页面样式不对：
- 检查 `app/layout.tsx` 是否正确
- 检查是否有 CSS 文件缺失

## ✅ 验证清单

在部署到 Vercel 前，确保：

- [ ] 本地开发服务器运行正常
- [ ] 页面可以正常访问
- [ ] `npm run build` 构建成功
- [ ] 没有 TypeScript 错误
- [ ] 没有控制台错误

## 🚀 下一步

如果本地测试成功，可以：

1. **提交更改到 Git**
   ```powershell
   git add test-app/
   git commit -m "更新 test-app 配置"
   git push
   ```

2. **在 Vercel 中部署**
   - 按照 `立即操作步骤.md` 中的指南操作

