// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title FHEAntipatterns
 * @author Zama Bounty Program
 * @notice 演示 FHEVM 的常见反模式和错误用法
 * @dev 这个合约展示了常见的错误，帮助开发者避免这些陷阱
 * 
 * @custom:chapter antipatterns
 * 
 * 常见反模式：
 * 1. ❌ 在 view 函数中返回加密值（euint32）
 * 2. ❌ 忘记使用 FHE.allowThis()
 * 3. ❌ 尝试在合约中解密值
 * 4. ❌ 在事件中记录加密值
 * 5. ❌ 使用 require() 直接比较加密值
 */
contract FHEAntipatterns is EthereumConfig {
    mapping(uint256 => euint32) public storedValues;
    uint256 public nextId = 1;
    
    /**
     * @notice ✅ 正确：存储加密值
     * @dev 这是正确的做法：使用 FHE.allowThis() 允许存储
     */
    function correctStoreValue(bytes calldata encryptedValue) public returns (uint256) {
        euint32 value = TFHE.asEuint32(encryptedValue);
        
        // ✅ 正确：使用 FHE.allowThis() 允许合约存储
        TFHE.allowThis(value);
        
        uint256 id = nextId++;
        storedValues[id] = value;
        return id;
    }
    
    /**
     * @notice ❌ 错误示例：忘记使用 FHE.allowThis()
     * @dev 这会导致编译错误或运行时错误
     * @custom:antipattern missing-allow
     */
    function wrongStoreValue(bytes calldata encryptedValue) public returns (uint256) {
        euint32 value = TFHE.asEuint32(encryptedValue);
        
        // ❌ 错误：忘记使用 FHE.allowThis()
        // 这会导致合约无法访问这个值
        
        uint256 id = nextId++;
        // storedValues[id] = value; // 这行会失败
        return id;
    }
    
    /**
     * @notice ✅ 正确：在 view 函数中返回 bytes
     * @dev 这是正确的做法：返回 bytes，让用户在前端解密
     */
    function correctGetValue(uint256 id) public view returns (bytes memory) {
        require(storedValues[id].ciphertext.length > 0, "Value not found");
        
        // ✅ 正确：返回 bytes
        return storedValues[id].ciphertext;
    }
    
    /**
     * @notice ❌ 错误示例：在 view 函数中返回 euint32
     * @dev 这会导致编译错误
     * @custom:antipattern view-encrypted-return
     */
    // function wrongGetValue(uint256 id) public view returns (euint32) {
    //     // ❌ 错误：view 函数不能返回加密类型
    //     // return storedValues[id]; // 这会导致编译错误
    // }
    
    /**
     * @notice ✅ 正确：使用 FHE 比较操作
     * @dev 在不解密的情况下进行比较
     */
    function correctCompare(uint256 id1, uint256 id2) public view returns (bytes memory) {
        euint32 value1 = storedValues[id1];
        euint32 value2 = storedValues[id2];
        
        // ✅ 正确：使用 TFHE.gt() 在加密状态下比较
        ebool isGreater = TFHE.gt(value1, value2);
        
        return isGreater.ciphertext;
    }
    
    /**
     * @notice ❌ 错误示例：尝试直接比较加密值
     * @dev 这会导致编译错误
     * @custom:antipattern direct-comparison
     */
    // function wrongCompare(uint256 id1, uint256 id2) public view returns (bool) {
    //     euint32 value1 = storedValues[id1];
    //     euint32 value2 = storedValues[id2];
    //     
    //     // ❌ 错误：不能直接比较加密值
    //     // return value1 > value2; // 这会导致编译错误
    // }
    
    /**
     * @notice ✅ 正确：在事件中只记录非敏感信息
     * @dev 事件中不应该包含加密值
     */
    event ValueStored(uint256 indexed id, address indexed user);
    
    function correctEmitEvent(uint256 id) public {
        // ✅ 正确：只记录 ID 和地址，不记录加密值
        emit ValueStored(id, msg.sender);
    }
    
    /**
     * @notice ❌ 错误示例：在事件中记录加密值
     * @dev 这会导致编译错误或安全问题
     * @custom:antipattern event-encrypted-value
     */
    // event WrongValueStored(uint256 indexed id, euint32 value); // ❌ 错误
    
    /**
     * @notice ✅ 正确：使用 FHE 操作进行计算
     * @dev 在不解密的情况下进行计算
     */
    function correctCalculate(uint256 id) public view returns (bytes memory) {
        euint32 value = storedValues[id];
        
        // ✅ 正确：使用 TFHE 操作进行计算
        euint32 doubled = TFHE.mul(value, TFHE.asEuint32(2));
        
        return doubled.ciphertext;
    }
    
    /**
     * @notice ❌ 错误示例：尝试解密值进行计算
     * @dev 这是不可能的，合约无法解密值
     * @custom:antipattern decrypt-in-contract
     */
    // function wrongCalculate(uint256 id) public view returns (uint32) {
    //     euint32 value = storedValues[id];
    //     
    //     // ❌ 错误：合约无法解密值
    //     // uint32 decrypted = TFHE.decrypt(value); // 这个函数不存在
    // }
}

