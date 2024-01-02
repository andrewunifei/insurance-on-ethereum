// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./AutomatedFunctionsConsumer.sol";
import "hardhat/console.sol"; // Comentar essa linha 

error NotOwner();

contract Institution{
    // payable para que seja possível para a instituição sacar os fundos desse contrato
    address immutable public i_owner;
    string public institutionName;
    string public id;
    mapping (string => string) info;
    mapping (address => bool) public whitelist;
    mapping (address => address[]) public contracts;

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

    function getInsurance(uint256 _index) view public returns (address){
        return contracts[msg.sender][_index];
    }

    // Criar um contrato agrícola
    function createInsuranceContract(
        address _deployer,
        address _farmer,
        int256 _humidityLimit,
        string memory _lat,
        string memory _lon,
        address oracle,
        uint64 _subscriptionId,
        uint32 _fulfillGasLimit,
        uint256 _updateInterval,
        uint256 _sampleMaxSize,
        uint256 _reparationValue
    ) external {
        require(whitelist[_farmer], "Endereco nao esta na lista branca");
        require(_reparationValue <= address(this).balance, "Sem fundos suficiente para financiar o contrato");

        contracts[_farmer].push(address(new AutomatedFunctionsConsumer{
            value: _reparationValue ether
        }(
            _deployer,
            _farmer,
            _humidityLimit,
            oracle,
            _subscriptionId,
            _fulfillGasLimit,
            _updateInterval,
            _sampleMaxSize,
            _reparationValue
        )));
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