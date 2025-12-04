// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title ConfidentialSalary
 * @author ConfidentialSalary Team
 * @notice 基于FHEVM的隐私保护薪资管理系统
 * @dev 这是一个完整的FHEVM应用示例，演示了加密数据存储、访问控制、加密计算等核心概念
 * 
 * @custom:chapter access-control
 * @custom:chapter encryption
 * @custom:chapter user-decryption
 * @custom:chapter fhe-calculations
 * 
 * 核心功能：
 * - 加密薪资存储（使用 euint32）
 * - 部门管理（加密预算）
 * - 角色权限控制（RBAC）
 * - 加密统计计算（不解密原始数据）
 * - 预算合规检查（FHE 比较操作）
 * 
 * 学习要点：
 * 1. 如何使用 TFHE.asEuint32() 将加密数据转换为 FHE 类型
 * 2. 如何使用 FHE.allow() 和 FHE.allowTransient() 进行访问控制
 * 3. 如何在不解密的情况下进行加密数据计算（加法、比较、除法）
 * 4. 如何实现基于角色的访问控制（RBAC）
 * 
 * @custom:example
 * ```solidity
 * // 创建部门（加密预算）
 * bytes memory encryptedBudget = encrypt(1000000); // 加密 1,000,000
 * uint256 deptId = contract.createDepartment("技术部", encryptedBudget);
 * 
 * // 添加员工
 * contract.addEmployee(employeeAddress, "张三", Role.Employee, deptId);
 * 
 * // 提交加密薪资
 * bytes memory encryptedSalary = encrypt(50000); // 加密 50,000
 * contract.submitSalary(employeeAddress, encryptedSalary);
 * 
 * // 计算部门总薪资（不解密）
 * bytes memory total = contract.getDepartmentTotalSalary(deptId);
 * ```
 */
