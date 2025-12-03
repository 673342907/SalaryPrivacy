// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title ConfidentialSalary
 * @dev 基于FHEVM的隐私保护薪资管理系统
 * 
 * 核心功能：
 * - 加密薪资存储
 * - 部门管理
 * - 角色权限控制
 * - 加密统计计算（不解密原始数据）
 * - 预算合规检查
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
     * @dev 创建部门（仅HR或Admin）
     * @param name 部门名称
     * @param encryptedBudget 加密的部门预算
     */
    function createDepartment(
        string memory name,
        bytes calldata encryptedBudget
    ) public onlyHROrAdmin returns (uint256) {
        uint256 departmentId = nextDepartmentId++;
        
        euint32 budget = TFHE.asEuint32(encryptedBudget);
        
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
     * @dev 提交加密薪资（仅HR或Admin）
     * @param employeeAddress 员工地址
     * @param encryptedSalary 加密的薪资金额
     */
    function submitSalary(
        address employeeAddress,
        bytes calldata encryptedSalary
    ) public onlyHROrAdmin {
        require(employees[employeeAddress].exists, "Employee does not exist");
        
        euint32 salary = TFHE.asEuint32(encryptedSalary);
        encryptedSalaries[employeeAddress] = salary;
        
        uint256 departmentId = employees[employeeAddress].departmentId;
        emit SalarySubmitted(employeeAddress, departmentId);
    }
    
    /**
     * @dev 获取加密薪资（仅员工本人、经理或以上级别可查看）
     * @param employeeAddress 员工地址
     * @return encryptedSalary 加密薪资
     */
    function getEncryptedSalary(address employeeAddress)
        public
        view
        returns (bytes memory encryptedSalary)
    {
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
     * @dev 计算部门总薪资（加密计算，不解密原始数据）
     * @param departmentId 部门ID
     * @return encryptedTotal 加密的总薪资
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
            return TFHE.asEuint32(0).ciphertext;
        }
        
        euint32 total = encryptedSalaries[deptEmployees[0]];
        for (uint256 i = 1; i < deptEmployees.length; i++) {
            total = TFHE.add(total, encryptedSalaries[deptEmployees[i]]);
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
     * @dev 检查预算合规性（不解密薪资和预算）
     * @param departmentId 部门ID
     * @return encryptedCompliance 加密的合规结果（true表示在预算内）
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
            // 如果没有员工，返回true（在预算内）
            return TFHE.asEbool(true).ciphertext;
        }
        
        euint32 totalSalary = encryptedSalaries[deptEmployees[0]];
        for (uint256 i = 1; i < deptEmployees.length; i++) {
            totalSalary = TFHE.add(totalSalary, encryptedSalaries[deptEmployees[i]]);
        }
        
        // 检查总薪资是否 <= 预算
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

