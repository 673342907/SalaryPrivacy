# FHEVM Examples Documentation

本文档由自动生成工具创建，包含所有 FHEVM 示例合约的文档。

## 📑 章节索引

### access

- [ConfidentialSalary](#confidentialsalary)
- [ConfidentialSalary](#confidentialsalary)
- [ConfidentialSalary](#confidentialsalary)
- [FHEAccessControl](#fheaccesscontrol)
- [FHEAccessControl](#fheaccesscontrol)
- [FHEAccessControl](#fheaccesscontrol)
- [FHEAccessControl](#fheaccesscontrol)
- [FHEAccessControl](#fheaccesscontrol)

### encryption

- [ConfidentialSalary](#confidentialsalary)
- [ConfidentialSalary](#confidentialsalary)
- [ConfidentialSalary](#confidentialsalary)

### user

- [ConfidentialSalary](#confidentialsalary)
- [ConfidentialSalary](#confidentialsalary)

### fhe

- [ConfidentialSalary](#confidentialsalary)
- [ConfidentialSalary](#confidentialsalary)
- [ConfidentialSalary](#confidentialsalary)

### antipatterns

- [FHEAntipatterns](#fheantipatterns)

### input

- [FHEInputProof](#fheinputproof)
- [FHEInputProof](#fheinputproof)
- [FHEInputProof](#fheinputproof)

## ConfidentialSalary

**合约名称：** `ConfidentialSalary`

基于FHEVM的隐私保护薪资管理系统
 *

### 函数列表

#### createDepartment()

基于FHEVM的隐私保护薪资管理系统
 *

#### getDepartment()



#### addEmployee()



#### assignRole()



#### submitSalary()

提交加密薪资（仅HR或Admin）
     *

#### getEncryptedSalary()

获取加密薪资（仅员工本人、经理或以上级别可查看）
     *

#### getDepartmentTotalSalary()

计算部门总薪资（加密计算，不解密原始数据）
     *

#### getDepartmentAverageSalary()



#### compareSalaries()



#### checkBudgetCompliance()

检查预算合规性（不解密薪资和预算）
     *

#### getDepartmentEmployeeCount()



#### getDepartmentEmployees()



---

## FHEAccessControl

**合约名称：** `FHEAccessControl`

演示 FHE 访问控制：FHE.allow() 和 FHE.allowTransient()
 *

### 函数列表

#### storeValue()

演示 FHE 访问控制：FHE.allow() 和 FHE.allowTransient()
 *

#### allowUserAccess()

允许特定用户访问加密值
     *

#### transientAccess()

临时访问加密值（仅本次调用有效）
     *

#### getValue()

获取加密值（需要先允许访问）
     *

---

## FHEAntipatterns

**合约名称：** `FHEAntipatterns`

演示 FHEVM 的常见反模式和错误用法
 *

### 函数列表

#### correctStoreValue()

演示 FHEVM 的常见反模式和错误用法
 *

#### wrongStoreValue()

❌ 错误示例：忘记使用 FHE.allowThis()
     *

#### correctGetValue()

✅ 正确：在 view 函数中返回 bytes
     *

#### correctCompare()

❌ 错误示例：在 view 函数中返回 euint32
     *

#### correctCalculate()

❌ 错误示例：尝试直接比较加密值
     *

---

## FHEInputProof

**合约名称：** `FHEInputProof`

演示输入证明（Input Proof）的概念和使用
 *

### 函数列表

#### processValue()

演示输入证明（Input Proof）的概念和使用
 *

#### processMultipleValues()

处理多个加密值（批量验证输入证明）
     *

#### getValue()

获取处理的值
     *

---

