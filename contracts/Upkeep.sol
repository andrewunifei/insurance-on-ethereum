// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "hardhat/console.sol"; // Comentar essa linha 

struct RegistrationParams {
    string name;
    bytes encryptedEmail;
    address upkeepContract;
    uint32 gasLimit;
    address adminAddress;
    bytes checkData;
    bytes offchainConfig;
    uint96 amount;
}

interface AutomationRegistrarInterface {
    function registerUpkeep(
        RegistrationParams calldata requestParams
    ) external returns (uint256);
}

contract Upkeep {
    address public immutable i_link;
    address public immutable i_registrar;
    mapping (address => uint256[]) activeUpkeeps;

    constructor(
        address link,
        address registrar
    ) {
        i_link = link;
        i_registrar = registrar;
    }

    function register(RegistrationParams calldata params) external returns (uint256) {
        LinkTokenInterface(i_link).approve(i_registrar, params.amount);

        uint256 upkeepId = AutomationRegistrarInterface(i_registrar).registerUpkeep(params);

        if (upkeepId != 0) {
            activeUpkeeps[msg.sender].push(upkeepId);

            return upkeepId;
        } else {
            revert("auto-approve disabled");
        }
    }
}
