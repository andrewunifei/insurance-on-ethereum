// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/** 
 * @notice Interface para interagir com upkeep criado para automação
 */ 
interface IAutomationRegistryConsumer {
  function getBalance(uint256 id) external view returns (uint96 balance);
  function getMinBalance(uint256 id) external view returns (uint96 minBalance);
  function cancelUpkeep(uint256 id) external;
  function pauseUpkeep(uint256 id) external;
  function unpauseUpkeep(uint256 id) external;
  function addFunds(uint256 id, uint96 amount) external;
  function withdrawFunds(uint256 id, address to) external;
}

/**
 * @notice Upkeep parameters
 */
struct RegistrationParams {
    string  name;
    bytes   encryptedEmail;
    address upkeepContract;
    uint32  gasLimit;
    address adminAddress;
    uint8   triggerType;
    bytes   checkData;
    bytes   triggerConfig;
    bytes   offchainConfig;
    uint96  amount;
}