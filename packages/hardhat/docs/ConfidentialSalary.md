# ConfidentialSalary

基于FHEVM的隐私保护薪资管理系统
 *

## 📚 相关章节

- **access**: 查看相关文档
- **encryption**: 查看相关文档
- **user**: 查看相关文档
- **fhe**: 查看相关文档
- **encryption**: 查看相关文档
- **encryption**: 查看相关文档
- **access**: 查看相关文档
- **user**: 查看相关文档
- **access**: 查看相关文档
- **fhe**: 查看相关文档
- **fhe**: 查看相关文档

## 🔧 函数文档

### `createDepartment()`

基于FHEVM的隐私保护薪资管理系统
 *

**参数：**

- `name` (部门名称): *
- `encryptedBudget` (加密的部门预算（bytes): 格式的加密数据） *

**返回值：** `departmentId` - 新创建的部门ID * *

**重要提示：**

- * - 必须使用 onlyHROrAdmin 修饰符进行访问控制
     * - encryptedBudget 必须是有效的加密数据（32字节）
     * - 部门ID自动递增，从1开始
     */
    function createDepartment

---

### `getDepartment()`



**参数：**

- `departmentId` (部门ID): *

**返回值：** `name` - 部门名称 *

---

### `addEmployee()`



**参数：**

- `employeeAddress` (员工地址): *
- `name` (员工姓名): *
- `role` (员工角色): *
- `departmentId` (部门ID): */ function addEmployee

---

### `assignRole()`



**参数：**

- `user` (用户地址): *
- `role` (角色): */ function assignRole

---

### `submitSalary()`

提交加密薪资（仅HR或Admin）
     *

**参数：**

- `employeeAddress` (员工地址): *
- `encryptedSalary` (加密的薪资金额（bytes): 格式的加密数据） * *

**重要提示：**

- * - 必须使用 onlyHROrAdmin 修饰符进行访问控制
     * - 员工必须已存在于系统中
     * - 使用 FHE.allowThis() 允许合约存储加密值
     * - 加密数据会永久存储在链上，只有有权限的用户才能解密
     */
    function submitSalary

---

### `getEncryptedSalary()`

获取加密薪资（仅员工本人、经理或以上级别可查看）
     *

**参数：**

- `employeeAddress` (员工地址): *

**返回值：** `encryptedSalary` - 加密薪资（bytes 格式，可在前端使用 FHEVM SDK 解密） * *

**重要提示：**

- * - 这是一个 view 函数，不会修改状态
     * - 返回的是加密数据，需要在前端使用 FHEVM SDK 解密
     * - 只有有权限的用户才能调用此函数
     * - 注意：view 函数不能返回加密值（euint32），只能返回 bytes
     * 
     *

---

### `getDepartmentTotalSalary()`

计算部门总薪资（加密计算，不解密原始数据）
     *

**参数：**

- `departmentId` (部门ID): *

**返回值：** `encryptedTotal` - 加密的总薪资（bytes 格式） * *

**重要提示：**

- * - 这是一个 FHE 同态加密计算的示例
     * - 所有计算都在加密状态下进行，不解密原始数据
     * - 使用 TFHE.add() 进行加密加法运算
     * - 结果仍然是加密的，需要解密才能看到实际值
     * 
     *

---

### `getDepartmentAverageSalary()`



**参数：**

- `departmentId` (部门ID): *

**返回值：** `encryptedAverage` - 加密的平均薪资 */ function getDepartmentAverageSalary

---

### `compareSalaries()`



**参数：**

- `employee1` (员工1地址): *
- `employee2` (员工2地址): *

**返回值：** `encryptedComparison` - 加密的比较结果（true表示employee1 > employee2） */ function compareSalaries

---

### `checkBudgetCompliance()`

检查预算合规性（不解密薪资和预算）
     *

**参数：**

- `departmentId` (部门ID): *

**返回值：** `encryptedCompliance` - 加密的合规结果（bytes 格式，true表示在预算内） * *

**重要提示：**

- * - 这是一个 FHE 比较操作的示例
     * - 使用 TFHE.le() 在加密状态下比较两个值（<=）
     * - 结果仍然是加密的，需要解密才能知道实际值
     * - 这是隐私保护的核心：即使合约也无法知道实际值
     * 
     *

---

### `getDepartmentEmployeeCount()`



**参数：**

- `departmentId` (部门ID): *

**返回值：** `count` - 员工数量 */ function getDepartmentEmployeeCount

---

### `getDepartmentEmployees()`



**参数：**

- `departmentId` (部门ID): *

**返回值：** `employeeAddresses` - 员工地址数组 */ function getDepartmentEmployees

---

## 📖 更多信息

- [FHEVM 文档](https://docs.zama.org/protocol)
- [Zama Bounty Program](https://www.zama.org/post/bounty-track-december-2025-build-the-fhevm-example-hub)
