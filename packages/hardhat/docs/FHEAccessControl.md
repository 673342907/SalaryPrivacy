# FHEAccessControl

演示 FHE 访问控制：FHE.allow() 和 FHE.allowTransient()
 *

## 📚 相关章节

- **access**: 查看相关文档
- **access**: 查看相关文档
- **access**: 查看相关文档
- **access**: 查看相关文档
- **access**: 查看相关文档

## 🔧 函数文档

### `storeValue()`

演示 FHE 访问控制：FHE.allow() 和 FHE.allowTransient()
 *

**参数：**

- `encryptedValue` (加密的值): *

**返回值：** `id` - 存储的ID * *

**重要提示：**

- * - 使用 FHE.allowThis() 允许合约永久存储加密值
     * - 存储后，合约可以访问这个值进行计算
     * - 但其他地址默认无法访问
     */
    function storeValue

---

### `allowUserAccess()`

允许特定用户访问加密值
     *

**参数：**

- `id` (存储的ID): *
- `userAddress` (允许访问的用户地址): * *

**重要提示：**

- * - 使用 FHE.allow() 允许特定地址访问加密值
     * - 允许后，该地址可以解密这个值
     * - 这是访问控制的核心机制
     */
    function allowUserAccess

---

### `transientAccess()`

临时访问加密值（仅本次调用有效）
     *

**参数：**

- `id` (存储的ID): *

**返回值：** `result` - 加密的计算结果 * *

**重要提示：**

- * - 使用 FHE.allowTransient() 允许临时访问
     * - 访问权限仅在本次函数调用中有效
     * - 调用结束后，访问权限自动撤销
     * - 适用于需要临时访问但不希望永久授权的场景
     */
    function transientAccess

---

### `getValue()`

获取加密值（需要先允许访问）
     *

**参数：**

- `id` (存储的ID): *

**返回值：** `encryptedValue` - 加密的值 * *

**重要提示：**

- * - 只有被允许访问的地址才能获取这个值
     * - 返回的是加密值，需要在前端解密
     */
    function getValue

---

## 📖 更多信息

- [FHEVM 文档](https://docs.zama.org/protocol)
- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)
