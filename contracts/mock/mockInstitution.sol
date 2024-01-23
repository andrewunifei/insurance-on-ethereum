// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./mockAutomatedFunctionsConsumer.sol";
import "hardhat/console.sol"; // Comentar essa linha 

error NotOwner();

contract Institution{
    // payable para que seja possível para a instituição sacar os fundos desse contrato
    address immutable public i_owner;
    string public institutionName;
    string public id;
    mapping (string => string) info;
    mapping (address => bool) public whitelist;
    mapping (address => AutomatedFunctionsConsumer[]) public contracts; // Antes era mapping address => address[]

    event InsuranceContractCreated(address insuranceContractAddress);

    modifier owner {
        if(msg.sender != i_owner) {
            revert NotOwner();
        }
        _;
    }

    constructor(address _owner, string memory _institutionName) {
        i_owner = _owner;
        institutionName = _institutionName;
    }

    // Dicionário para a instituição registrar informações adicionais além do que está no construtor
    // Exemplo de informaçãoa adicional: endereço físico
    function registerInfo(string memory _name, string memory _description) external owner {
        info[_name] = _description;
    }

    // Valida endereço do agricutor (adicionar na lista branca)
    function whitelistAddr(address _farmerAddr) external {
        whitelist[_farmerAddr] = true;
    }

    function blacklistAddr(address _farmerAddr) external {
        whitelist[_farmerAddr] = false;
    }

    function isWhiteListed(address _farmerAddr) view external returns (bool) {
        bool result = whitelist[_farmerAddr];
        console.log(result);

        return result;
    }

    function getInsurance(uint256 _index) view public returns (AutomatedFunctionsConsumer){
        return contracts[msg.sender][_index];
    }

    // Criar um contrato agrícola
    function createInsuranceContract(
        address _deployer,
        address _farmer,
        uint256 _humidityLimit,
        uint256 _sampleMaxSize,
        uint256 _reparationValue,
        uint256 _updateInterval,
        // string memory _lat,
        // string memory _lon,
        address router,
        uint64 _subscriptionId,
        address _registry, //Era: IAutomationRegistryConsumer _registry
        address _sepoliaLINKAddress,
        address _sepoliaRegistrarAddress,
        uint32 _fulfillGasLimit    
    ) external {
        require(whitelist[_farmer], "Endereco nao esta na lista branca");
        // require(_reparationValue <= address(this).balance, "Sem fundos suficiente para financiar o contrato");

        AutomatedFunctionsConsumer c = new AutomatedFunctionsConsumer{
            value: _reparationValue
        }(
            _deployer,
            _farmer,
            _humidityLimit,
            _sampleMaxSize,
            _reparationValue,
            _updateInterval,
            router,
            _subscriptionId,
            _registry,
            _sepoliaLINKAddress,
            _sepoliaRegistrarAddress,
            _fulfillGasLimit            
        );
        contracts[_farmer].push(c);

        emit InsuranceContractCreated(address(c));
    }

    // Sacar o balanço do contrato
    function withdraw() external owner {
        (bool callStatus, /* bytes memory data */) = payable(i_owner).call{value: address(this).balance}("");
        require(callStatus, "O saque falhou.");
    }

    // Consultar o balanço do contrato
    function contractBalance() public view returns (uint){
        return address(this).balance;
    }

    // Função para receber ether, msg.data deve estar vazio
    receive() external payable {}

}