// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./Institution.sol";

contract InsuranceAPI {
    mapping (address => address[]) private institutions;
    mapping (address => uint256) public donators;
    address public immutable i_owner;

    modifier owner {
        if(msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    constructor(address _owner){
        i_owner = _owner;
    }

    // Usando o mesmo endereço permite a criação de diversos contratos que representam Instituições
    // Pode ser resgatado com índice
    // No front-end talvez de pra fazer um mapeamento de nome para índice de lista equivalente
    function createInstitution(string memory _institutionName) external {
        institutions[msg.sender].push(address(new Institution(
            msg.sender,
            _institutionName
        )));
        // usedAddresses.push(msg.sender);
    }

    function getInstitution(uint256 _index) view public returns (address){
        return institutions[msg.sender][_index];
    }

    function donate() public payable {
        donators[msg.sender] += msg.value;
    }

    receive() external payable {
        donate();
    }

    fallback() external payable {
        donate();
    }

    function withdraw() external owner {
        (bool callStatus, /* bytes memory data */) = payable(i_owner).call{value: address(this).balance}("");
        require(callStatus, "O saque falhou.");
    }
}
