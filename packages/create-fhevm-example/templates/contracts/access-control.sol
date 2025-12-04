// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title {{CONTRACT_NAME}}
 * @author ConfidentialSalary Team
 * @notice FHEVM example: {{NAME}} - Access Control
 * @dev Demonstrates FHE.allow(), FHE.allowTransient(), and FHE.allowThis()
 * 
 * @custom:chapter access-control
 */
contract {{CONTRACT_NAME}} is EthereumConfig {
    mapping(uint256 => euint32) public storedValues;
    mapping(bytes32 => mapping(address => bool)) public allowedAccess;
    uint256 public nextId = 1;
    
    event ValueStored(uint256 indexed id);
    event AccessAllowed(uint256 indexed id, address indexed user);
    
    /**
     * @notice Store an encrypted value (permanent)
     * @dev Uses FHE.allowThis() to allow contract to store
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
     * @notice Allow a specific user to access encrypted value
     * @dev Uses FHE.allow() to grant access
     */
    function allowUserAccess(uint256 id, address userAddress) public {
        require(storedValues[id].ciphertext.length > 0, "Value not found");
        
        euint32 value = storedValues[id];
        TFHE.allow(value, userAddress);
        
        bytes32 valueHash = keccak256(storedValues[id].ciphertext);
        allowedAccess[valueHash][userAddress] = true;
        
        emit AccessAllowed(id, userAddress);
    }
    
    /**
     * @notice Transient access (only for this call)
     * @dev Uses FHE.allowTransient() for temporary access
     */
    function transientAccess(uint256 id) public view returns (bytes memory) {
        require(storedValues[id].ciphertext.length > 0, "Value not found");
        
        euint32 value = storedValues[id];
        TFHE.allowTransient(value, msg.sender);
        
        euint32 doubled = TFHE.mul(value, TFHE.asEuint32(2));
        return doubled.ciphertext;
    }
    
    /**
     * @notice Get encrypted value (requires access permission)
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

