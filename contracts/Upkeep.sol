// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
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
    LinkTokenInterface public immutable i_link;
    AutomationRegistrarInterface public immutable i_registrar;
    mapping (address => uint256[]) activeUpkeeps;

    constructor(
        LinkTokenInterface link,
        AutomationRegistrarInterface registrar
    ) {
        i_link = link;
        i_registrar = registrar;
    }

    function register(RegistrationParams memory params) public returns (uint256) {
        i_link.approve(address(i_registrar), params.amount);

        uint256 upkeepID = i_registrar.registerUpkeep(params);

        if (upkeepID != 0) {
            activeUpkeeps[msg.sender].push(upkeepID);

            return upkeepID;
        } else {
            revert("auto-approve disabled");
        }
    }
}
