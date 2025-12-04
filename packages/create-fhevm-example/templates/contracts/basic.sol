// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title {{CONTRACT_NAME}}
 * @author ConfidentialSalary Team
 * @notice FHEVM example: {{NAME}}
 * @dev This is a basic FHEVM example contract
 * 
 * @custom:chapter basic
 */
contract {{CONTRACT_NAME}} is EthereumConfig {
    mapping(uint256 => euint32) public values;
    uint256 public nextId = 1;
    
    event ValueStored(uint256 indexed id);
    
    /**
     * @notice Store an encrypted value
     * @param encryptedValue The encrypted value to store
     * @return id The ID of the stored value
     */
    function storeValue(bytes calldata encryptedValue) public returns (uint256) {
        euint32 value = TFHE.asEuint32(encryptedValue);
        TFHE.allowThis(value);
        
        uint256 id = nextId++;
        values[id] = value;
        
        emit ValueStored(id);
        return id;
    }
    
    /**
     * @notice Get an encrypted value
     * @param id The ID of the value
     * @return encryptedValue The encrypted value
     */
    function getValue(uint256 id) public view returns (bytes memory) {
        require(values[id].ciphertext.length > 0, "Value not found");
        return values[id].ciphertext;
    }
}

