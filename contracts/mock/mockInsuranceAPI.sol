// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./mockInstitution.sol";

contract InsuranceAPI {
    mapping (address => Institution[]) public institutions;
    mapping (address => uint256) public donators;
    address[] public donatorsAddresses;
    address public immutable im_owner;

    event InstitutionCreated(address institutionAddress);

    modifier owner {
        if(msg.sender != im_owner) {
            revert NotOwner();
        }
        _;
    }

    constructor(address _owner){
        im_owner = _owner;
    }

    // Usando o mesmo endereço permite a criação de diversos contratos que representam Instituições
    // Pode ser resgatado com índice
    // No front-end talvez de pra fazer um mapeamento de nome para índice de lista equivalente
    function createInstitution(string memory _institutionName) external {
        Institution i = new Institution(
            msg.sender,
            _institutionName
        );
        institutions[msg.sender].push(i);
        // usedAddresses.push(msg.sender);

        emit InstitutionCreated(address(i));
    }

    function getAllInstitution() public view returns (Institution[] memory) {
        return institutions[msg.sender];
    }

    function donate() public payable {
        donators[msg.sender] += msg.value;
        donatorsAddresses.push(msg.sender);
    }

    function getAllDonators() public view returns (address[] memory){
        return donatorsAddresses;
    }

    receive() external payable {
        donate();
    }

    fallback() external payable {
        donate();
    }

    function withdraw() external owner {
        (bool callStatus, /* bytes memory data */) = payable(im_owner).call{value: address(this).balance}("");
        require(callStatus, "Withdraw failed.");
    }
}
