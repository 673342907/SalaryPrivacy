# 🔧 修复 pnpm-lock.yaml 不同步问题

## 🐛 问题

Vercel 构建失败，错误信息：
```
ERR_PNPM_OUTDATED_LOCKFILE 无法使用"frozen-lockfile"进行安装，因为 pnpm-lock.yaml 与 package.json 不同步。

lockfile 中的规范与 package.json 中的规范不匹配：
* 新增 12 个依赖项：@fhevm/mock-utils@^0.1.0、@zama-fhe/relayer-sdk@0.2.0、ethers@^6.13.7、...
```

## ✅ 解决方案

### 已完成的修复

1. **更新 lockfile**
   - 运行 `pnpm install` 更新 `pnpm-lock.yaml`
   - 同步所有依赖项

2. **提交更新**
   - 已提交更新后的 `pnpm-lock.yaml` 到 Git

## 🚀 下一步

### 1. 推送到 GitHub

```powershell
git push
```

### 2. Vercel 自动重新部署

推送后，Vercel 会：
- 检测到新的提交
- 使用更新后的 `pnpm-lock.yaml`
- 重新运行构建

## 📋 问题原因

### 为什么会出现这个问题？

1. **依赖更新**
   - `package.json` 中的依赖被更新
   - 但 `pnpm-lock.yaml` 没有同步更新

2. **不同环境**
   - 本地开发环境可能使用了不同的依赖版本
   - lockfile 没有及时更新

3. **CI/CD 要求**
   - Vercel 使用 `--frozen-lockfile` 确保构建一致性
   - 如果 lockfile 不同步，构建会失败

## ⚠️ 重要提示

### 最佳实践

1. **定期更新 lockfile**
   - 每次修改 `package.json` 后运行 `pnpm install`
   - 提交 `pnpm-lock.yaml` 到 Git

2. **使用 frozen-lockfile**
   - 在 CI/CD 环境中使用 `--frozen-lockfile`
   - 确保构建环境的一致性

3. **检查依赖**
   - 定期运行 `pnpm outdated` 检查过时的依赖
   - 更新依赖后及时更新 lockfile

### 如果问题仍然存在

如果推送后仍然失败：

1. **检查构建日志**
   - 查看 Vercel 构建日志
   - 确认错误信息

2. **本地验证**
   ```powershell
   # 删除 node_modules 和 lockfile
   Remove-Item -Recurse -Force node_modules
   Remove-Item pnpm-lock.yaml
   
   # 重新安装
   pnpm install
   
   # 提交
   git add pnpm-lock.yaml
   git commit -m "重新生成 pnpm-lock.yaml"
   git push
   ```

3. **临时方案（不推荐）**
   - 如果急需部署，可以修改 `vercel.json`：
   ```json
   {
     "installCommand": "pnpm install --no-frozen-lockfile"
   }
   ```
   - **注意**: 这会导致构建不一致，不推荐用于生产环境

## 📝 检查清单

- [x] ✅ 运行 `pnpm install` 更新 lockfile
- [x] ✅ 提交 `pnpm-lock.yaml` 到 Git
- [ ] ⏳ 推送到 GitHub
- [ ] ⏳ 验证 Vercel 构建成功

---

**现在推送到 GitHub，Vercel 应该可以成功构建了！** 🚀

