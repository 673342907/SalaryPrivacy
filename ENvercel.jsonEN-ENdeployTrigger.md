# ✅ 修复 vercel.json 错误 - 移除 _deployTrigger

## 🚨 错误信息

**使用 `vercel --prod --force` 时出现错误：**
```
Error: Invalid vercel.json - should NOT have additional property `_deployTrigger`. Please remove it.
```

## 🔍 问题原因

**`vercel.json` 中包含了不支持的属性：**
- `_deployTrigger` 不是 Vercel 支持的标准属性
- Vercel 的 JSON schema 验证拒绝了它

## ✅ 解决方案

**已从 `vercel.json` 中移除了 `_deployTrigger` 属性：**

**修复前：**
```json
{
  "version": 2,
  "buildCommand": "cd test-app && npm install && npm run build",
  "installCommand": "cd test-app && npm install",
  "framework": "nextjs",
  "outputDirectory": "test-app/.next",
  "_deployTrigger": "2025-12-02-11-00-force"  // ❌ 不支持的属性
}
```

**修复后：**
```json
{
  "version": 2,
  "buildCommand": "cd test-app && npm install && npm run build",
  "installCommand": "cd test-app && npm install",
  "framework": "nextjs",
  "outputDirectory": "test-app/.next"
}
```

## 📋 下一步

**现在可以重新执行部署命令：**

```powershell
vercel --prod --force
```

**应该会成功部署！**

## ✅ 验证部署

**部署完成后，检查：**

1. **CLI 显示部署成功**
   - 会显示部署 URL
   - 会显示构建日志

2. **访问部署 URL**
   - 应该看到 "🚀 Vercel 测试应用"

3. **在 Vercel Dashboard 中检查**
   - 进入 Deployments
   - 查看最新部署的构建日志
   - 应该显示：
     - 执行了 `cd test-app && npm install`
     - Next.js 构建成功
     - 路由信息正确

---

**修复完成！现在可以重新执行 `vercel --prod --force` 了！** 🚀




