# 💡 FHEVM 最佳实践指南

## 📋 目录

- [加密数据存储](#加密数据存储)
- [访问控制](#访问控制)
- [加密计算](#加密计算)
- [错误处理](#错误处理)
- [性能优化](#性能优化)
- [安全建议](#安全建议)

---

## 🔐 加密数据存储

### ✅ 正确做法

```solidity
function storeValue(bytes calldata encryptedValue) public {
    // 1. 转换为 FHE 类型
    euint32 value = TFHE.asEuint32(encryptedValue);
    
    // 2. 允许合约存储（必需！）
    TFHE.allowThis(value);
    
    // 3. 存储
    storedValues[msg.sender] = value;
}
```

### ❌ 错误做法

```solidity
function storeValue(bytes calldata encryptedValue) public {
    euint32 value = TFHE.asEuint32(encryptedValue);
    // ❌ 忘记使用 FHE.allowThis()
    storedValues[msg.sender] = value; // 这会失败
}
```

---

## 🔑 访问控制

### ✅ 正确做法

```solidity
// 永久存储
TFHE.allowThis(value);

// 允许特定用户访问
TFHE.allow(value, userAddress);

// 临时访问（仅本次调用）
TFHE.allowTransient(value, msg.sender);
```

### ❌ 错误做法

```solidity
// ❌ 尝试在 view 函数中返回加密值
function getValue() public view returns (euint32) {
    return storedValues[msg.sender]; // 不允许
}

// ✅ 正确：返回 bytes
function getValue() public view returns (bytes memory) {
    return storedValues[msg.sender].ciphertext;
}
```

---

## 🧮 加密计算

### ✅ 正确做法

```solidity
// 加密加法
euint32 sum = TFHE.add(a, b);

// 加密比较
ebool isGreater = TFHE.gt(a, b);

// 加密乘法
euint32 product = TFHE.mul(a, b);
```

### ❌ 错误做法

```solidity
// ❌ 尝试直接运算
uint32 sum = a + b; // 不允许，a 和 b 是加密的

// ❌ 尝试直接比较
bool isGreater = a > b; // 不允许
```

---

## ⚠️ 错误处理

### ✅ 正确做法

```solidity
function processValue(bytes calldata encryptedValue) public {
    require(encryptedValue.length > 0, "Encrypted value cannot be empty");
    
    euint32 value = TFHE.asEuint32(encryptedValue);
    // 输入证明会自动验证，如果无效会 revert
    
    TFHE.allowThis(value);
    // ... 处理
}
```

### ❌ 错误做法

```solidity
function processValue(bytes calldata encryptedValue) public {
    // ❌ 没有验证输入
    euint32 value = TFHE.asEuint32(encryptedValue);
    // 如果输入无效，会在这里 revert，但错误信息不清晰
}
```

---

## ⚡ 性能优化

### 1. 批量操作

```solidity
// ✅ 好：批量处理
function batchProcess(uint256[] memory ids) public {
    for (uint256 i = 0; i < ids.length; i++) {
        processValue(ids[i]);
    }
}

// ❌ 差：多次单独调用
// 需要多次交易，Gas 费用高
```

### 2. 事件使用

```solidity
// ✅ 好：使用事件记录非敏感信息
event ValueStored(uint256 indexed id, address indexed user);

// ❌ 差：在事件中记录加密值
event ValueStored(uint256 indexed id, euint32 value); // 不允许
```

### 3. 存储优化

```solidity
// ✅ 好：使用映射而非数组
mapping(uint256 => euint32) public values;

// ⚠️ 注意：数组需要遍历，Gas 费用高
euint32[] public values; // 仅在必要时使用
```

---

## 🔒 安全建议

### 1. 输入验证

```solidity
// ✅ 总是验证输入
require(encryptedValue.length > 0, "Value cannot be empty");
require(userAddress != address(0), "Invalid address");
```

### 2. 权限检查

```solidity
// ✅ 使用修饰符
modifier onlyOwner() {
    require(msg.sender == owner, "Only owner");
    _;
}

function adminFunction() public onlyOwner {
    // ...
}
```

### 3. 重入攻击防护

```solidity
// ✅ Solidity 0.8+ 自动防护
// 但仍建议使用检查-效果-交互模式
```

---

## 📚 代码示例

### 完整的存储和检索示例

```solidity
contract Example {
    mapping(address => euint32) public values;
    
    function store(bytes calldata encrypted) public {
        require(encrypted.length > 0, "Empty value");
        euint32 value = TFHE.asEuint32(encrypted);
        TFHE.allowThis(value);
        values[msg.sender] = value;
    }
    
    function get() public view returns (bytes memory) {
        require(values[msg.sender].ciphertext.length > 0, "No value");
        return values[msg.sender].ciphertext;
    }
}
```

### 完整的计算示例

```solidity
contract Calculator {
    mapping(uint256 => euint32) public values;
    
    function add(uint256 id1, uint256 id2) public view returns (bytes memory) {
        euint32 a = values[id1];
        euint32 b = values[id2];
        euint32 sum = TFHE.add(a, b);
        return sum.ciphertext;
    }
}
```

---

## 🎯 常见问题

### Q: 为什么需要 FHE.allowThis()？

**A:** 合约需要明确权限才能存储加密值。这是 FHEVM 的安全机制。

### Q: 可以在 view 函数中返回 euint32 吗？

**A:** 不可以。view 函数只能返回 bytes，让用户在前端解密。

### Q: 如何比较两个加密值？

**A:** 使用 TFHE.gt(), TFHE.lt(), TFHE.eq() 等比较函数。

### Q: 输入证明是什么？

**A:** 输入证明确保加密数据来自合法的 FHEVM 客户端，防止伪造。

---

## 📖 更多资源

- [FHEVM 文档](https://docs.zama.org/protocol)
- [Zama 示例](https://docs.zama.org/protocol/examples)
- [Solidity 文档](https://docs.soliditylang.org)

---

**最后更新：** 2024-12-03

