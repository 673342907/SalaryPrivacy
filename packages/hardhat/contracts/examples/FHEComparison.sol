// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title FHEComparison
 * @author ConfidentialSalary Team
 * @notice 演示 FHE 比较操作：等于、不等于、大于、小于等
 * @dev 这是一个基础示例，展示所有可用的 FHE 比较操作
 * 
 * @custom:chapter basic
 * @custom:chapter fhe-calculations
 * 
 * 学习要点：
 * 1. TFHE.eq() - 等于
 * 2. TFHE.ne() - 不等于
 * 3. TFHE.gt() - 大于
 * 4. TFHE.ge() - 大于等于
 * 5. TFHE.lt() - 小于
 * 6. TFHE.le() - 小于等于
 * 
 * @custom:example
 * ```solidity
 * // 加密两个值
 * bytes memory encryptedA = encrypt(10);
 * bytes memory encryptedB = encrypt(5);
 * 
 * // 在加密状态下进行比较
 * bytes memory isEqual = contract.isEqual(encryptedA, encryptedB); // false
 * bytes memory isGreater = contract.isGreater(encryptedA, encryptedB); // true
 * ```
 */
contract FHEComparison is EthereumConfig {
    /**
     * @notice 检查两个加密值是否相等
     * @dev 演示 TFHE.eq() 的使用
     * @custom:chapter basic
     * @param encryptedA 第一个加密值
     * @param encryptedB 第二个加密值
     * @return result 加密的布尔结果（true 表示相等）
     */
    function isEqual(bytes calldata encryptedA, bytes calldata encryptedB) 
        public 
        view 
        returns (bytes memory) 
    {
        euint32 a = TFHE.asEuint32(encryptedA);
        euint32 b = TFHE.asEuint32(encryptedB);
        ebool result = TFHE.eq(a, b);
        return result.ciphertext;
    }
    
    /**
     * @notice 检查两个加密值是否不相等
     * @dev 演示 TFHE.ne() 的使用
     * @custom:chapter basic
     * @param encryptedA 第一个加密值
     * @param encryptedB 第二个加密值
     * @return result 加密的布尔结果（true 表示不相等）
     */
    function isNotEqual(bytes calldata encryptedA, bytes calldata encryptedB) 
        public 
        view 
        returns (bytes memory) 
    {
        euint32 a = TFHE.asEuint32(encryptedA);
        euint32 b = TFHE.asEuint32(encryptedB);
        ebool result = TFHE.ne(a, b);
        return result.ciphertext;
    }
    
    /**
     * @notice 检查第一个值是否大于第二个值
     * @dev 演示 TFHE.gt() 的使用
     * @custom:chapter basic
     * @param encryptedA 第一个加密值
     * @param encryptedB 第二个加密值
     * @return result 加密的布尔结果（true 表示 A > B）
     */
    function isGreater(bytes calldata encryptedA, bytes calldata encryptedB) 
        public 
        view 
        returns (bytes memory) 
    {
        euint32 a = TFHE.asEuint32(encryptedA);
        euint32 b = TFHE.asEuint32(encryptedB);
        ebool result = TFHE.gt(a, b);
        return result.ciphertext;
    }
    
    /**
     * @notice 检查第一个值是否大于等于第二个值
     * @dev 演示 TFHE.ge() 的使用
     * @custom:chapter basic
     * @param encryptedA 第一个加密值
     * @param encryptedB 第二个加密值
     * @return result 加密的布尔结果（true 表示 A >= B）
     */
    function isGreaterOrEqual(bytes calldata encryptedA, bytes calldata encryptedB) 
        public 
        view 
        returns (bytes memory) 
    {
        euint32 a = TFHE.asEuint32(encryptedA);
        euint32 b = TFHE.asEuint32(encryptedB);
        ebool result = TFHE.ge(a, b);
        return result.ciphertext;
    }
    
    /**
     * @notice 检查第一个值是否小于第二个值
     * @dev 演示 TFHE.lt() 的使用
     * @custom:chapter basic
     * @param encryptedA 第一个加密值
     * @param encryptedB 第二个加密值
     * @return result 加密的布尔结果（true 表示 A < B）
     */
    function isLess(bytes calldata encryptedA, bytes calldata encryptedB) 
        public 
        view 
        returns (bytes memory) 
    {
        euint32 a = TFHE.asEuint32(encryptedA);
        euint32 b = TFHE.asEuint32(encryptedB);
        ebool result = TFHE.lt(a, b);
        return result.ciphertext;
    }
    
    /**
     * @notice 检查第一个值是否小于等于第二个值
     * @dev 演示 TFHE.le() 的使用
     * @custom:chapter basic
     * @param encryptedA 第一个加密值
     * @param encryptedB 第二个加密值
     * @return result 加密的布尔结果（true 表示 A <= B）
     */
    function isLessOrEqual(bytes calldata encryptedA, bytes calldata encryptedB) 
        public 
        view 
        returns (bytes memory) 
    {
        euint32 a = TFHE.asEuint32(encryptedA);
        euint32 b = TFHE.asEuint32(encryptedB);
        ebool result = TFHE.le(a, b);
        return result.ciphertext;
    }
}

