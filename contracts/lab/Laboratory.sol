// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol"; // Comentar essa linha 

contract Laboratory {
    bytes32 public funBytes32;
    bytes32 public counterBytes32;
    uint256 public funBits256 = 1;
    string public decoded;

    constructor(bytes32 _incomingData) {
        funBytes32 = _incomingData;
        decoded = string(abi.encodePacked(funBytes32));
        counterBytes32 = bytes32(funBits256);

        console.logBytes32(funBytes32);
        console.log(decoded);
        console.logBytes32(counterBytes32);
    }

    function increaseCounter() public {
        funBits256 += 1;
        counterBytes32 = bytes32(funBytes32);
    }

    function decodeCounter() public view {
        string memory tempStr = string(abi.encodePacked(counterBytes32));

        console.log(tempStr);
    }

}