// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title FHEInputProof
 * @author ConfidentialSalary Team
 * @notice 演示输入证明（Input Proof）的概念和使用
 * @dev 这是一个独立的示例，解释什么是输入证明以及为什么需要它们
 * 
 * @custom:chapter input-proof
 * 
 * 什么是输入证明？
 * - 输入证明是加密数据的一部分，用于验证数据的有效性
 * - 它们确保加密数据是由合法的 FHEVM 客户端生成的
 * - 防止恶意用户提交无效或伪造的加密数据
 * 
 * 为什么需要输入证明？
 * - 防止重放攻击：确保加密数据是新鲜的
 * - 防止伪造：确保加密数据来自合法的 FHEVM 客户端
 * - 确保数据完整性：验证加密数据没有被篡改
 * 
 * @custom:example
 * ```solidity
 * // 前端：使用 FHEVM SDK 加密数据（自动包含输入证明）
 * const encrypted = await encryptWith(100, "uint32");
 * 
 * // 调用合约（输入证明会自动验证）
 * contract.processValue(encrypted.ciphertext);
 * ```
 */
contract FHEInputProof is EthereumConfig {
    mapping(uint256 => euint32) public processedValues;
    uint256 public nextId = 1;
    
    event ValueProcessed(uint256 indexed id);
    
    /**
     * @notice 处理加密值（自动验证输入证明）
     * @dev 演示输入证明的自动验证
     * @custom:chapter input-proof
     * @param encryptedValue 加密的值（包含输入证明）
     * @return id 处理的ID
     * 
     * @custom:important
     * - TFHE.asEuint32() 会自动验证输入证明
     * - 如果输入证明无效，函数会 revert
     * - 不需要手动验证，FHEVM 会自动处理
     * 
     * @custom:how-it-works
     * 1. 前端使用 FHEVM SDK 加密数据
     * 2. SDK 自动生成输入证明并附加到加密数据
     * 3. 合约调用 TFHE.asEuint32() 时自动验证
     * 4. 验证通过后，数据可以安全使用
     */
    function processValue(bytes calldata encryptedValue) public returns (uint256) {
        // 这里会自动验证输入证明
        // 如果输入证明无效，会 revert
        euint32 value = TFHE.asEuint32(encryptedValue);
        
        // 允许合约存储
        TFHE.allowThis(value);
        
        uint256 id = nextId++;
        processedValues[id] = value;
        
        emit ValueProcessed(id);
        return id;
    }
    
    /**
     * @notice 处理多个加密值（批量验证输入证明）
     * @dev 演示批量处理时的输入证明验证
     * @custom:chapter input-proof
     * @param encryptedValues 加密值数组
     * @return ids 处理的ID数组
     * 
     * @custom:important
     * - 每个值都会独立验证输入证明
     * - 如果任何一个值的输入证明无效，整个函数会 revert
     */
    function processMultipleValues(bytes[] calldata encryptedValues) public returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](encryptedValues.length);
        
        for (uint256 i = 0; i < encryptedValues.length; i++) {
            // 每个值都会验证输入证明
            euint32 value = TFHE.asEuint32(encryptedValues[i]);
            TFHE.allowThis(value);
            
            uint256 id = nextId++;
            processedValues[id] = value;
            ids[i] = id;
            
            emit ValueProcessed(id);
        }
        
        return ids;
    }
    
    /**
     * @notice 获取处理的值
     * @dev 返回加密值，需要在前端解密
     * @param id 处理的ID
     * @return encryptedValue 加密的值
     */
    function getValue(uint256 id) public view returns (bytes memory) {
        require(processedValues[id].ciphertext.length > 0, "Value not found");
        return processedValues[id].ciphertext;
    }
}

