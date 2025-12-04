# FHEAntipatterns

演示 FHEVM 的常见反模式和错误用法
 *

## 📚 相关章节

- **antipatterns**: 查看相关文档

## 🔧 函数文档

### `correctStoreValue()`

演示 FHEVM 的常见反模式和错误用法
 *

---

### `wrongStoreValue()`

❌ 错误示例：忘记使用 FHE.allowThis()
     *

---

### `correctGetValue()`

✅ 正确：在 view 函数中返回 bytes
     *

---

### `correctCompare()`

❌ 错误示例：在 view 函数中返回 euint32
     *

---

### `correctCalculate()`

❌ 错误示例：尝试直接比较加密值
     *

---

## ⚠️ 常见反模式

以下是一些常见的错误用法，请避免：

- **missing**: 查看相关文档了解正确用法
- **view**: 查看相关文档了解正确用法
- **direct**: 查看相关文档了解正确用法
- **event**: 查看相关文档了解正确用法
- **decrypt**: 查看相关文档了解正确用法

## 📖 更多信息

- [FHEVM 文档](https://docs.zama.org/protocol)
- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)