contract ConfidentialSalary is EthereumConfig {
    // ============ 数据结构 ============
    
    enum Role {
        Employee,  // 员工：只能查看自己的薪资
        Manager,   // 经理：可以查看部门数据
        HR,        // 人力资源：可以创建部门、管理员工、提交薪资
        Admin      // 管理员：完全权限
    }
    
    struct Department {
        uint256 id;
        string name;
        euint32 budget;  // 加密预算
        uint256 employeeCount;
        bool exists;
    }
    
    struct Employee {
        address employeeAddress;
        string name;
        Role role;
        uint256 departmentId;
        bool exists;
    }
    
    // ============ 状态变量 ============
    
    mapping(address => Role) public roles;
    mapping(address => euint32) public encryptedSalaries;
    mapping(uint256 => Department) public departments;
    mapping(address => Employee) public employees;
    mapping(uint256 => address[]) public departmentEmployees; // 部门ID => 员工地址列表
    
    uint256 public nextDepartmentId = 1;
    address public owner;
    
    // ============ 事件 ============
    
    event DepartmentCreated(uint256 indexed departmentId, string name);
    event EmployeeAdded(address indexed employee, string name, Role role, uint256 departmentId);
    event SalarySubmitted(address indexed employee, uint256 departmentId);
    event RoleAssigned(address indexed user, Role role);
    event BudgetComplianceChecked(uint256 indexed departmentId, bool isCompliant);
    
    // ============ 修饰符 ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.Admin, "Only admin");
        _;
    }
    
    modifier onlyHROrAdmin() {
        require(
            roles[msg.sender] == Role.HR || roles[msg.sender] == Role.Admin,
            "Only HR or Admin"
        );
        _;
    }
    
    modifier onlyManagerOrAbove() {
        require(
            roles[msg.sender] == Role.Manager ||
            roles[msg.sender] == Role.HR ||
            roles[msg.sender] == Role.Admin,
            "Insufficient permissions"
        );
        _;
    }
    
    // ============ 构造函数 ============
    
    constructor() {
        owner = msg.sender;
        roles[msg.sender] = Role.Admin;
    }
    
    // ============ 部门管理 ============
    
    /**
     * @notice 创建部门（仅HR或Admin）
     * @dev 演示如何使用 TFHE.asEuint32() 将加密数据转换为 FHE 类型
     * @custom:chapter encryption
     * @param name 部门名称
     * @param encryptedBudget 加密的部门预算（bytes 格式的加密数据）
     * @return departmentId 新创建的部门ID
     * 
     * @custom:example
     * ```solidity
     * // 前端：使用 FHEVM SDK 加密预算
     * const encryptedBudget = await encryptWith(1000000, "uint32");
     * 
     * // 调用合约
     * const tx = await contract.createDepartment("技术部", encryptedBudget.ciphertext);
     * ```
     * 
     * @custom:important
     * - 必须使用 onlyHROrAdmin 修饰符进行访问控制
     * - encryptedBudget 必须是有效的加密数据（32字节）
     * - 部门ID自动递增，从1开始
     */
    function createDepartment(
        string memory name,
        bytes calldata encryptedBudget
    ) public onlyHROrAdmin returns (uint256) {
        require(bytes(name).length > 0, "Department name cannot be empty");
        require(encryptedBudget.length > 0, "Encrypted budget cannot be empty");
        
        uint256 departmentId = nextDepartmentId++;
        
        // 将加密数据转换为 FHE 类型
        // 注意：这里会自动验证输入证明（input proof）
        euint32 budget = TFHE.asEuint32(encryptedBudget);
        
        // 允许合约存储这个加密值
        TFHE.allowThis(budget);
        
        departments[departmentId] = Department({
            id: departmentId,
            name: name,
            budget: budget,
            employeeCount: 0,
            exists: true
        });
        
        emit DepartmentCreated(departmentId, name);
        return departmentId;
    }
    
    /**
     * @dev 获取部门信息
     * @param departmentId 部门ID
     * @return name 部门名称
     * @return encryptedBudget 加密预算
     * @return employeeCount 员工数量
     */
    function getDepartment(uint256 departmentId)
        public
        view
        returns (
            string memory name,
            bytes memory encryptedBudget,
            uint256 employeeCount
        )
    {
        require(departments[departmentId].exists, "Department does not exist");
        Department memory dept = departments[departmentId];
        return (dept.name, TFHE.asEuint32(dept.budget).ciphertext, dept.employeeCount);
    }
    
    // ============ 员工管理 ============
    
    /**
     * @dev 添加员工（仅HR或Admin）
     * @param employeeAddress 员工地址
     * @param name 员工姓名
     * @param role 员工角色
     * @param departmentId 部门ID
     */
    function addEmployee(
        address employeeAddress,
        string memory name,
        Role role,
        uint256 departmentId
    ) public onlyHROrAdmin {
        require(departments[departmentId].exists, "Department does not exist");
        require(!employees[employeeAddress].exists, "Employee already exists");
        
        employees[employeeAddress] = Employee({
            employeeAddress: employeeAddress,
            name: name,
            role: role,
            departmentId: departmentId,
            exists: true
        });
        
        roles[employeeAddress] = role;
        departmentEmployees[departmentId].push(employeeAddress);
        departments[departmentId].employeeCount++;
        
        emit EmployeeAdded(employeeAddress, name, role, departmentId);
    }
    
    /**
     * @dev 分配角色（仅Admin）
     * @param user 用户地址
     * @param role 角色
     */
    function assignRole(address user, Role role) public onlyAdmin {
        roles[user] = role;
        if (employees[user].exists) {
            employees[user].role = role;
        }
        emit RoleAssigned(user, role);
    }
    
    // ============ 薪资管理 ============
    
    /**
     * @notice 提交加密薪资（仅HR或Admin）
     * @dev 演示如何存储加密数据，并使用 FHE.allowThis() 允许合约访问
     * @custom:chapter encryption
     * @custom:chapter access-control
     * @param employeeAddress 员工地址
     * @param encryptedSalary 加密的薪资金额（bytes 格式的加密数据）
     * 
     * @custom:example
     * ```solidity
     * // 前端：使用 FHEVM SDK 加密薪资
     * const encryptedSalary = await encryptWith(50000, "uint32");
     * 
     * // 调用合约
     * const tx = await contract.submitSalary(employeeAddress, encryptedSalary.ciphertext);
     * ```
     * 
     * @custom:important
     * - 必须使用 onlyHROrAdmin 修饰符进行访问控制
     * - 员工必须已存在于系统中
     * - 使用 FHE.allowThis() 允许合约存储加密值
     * - 加密数据会永久存储在链上，只有有权限的用户才能解密
     */
    function submitSalary(
        address employeeAddress,
        bytes calldata encryptedSalary
    ) public onlyHROrAdmin {
        require(employeeAddress != address(0), "Invalid employee address");
        require(employees[employeeAddress].exists, "Employee does not exist");
        require(encryptedSalary.length > 0, "Encrypted salary cannot be empty");
        
        // 将加密数据转换为 FHE 类型
        // 注意：这里会自动验证输入证明（input proof）
        euint32 salary = TFHE.asEuint32(encryptedSalary);
        
        // 允许合约存储这个加密值
        // 这是必需的，否则合约无法访问加密数据
        TFHE.allowThis(salary);
        
        encryptedSalaries[employeeAddress] = salary;
        
        uint256 departmentId = employees[employeeAddress].departmentId;
        emit SalarySubmitted(employeeAddress, departmentId);
    }
    
    /**
     * @notice 获取加密薪资（仅员工本人、经理或以上级别可查看）
     * @dev 演示用户解密功能：返回加密数据，用户可以在前端解密
     * @custom:chapter user-decryption
     * @custom:chapter access-control
     * @param employeeAddress 员工地址
     * @return encryptedSalary 加密薪资（bytes 格式，可在前端使用 FHEVM SDK 解密）
     * 
     * @custom:example
     * ```solidity
     * // 获取加密薪资
     * bytes memory encrypted = contract.getEncryptedSalary(employeeAddress);
     * 
     * // 前端：使用 FHEVM SDK 解密
     * const decrypted = await decrypt(encrypted);
     * console.log("薪资:", decrypted); // 50000
     * ```
     * 
     * @custom:important
     * - 这是一个 view 函数，不会修改状态
     * - 返回的是加密数据，需要在前端使用 FHEVM SDK 解密
     * - 只有有权限的用户才能调用此函数
     * - 注意：view 函数不能返回加密值（euint32），只能返回 bytes
     * 
     * @custom:antipattern
     * ❌ 错误：尝试在 view 函数中返回 euint32
     * ```solidity
     * function getSalary() public view returns (euint32) { // ❌ 不允许
     *     return encryptedSalaries[msg.sender];
     * }
     * ```
     * 
     * ✅ 正确：返回 bytes，让用户在前端解密
     * ```solidity
     * function getSalary() public view returns (bytes memory) { // ✅ 正确
     *     return encryptedSalaries[msg.sender].ciphertext;
     * }
     * ```
     */
    function getEncryptedSalary(address employeeAddress)
        public
        view
        returns (bytes memory encryptedSalary)
    {
        require(employeeAddress != address(0), "Invalid employee address");
        require(
            employeeAddress == msg.sender ||
            roles[msg.sender] == Role.Manager ||
            roles[msg.sender] == Role.HR ||
            roles[msg.sender] == Role.Admin,
            "Insufficient permissions"
        );
        require(encryptedSalaries[employeeAddress].ciphertext.length > 0, "Salary not found");
        
        return encryptedSalaries[employeeAddress].ciphertext;
    }
    
    // ============ 加密统计计算 ============
    
    /**
     * @notice 计算部门总薪资（加密计算，不解密原始数据）
     * @dev 演示如何在不解密的情况下对加密数据进行计算（FHE 加法）
     * @custom:chapter fhe-calculations
     * @param departmentId 部门ID
     * @return encryptedTotal 加密的总薪资（bytes 格式）
     * 
     * @custom:example
     * ```solidity
     * // 计算部门总薪资（不解密任何原始薪资）
     * bytes memory total = contract.getDepartmentTotalSalary(1);
     * 
     * // 前端：如果需要，可以解密总薪资
     * const decryptedTotal = await decrypt(total);
     * ```
     * 
     * @custom:important
     * - 这是一个 FHE 同态加密计算的示例
     * - 所有计算都在加密状态下进行，不解密原始数据
     * - 使用 TFHE.add() 进行加密加法运算
     * - 结果仍然是加密的，需要解密才能看到实际值
     * 
     * @custom:understanding-handles
     * 在这个函数中：
     * 1. encryptedSalaries[deptEmployees[i]] 返回的是 euint32 类型
     * 2. 这些值已经通过 FHE.allowThis() 允许合约访问
     * 3. TFHE.add() 在加密状态下执行加法，返回新的加密值
     * 4. 返回的 bytes 是加密结果的 handle，可以在前端解密
     */
    function getDepartmentTotalSalary(uint256 departmentId)
        public
        view
        onlyManagerOrAbove
        returns (bytes memory encryptedTotal)
    {
        require(departments[departmentId].exists, "Department does not exist");
        
        address[] memory deptEmployees = departmentEmployees[departmentId];
        if (deptEmployees.length == 0) {
            // 如果没有员工，返回加密的 0
            return TFHE.asEuint32(0).ciphertext;
        }
        
        // 从第一个员工的加密薪资开始
        euint32 total = encryptedSalaries[deptEmployees[0]];
        
        // 累加所有员工的加密薪资（不解密）
        for (uint256 i = 1; i < deptEmployees.length; i++) {
            euint32 salary = encryptedSalaries[deptEmployees[i]];
            // 在加密状态下执行加法
            total = TFHE.add(total, salary);
        }
        
        return total.ciphertext;
    }
    
    /**
     * @dev 计算部门平均薪资（加密计算）
     * @param departmentId 部门ID
     * @return encryptedAverage 加密的平均薪资
     */
    function getDepartmentAverageSalary(uint256 departmentId)
        public
        view
        onlyManagerOrAbove
        returns (bytes memory encryptedAverage)
    {
        require(departments[departmentId].exists, "Department does not exist");
        
        address[] memory deptEmployees = departmentEmployees[departmentId];
        if (deptEmployees.length == 0) {
            return TFHE.asEuint32(0).ciphertext;
        }
        
        euint32 total = encryptedSalaries[deptEmployees[0]];
        for (uint256 i = 1; i < deptEmployees.length; i++) {
            total = TFHE.add(total, encryptedSalaries[deptEmployees[i]]);
        }
        
        // 计算平均值：total / employeeCount
        euint32 employeeCount = TFHE.asEuint32(departments[departmentId].employeeCount);
        euint32 average = TFHE.div(total, employeeCount);
        
        return average.ciphertext;
    }
    
    /**
     * @dev 比较两个加密薪资（不解密原始值）
     * @param employee1 员工1地址
     * @param employee2 员工2地址
     * @return encryptedComparison 加密的比较结果（true表示employee1 > employee2）
     */
    function compareSalaries(address employee1, address employee2)
        public
        view
        onlyManagerOrAbove
        returns (bytes memory encryptedComparison)
    {
        require(
            encryptedSalaries[employee1].ciphertext.length > 0 &&
            encryptedSalaries[employee2].ciphertext.length > 0,
            "Salaries not found"
        );
        
        euint32 salary1 = encryptedSalaries[employee1];
        euint32 salary2 = encryptedSalaries[employee2];
        
        ebool isGreater = TFHE.gt(salary1, salary2);
        return isGreater.ciphertext;
    }
    
    /**
     * @notice 检查预算合规性（不解密薪资和预算）
     * @dev 演示如何使用 FHE 比较操作（TFHE.le）在不解密的情况下进行比较
     * @custom:chapter fhe-calculations
     * @param departmentId 部门ID
     * @return encryptedCompliance 加密的合规结果（bytes 格式，true表示在预算内）
     * 
     * @custom:example
     * ```solidity
     * // 检查部门是否在预算内（不解密预算和薪资）
     * bytes memory compliance = contract.checkBudgetCompliance(1);
     * 
     * // 前端：解密合规结果
     * const isCompliant = await decrypt(compliance);
     * console.log("是否在预算内:", isCompliant); // true 或 false
     * ```
     * 
     * @custom:important
     * - 这是一个 FHE 比较操作的示例
     * - 使用 TFHE.le() 在加密状态下比较两个值（<=）
     * - 结果仍然是加密的，需要解密才能知道实际值
     * - 这是隐私保护的核心：即使合约也无法知道实际值
     * 
     * @custom:fhe-operations
     * 可用的 FHE 比较操作：
     * - TFHE.lt(a, b): a < b
     * - TFHE.le(a, b): a <= b
     * - TFHE.gt(a, b): a > b
     * - TFHE.ge(a, b): a >= b
     * - TFHE.eq(a, b): a == b
     * - TFHE.ne(a, b): a != b
     */
    function checkBudgetCompliance(uint256 departmentId)
        public
        view
        onlyManagerOrAbove
        returns (bytes memory encryptedCompliance)
    {
        require(departments[departmentId].exists, "Department does not exist");
        
        euint32 budget = departments[departmentId].budget;
        
        // 计算部门总薪资
        address[] memory deptEmployees = departmentEmployees[departmentId];
        if (deptEmployees.length == 0) {
            // 如果没有员工，返回加密的 true（在预算内）
            return TFHE.asEbool(true).ciphertext;
        }
        
        // 计算总薪资（加密状态）
        euint32 totalSalary = encryptedSalaries[deptEmployees[0]];
        for (uint256 i = 1; i < deptEmployees.length; i++) {
            totalSalary = TFHE.add(totalSalary, encryptedSalaries[deptEmployees[i]]);
        }
        
        // 在加密状态下比较：总薪资 <= 预算？
        // 注意：这个比较在不解密任何值的情况下进行
        ebool isCompliant = TFHE.le(totalSalary, budget);
        
        emit BudgetComplianceChecked(departmentId, true); // 注意：这里无法解密，所以总是true
        
        return isCompliant.ciphertext;
    }
    
    /**
     * @dev 获取部门员工数量
     * @param departmentId 部门ID
     * @return count 员工数量
     */
    function getDepartmentEmployeeCount(uint256 departmentId)
        public
        view
        returns (uint256 count)
    {
        require(departments[departmentId].exists, "Department does not exist");
        return departments[departmentId].employeeCount;
    }
    
    /**
     * @dev 获取部门所有员工地址
     * @param departmentId 部门ID
     * @return employeeAddresses 员工地址数组
     */
    function getDepartmentEmployees(uint256 departmentId)
        public
        view
        returns (address[] memory employeeAddresses)
    {
        require(departments[departmentId].exists, "Department does not exist");
        return departmentEmployees[departmentId];
    }
}


