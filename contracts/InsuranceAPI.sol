// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./Institution.sol";

contract InsuranceAPI {
    // mapping (address => address[]) private institutions; --> Depende da minha escolha na função createInstitution()
    mapping (address => Institution[]) private institutions;
    mapping (address => uint256) public donators;
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
        institutions[msg.sender].push(i); // Talvez eu queira apenas amarzenar o endereço. O que for mais fãcil para manipular o contrato futuramente
        // usedAddresses.push(msg.sender);

        emit InstitutionCreated(address(i));
    }

    function getInstitution(uint256 _index) view public returns(Institution) {
        return institutions[msg.sender][_index];
    }

    function donate() private payable {
        donators[msg.sender] += msg.value;
    }

    receive() external payable {
        donate();
    }

    fallback() external payable {
        donate();
    }

    function withdraw() external owner {
        (bool callStatus, /* bytes memory data */) = payable(im_owner).call{value: address(this).balance}("");
        require(callStatus, "O saque falhou.");
    }
}
