// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { EthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { TFHE } from "@fhevm/solidity/TFHE.sol";

/**
 * @title FHEVestingWallet
 * @author ConfidentialSalary Team
 * @notice 演示使用 FHE 实现隐私保护的归属钱包
 * @dev 这是一个高级示例，展示 FHE 在金融场景中的应用
 * 
 * @custom:chapter advanced-examples
 * 
 * 学习要点：
 * 1. 如何在归属期间保护金额隐私
 * 2. 如何在不解密的情况下检查归属状态
 * 3. 如何实现时间锁定的加密金额
 * 
 * @custom:example
 * ```solidity
 * // 创建归属钱包
 * contract.createVesting(recipient, encryptedAmount, duration);
 * 
 * // 检查可提取金额（不解密总金额）
 * contract.getReleasable(vestingId);
 * 
 * // 提取已归属金额
 * contract.release(vestingId);
 * ```
 */
contract FHEVestingWallet is EthereumConfig {
    struct Vesting {
        address beneficiary;
        uint256 startTime;
        uint256 duration;
        euint32 totalAmount; // 加密的总金额
        euint32 released; // 加密的已释放金额
        bool exists;
    }
    
    mapping(uint256 => Vesting) public vestings;
    uint256 public nextVestingId = 1;
    
    address public owner;
    
    event VestingCreated(uint256 indexed vestingId, address indexed beneficiary);
    event Released(uint256 indexed vestingId, bytes encryptedAmount);
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice 创建归属钱包
     * @dev 演示如何存储加密的归属金额
     * @custom:chapter advanced-examples
     * @param beneficiary 受益人地址
     * @param encryptedAmount 加密的总金额
     * @param duration 归属期限（秒）
     * @return vestingId 归属钱包ID
     */
    function createVesting(
        address beneficiary,
        bytes calldata encryptedAmount,
        uint256 duration
    ) public returns (uint256) {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(duration > 0, "Duration must be greater than 0");
        
        euint32 amount = TFHE.asEuint32(encryptedAmount);
        TFHE.allowThis(amount);
        
        uint256 vestingId = nextVestingId++;
        vestings[vestingId] = Vesting({
            beneficiary: beneficiary,
            startTime: block.timestamp,
            duration: duration,
            totalAmount: amount,
            released: TFHE.asEuint32(0),
            exists: true
        });
        
        emit VestingCreated(vestingId, beneficiary);
        return vestingId;
    }
    
    /**
     * @notice 计算可释放金额（加密状态）
     * @dev 演示如何在不解密总金额的情况下计算可释放金额
     * @custom:chapter advanced-examples
     * @param vestingId 归属钱包ID
     * @return encryptedReleasable 加密的可释放金额
     */
    function getReleasable(uint256 vestingId) public view returns (bytes memory) {
        require(vestings[vestingId].exists, "Vesting does not exist");
        
        Vesting memory vesting = vestings[vestingId];
        
        if (block.timestamp < vesting.startTime) {
            return TFHE.asEuint32(0).ciphertext;
        }
        
        uint256 elapsed = block.timestamp - vesting.startTime;
        if (elapsed >= vesting.duration) {
            // 完全归属
            euint32 releasable = TFHE.sub(vesting.totalAmount, vesting.released);
            return releasable.ciphertext;
        }
        
        // 部分归属：计算已归属的比例
        // 注意：FHE 不支持浮点数，这里需要特殊处理
        // 简化版本：返回总金额（实际实现需要更复杂的逻辑）
        euint32 releasable = TFHE.sub(vesting.totalAmount, vesting.released);
        return releasable.ciphertext;
    }
    
    /**
     * @notice 释放已归属金额
     * @dev 受益人调用此函数提取已归属的金额
     * @custom:chapter advanced-examples
     * @param vestingId 归属钱包ID
     */
    function release(uint256 vestingId) public {
        require(vestings[vestingId].exists, "Vesting does not exist");
        require(
            msg.sender == vestings[vestingId].beneficiary || msg.sender == owner,
            "Not authorized"
        );
        
        Vesting storage vesting = vestings[vestingId];
        require(block.timestamp >= vesting.startTime, "Vesting not started");
        
        // 计算可释放金额（加密状态）
        uint256 elapsed = block.timestamp - vesting.startTime;
        if (elapsed >= vesting.duration) {
            // 完全归属
            euint32 releasable = TFHE.sub(vesting.totalAmount, vesting.released);
            vesting.released = vesting.totalAmount;
            emit Released(vestingId, releasable.ciphertext);
        } else {
            // 部分归属（简化实现）
            euint32 releasable = TFHE.sub(vesting.totalAmount, vesting.released);
            vesting.released = vesting.totalAmount; // 简化：全部释放
            emit Released(vestingId, releasable.ciphertext);
        }
    }
    
    /**
     * @notice 获取归属信息
     * @dev 返回归属钱包的公开信息
     * @param vestingId 归属钱包ID
     * @return beneficiary 受益人
     * @return startTime 开始时间
     * @return duration 归属期限
     * @return encryptedTotal 加密的总金额
     * @return encryptedReleased 加密的已释放金额
     */
    function getVesting(uint256 vestingId)
        public
        view
        returns (
            address beneficiary,
            uint256 startTime,
            uint256 duration,
            bytes memory encryptedTotal,
            bytes memory encryptedReleased
        )
    {
        require(vestings[vestingId].exists, "Vesting does not exist");
        Vesting memory vesting = vestings[vestingId];
        
        return (
            vesting.beneficiary,
            vesting.startTime,
            vesting.duration,
            vesting.totalAmount.ciphertext,
            vesting.released.ciphertext
        );
    }
}

