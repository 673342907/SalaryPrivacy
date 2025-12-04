// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title {{CONTRACT_NAME}}
 * @author ConfidentialSalary Team
 * @notice FHEVM example: {{NAME}} - Arithmetic Operations
 * @dev Demonstrates FHE arithmetic: add, sub, mul, div
 * 
 * @custom:chapter basic
 * @custom:chapter fhe-calculations
 */
contract {{CONTRACT_NAME}} is EthereumConfig {
    mapping(uint256 => euint32) public values;
    uint256 public nextId = 1;
    
    event ValueStored(uint256 indexed id);
    event CalculationPerformed(string operation, uint256 id1, uint256 id2);
    
    function storeValue(bytes calldata encryptedValue) public returns (uint256) {
        euint32 value = TFHE.asEuint32(encryptedValue);
        TFHE.allowThis(value);
        
        uint256 id = nextId++;
        values[id] = value;
        
        emit ValueStored(id);
        return id;
    }
    
    function add(uint256 id1, uint256 id2) public view returns (bytes memory) {
        require(values[id1].ciphertext.length > 0, "Value 1 not found");
        require(values[id2].ciphertext.length > 0, "Value 2 not found");
        
        euint32 a = values[id1];
        euint32 b = values[id2];
        euint32 sum = TFHE.add(a, b);
        
        emit CalculationPerformed("add", id1, id2);
        return sum.ciphertext;
    }
    
    function sub(uint256 id1, uint256 id2) public view returns (bytes memory) {
        require(values[id1].ciphertext.length > 0, "Value 1 not found");
        require(values[id2].ciphertext.length > 0, "Value 2 not found");
        
        euint32 a = values[id1];
        euint32 b = values[id2];
        euint32 diff = TFHE.sub(a, b);
        
        emit CalculationPerformed("sub", id1, id2);
        return diff.ciphertext;
    }
    
    function mul(uint256 id1, uint256 id2) public view returns (bytes memory) {
        require(values[id1].ciphertext.length > 0, "Value 1 not found");
        require(values[id2].ciphertext.length > 0, "Value 2 not found");
        
        euint32 a = values[id1];
        euint32 b = values[id2];
        euint32 prod = TFHE.mul(a, b);
        
        emit CalculationPerformed("mul", id1, id2);
        return prod.ciphertext;
    }
    
    function div(uint256 id1, uint256 id2) public view returns (bytes memory) {
        require(values[id1].ciphertext.length > 0, "Value 1 not found");
        require(values[id2].ciphertext.length > 0, "Value 2 not found");
        
        euint32 a = values[id1];
        euint32 b = values[id2];
        euint32 quot = TFHE.div(a, b);
        
        emit CalculationPerformed("div", id1, id2);
        return quot.ciphertext;
    }
    
    function getValue(uint256 id) public view returns (bytes memory) {
        require(values[id].ciphertext.length > 0, "Value not found");
        return values[id].ciphertext;
    }
}

