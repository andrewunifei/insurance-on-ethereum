// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {RegistrationParams} from "./Automation.sol";

interface AutomationRegistrarInterface {
    function registerUpkeep(
        RegistrationParams calldata requestParams
    ) external returns (uint256);
}

contract Upkeep {
    address public immutable i_link;
    address public immutable i_registrar;
    mapping (address => uint256[]) activeUpkeeps;
    uint96 public i_amount;

    constructor(
        address link,
        address registrar,
        uint96 amount
    ) {
        i_link = link;
        i_registrar = registrar;
        i_amount = amount;
    }

    function fund() public {
        LinkTokenInterface(i_link).transferFrom(msg.sender, address(this), i_amount);
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
