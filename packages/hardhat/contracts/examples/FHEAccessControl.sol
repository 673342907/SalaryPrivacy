// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title FHEAccessControl
 * @author ConfidentialSalary Team
 * @notice 演示 FHE 访问控制：FHE.allow() 和 FHE.allowTransient()
 * @dev 这是一个独立的示例，演示如何正确使用 FHE 访问控制
 * 
 * @custom:chapter access-control
 * 
 * 学习要点：
 * 1. FHE.allowThis() - 允许合约永久存储加密值
 * 2. FHE.allow() - 允许特定地址访问加密值
 * 3. FHE.allowTransient() - 允许临时访问加密值（仅在一次调用中有效）
 * 
 * @custom:example
 * ```solidity
 * // 存储加密值（永久）
 * contract.storeValue(encryptedValue);
 * 
 * // 允许特定用户访问
 * contract.allowUserAccess(encryptedValue, userAddress);
 * 
 * // 临时访问（仅本次调用有效）
 * contract.transientAccess(encryptedValue);
 * ```
 */
contract FHEAccessControl is EthereumConfig {
    // 存储加密值
    mapping(uint256 => euint32) public storedValues;
    uint256 public nextId = 1;
    
    // 允许访问的地址映射
    mapping(bytes32 => mapping(address => bool)) public allowedAccess;
    
    event ValueStored(uint256 indexed id);
    event AccessAllowed(uint256 indexed id, address indexed user);
    
    /**
     * @notice 存储加密值（永久）
     * @dev 演示如何使用 FHE.allowThis() 允许合约存储加密值
     * @custom:chapter access-control
     * @param encryptedValue 加密的值
     * @return id 存储的ID
     * 
     * @custom:important
     * - 使用 FHE.allowThis() 允许合约永久存储加密值
     * - 存储后，合约可以访问这个值进行计算
     * - 但其他地址默认无法访问
     */
    function storeValue(bytes calldata encryptedValue) public returns (uint256) {
        euint32 value = TFHE.asEuint32(encryptedValue);
        
        // 允许合约存储这个值（永久）
        TFHE.allowThis(value);
        
        uint256 id = nextId++;
        storedValues[id] = value;
        
        emit ValueStored(id);
        return id;
    }
    
    /**
     * @notice 允许特定用户访问加密值
     * @dev 演示如何使用 FHE.allow() 允许特定地址访问
     * @custom:chapter access-control
     * @param id 存储的ID
     * @param userAddress 允许访问的用户地址
     * 
     * @custom:important
     * - 使用 FHE.allow() 允许特定地址访问加密值
     * - 允许后，该地址可以解密这个值
     * - 这是访问控制的核心机制
     */
    function allowUserAccess(uint256 id, address userAddress) public {
        require(storedValues[id].ciphertext.length > 0, "Value not found");
        
        euint32 value = storedValues[id];
        
        // 允许特定地址访问这个加密值
        TFHE.allow(value, userAddress);
        
        // 记录允许的访问
        bytes32 valueHash = keccak256(storedValues[id].ciphertext);
        allowedAccess[valueHash][userAddress] = true;
        
        emit AccessAllowed(id, userAddress);
    }
    
    /**
     * @notice 临时访问加密值（仅本次调用有效）
     * @dev 演示如何使用 FHE.allowTransient() 进行临时访问
     * @custom:chapter access-control
     * @param id 存储的ID
     * @return result 加密的计算结果
     * 
     * @custom:important
     * - 使用 FHE.allowTransient() 允许临时访问
     * - 访问权限仅在本次函数调用中有效
     * - 调用结束后，访问权限自动撤销
     * - 适用于需要临时访问但不希望永久授权的场景
     */
    function transientAccess(uint256 id) public view returns (bytes memory) {
        require(storedValues[id].ciphertext.length > 0, "Value not found");
        
        euint32 value = storedValues[id];
        
        // 临时允许本次调用访问
        TFHE.allowTransient(value, msg.sender);
        
        // 可以在这里进行计算
        euint32 doubled = TFHE.mul(value, TFHE.asEuint32(2));
        
        return doubled.ciphertext;
    }
    
    /**
     * @notice 获取加密值（需要先允许访问）
     * @dev 演示如何获取已允许访问的加密值
     * @custom:chapter access-control
     * @param id 存储的ID
     * @return encryptedValue 加密的值
     * 
     * @custom:important
     * - 只有被允许访问的地址才能获取这个值
     * - 返回的是加密值，需要在前端解密
     */
    function getValue(uint256 id) public view returns (bytes memory) {
        require(storedValues[id].ciphertext.length > 0, "Value not found");
        
        bytes32 valueHash = keccak256(storedValues[id].ciphertext);
        require(
            allowedAccess[valueHash][msg.sender] || msg.sender == address(this),
            "Access denied"
        );
        
        return storedValues[id].ciphertext;
    }
}

