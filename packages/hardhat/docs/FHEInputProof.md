# FHEInputProof

演示输入证明（Input Proof）的概念和使用
 *

## 📚 相关章节

- **input**: 查看相关文档
- **input**: 查看相关文档
- **input**: 查看相关文档

## 🔧 函数文档

### `processValue()`

演示输入证明（Input Proof）的概念和使用
 *

**参数：**

- `encryptedValue` (加密的值（包含输入证明）): *

**返回值：** `id` - 处理的ID * *

**重要提示：**

- * - TFHE.asEuint32() 会自动验证输入证明
     * - 如果输入证明无效，函数会 revert
     * - 不需要手动验证，FHEVM 会自动处理
     * 
     *

---

### `processMultipleValues()`

处理多个加密值（批量验证输入证明）
     *

**参数：**

- `encryptedValues` (加密值数组): *

**返回值：** `ids` - 处理的ID数组 * *

**重要提示：**

- * - 每个值都会独立验证输入证明
     * - 如果任何一个值的输入证明无效，整个函数会 revert
     */
    function processMultipleValues

---

### `getValue()`

获取处理的值
     *

**参数：**

- `id` (处理的ID): *

**返回值：** `encryptedValue` - 加密的值 */ function getValue

---

## 📖 更多信息

- [FHEVM 文档](https://docs.zama.org/protocol)
- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)
