# 🚀 Vercel 测试应用

这是一个简单的 Next.js 测试应用，用于验证 Vercel 部署配置。

## 📋 功能

- 简单的 Next.js 15 应用
- TypeScript 支持
- 显示当前时间
- 用于测试 Vercel 部署

## 🚀 部署到 Vercel

### 方法 1: 通过 Vercel Dashboard

1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 选择这个目录或创建一个新仓库
4. 导入项目
5. Vercel 会自动检测 Next.js 并部署

### 方法 2: 使用 Vercel CLI

```bash
cd test-app
vercel
```

## ✅ 验证

部署成功后，访问提供的 URL，应该看到：
- ✅ "Vercel 测试应用" 标题
- ✅ "部署成功" 消息
- ✅ 当前时间显示

## 📝 说明

这个应用非常简单，只包含：
- 一个页面 (`app/page.tsx`)
- 基本布局 (`app/layout.tsx`)
- Next.js 配置
- TypeScript 配置

没有复杂的依赖或构建步骤，用于验证 Vercel 基本部署流程。

