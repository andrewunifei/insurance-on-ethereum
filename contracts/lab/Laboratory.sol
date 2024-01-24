// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol"; // Comentar essa linha 

contract Laboratory {
    bytes32 public funBytes32;
    bytes32 public counterBytes32;
    uint256 public funBits256 = 1;
    string public decoded;
    string[] public sampleStorage; 

    constructor(bytes32 _incomingData) {
        funBytes32 = _incomingData;
        decoded = string(abi.encodePacked(funBytes32));
        counterBytes32 = bytes32(funBits256);

        console.logBytes32(funBytes32);
        console.log(decoded);
        console.logBytes32(counterBytes32);
    }

    function insert(string calldata data) public {
        sampleStorage.push(data);
    }

    function sampleStorageSize() public view returns (uint256){
        return sampleStorage.length;
    }
}