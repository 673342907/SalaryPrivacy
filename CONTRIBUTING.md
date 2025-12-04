# Contributing to ConfidentialSalary

感谢您对项目的兴趣！本文档将帮助您了解如何为项目做出贡献。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试要求](#测试要求)

---

## 行为准则

本项目遵循以下行为准则：

- 尊重所有贡献者
- 接受建设性批评
- 专注于对项目最有利的事情
- 对其他社区成员表示同理心

---

## 如何贡献

### 报告 Bug

如果您发现了 bug，请：

1. 检查是否已有相关 issue
2. 如果没有，创建新 issue
3. 提供详细的 bug 描述
4. 提供复现步骤
5. 提供环境信息

### 提出功能建议

如果您有功能建议，请：

1. 检查是否已有相关 issue
2. 创建新 issue 描述功能
3. 说明功能的用途和价值
4. 如果可能，提供实现思路

### 提交代码

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 开发环境设置

### 前置要求

- Node.js >= 20.0.0
- pnpm >= 10.0.0
- Git

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/673342907/SalaryPrivacy.git
cd SalaryPrivacy

# 安装依赖
pnpm install

# 编译 SDK
pnpm sdk:build

# 运行测试
pnpm test
```

---

## 代码规范

### Solidity

- 使用 Solidity 0.8.24
- 遵循 Solidity 风格指南
- 使用 `solhint` 检查代码
- 所有公共函数必须有文档注释

### TypeScript/JavaScript

- 使用 TypeScript
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 所有公共函数必须有 JSDoc 注释

### 文件命名

- Solidity 文件：`PascalCase.sol`
- TypeScript 文件：`camelCase.ts`
- 测试文件：`*.test.ts`

---

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 提交类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

### 提交格式

```
<type>: <subject>

<body>

<footer>
```

### 示例

```
feat: add blind auction example

- Add FHEBlindAuction contract
- Add tests for blind auction
- Update documentation

Closes #123
```

---

## 测试要求

### 智能合约测试

- 所有新功能必须有测试
- 测试覆盖率应 >= 80%
- 使用 Hardhat 测试框架

### 运行测试

```bash
# 运行所有测试
pnpm hardhat:test

# 运行覆盖率
pnpm hardhat:coverage
```

### 测试规范

- 每个测试应该独立
- 使用描述性的测试名称
- 测试正常用例和边界情况
- 测试错误处理

---

## 文档要求

### 代码注释

- 所有公共函数必须有文档注释
- 使用 JSDoc/TSDoc 格式
- 包含参数和返回值说明
- 包含使用示例（如果适用）

### README 更新

- 新功能需要更新 README
- 添加使用示例
- 更新功能列表

---

## Pull Request 流程

1. **创建 PR**
   - 从 `main` 分支创建功能分支
   - 确保所有测试通过
   - 确保代码符合规范

2. **PR 描述**
   - 清晰描述更改内容
   - 说明为什么需要这些更改
   - 链接相关 issue

3. **代码审查**
   - 等待维护者审查
   - 根据反馈修改
   - 保持 PR 更新

4. **合并**
   - 维护者会审查并合并
   - 确保 CI 通过

---

## 问题反馈

如果您有任何问题，可以：

- 创建 GitHub Issue
- 查看现有文档
- 联系维护者

---

## 许可证

通过贡献，您同意您的代码将在项目的许可证下发布。

---

**感谢您的贡献！** 🙏

---

**最后更新：** 2024-12-03

