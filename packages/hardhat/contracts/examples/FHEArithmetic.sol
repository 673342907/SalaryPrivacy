// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title FHEArithmetic
 * @author ConfidentialSalary Team
 * @notice 演示 FHE 算术运算：加法、减法、乘法、除法
 * @dev 这是一个基础示例，展示所有可用的 FHE 算术操作
 * 
 * @custom:chapter basic
 * @custom:chapter fhe-calculations
 * 
 * 学习要点：
 * 1. TFHE.add() - 加密加法
 * 2. TFHE.sub() - 加密减法
 * 3. TFHE.mul() - 加密乘法
 * 4. TFHE.div() - 加密除法
 * 
 * @custom:example
 * ```solidity
 * // 加密两个值
 * bytes memory encryptedA = encrypt(10);
 * bytes memory encryptedB = encrypt(5);
 * 
 * // 在加密状态下进行计算
 * bytes memory sum = contract.add(encryptedA, encryptedB); // 15
 * bytes memory diff = contract.sub(encryptedA, encryptedB); // 5
 * bytes memory prod = contract.mul(encryptedA, encryptedB); // 50
 * bytes memory quot = contract.div(encryptedA, encryptedB); // 2
 * ```
 */
contract FHEArithmetic is EthereumConfig {
    mapping(uint256 => euint32) public storedValues;
    uint256 public nextId = 1;
    
    event ValueStored(uint256 indexed id);
    event CalculationPerformed(string operation, uint256 id1, uint256 id2);
    
    /**
     * @notice 存储加密值
     * @dev 存储一个加密值供后续计算使用
     * @param encryptedValue 加密的值
     * @return id 存储的ID
     */
    function storeValue(bytes calldata encryptedValue) public returns (uint256) {
        euint32 value = TFHE.asEuint32(encryptedValue);
        TFHE.allowThis(value);
        
        uint256 id = nextId++;
        storedValues[id] = value;
        
        emit ValueStored(id);
        return id;
    }
    
    /**
     * @notice 加密加法
     * @dev 演示 TFHE.add() 的使用
     * @custom:chapter basic
     * @param id1 第一个值的ID
     * @param id2 第二个值的ID
     * @return result 加密的和
     */
    function add(uint256 id1, uint256 id2) public view returns (bytes memory) {
        require(storedValues[id1].ciphertext.length > 0, "Value 1 not found");
        require(storedValues[id2].ciphertext.length > 0, "Value 2 not found");
        
        euint32 a = storedValues[id1];
        euint32 b = storedValues[id2];
        euint32 sum = TFHE.add(a, b);
        
        emit CalculationPerformed("add", id1, id2);
        return sum.ciphertext;
    }
    
    /**
     * @notice 加密减法
     * @dev 演示 TFHE.sub() 的使用
     * @custom:chapter basic
     * @param id1 被减数的ID
     * @param id2 减数的ID
     * @return result 加密的差
     */
    function sub(uint256 id1, uint256 id2) public view returns (bytes memory) {
        require(storedValues[id1].ciphertext.length > 0, "Value 1 not found");
        require(storedValues[id2].ciphertext.length > 0, "Value 2 not found");
        
        euint32 a = storedValues[id1];
        euint32 b = storedValues[id2];
        euint32 diff = TFHE.sub(a, b);
        
        emit CalculationPerformed("sub", id1, id2);
        return diff.ciphertext;
    }
    
    /**
     * @notice 加密乘法
     * @dev 演示 TFHE.mul() 的使用
     * @custom:chapter basic
     * @param id1 第一个值的ID
     * @param id2 第二个值的ID
     * @return result 加密的积
     */
    function mul(uint256 id1, uint256 id2) public view returns (bytes memory) {
        require(storedValues[id1].ciphertext.length > 0, "Value 1 not found");
        require(storedValues[id2].ciphertext.length > 0, "Value 2 not found");
        
        euint32 a = storedValues[id1];
        euint32 b = storedValues[id2];
        euint32 prod = TFHE.mul(a, b);
        
        emit CalculationPerformed("mul", id1, id2);
        return prod.ciphertext;
    }
    
    /**
     * @notice 加密除法
     * @dev 演示 TFHE.div() 的使用
     * @custom:chapter basic
     * @param id1 被除数的ID
     * @param id2 除数的ID
     * @return result 加密的商
     */
    function div(uint256 id1, uint256 id2) public view returns (bytes memory) {
        require(storedValues[id1].ciphertext.length > 0, "Value 1 not found");
        require(storedValues[id2].ciphertext.length > 0, "Value 2 not found");
        
        euint32 a = storedValues[id1];
        euint32 b = storedValues[id2];
        euint32 quot = TFHE.div(a, b);
        
        emit CalculationPerformed("div", id1, id2);
        return quot.ciphertext;
    }
    
    /**
     * @notice 获取存储的值
     * @dev 返回加密值，需要在前端解密
     * @param id 值的ID
     * @return encryptedValue 加密的值
     */
    function getValue(uint256 id) public view returns (bytes memory) {
        require(storedValues[id].ciphertext.length > 0, "Value not found");
        return storedValues[id].ciphertext;
    }
}

