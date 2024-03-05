// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./mockAutomatedFunctionsConsumer.sol";
import "hardhat/console.sol"; // Comentar essa linha 

error NotOwner();

contract Institution{
    address immutable public im_owner;
    string public institutionName;
    string[] public infoKeys;
    mapping (string => string) public info;
    mapping (address => bool) public whitelist;
    mapping (address => AutomatedFunctionsConsumer[]) public contracts;

    event InsuranceContractCreated(address insuranceContractAddress);

    modifier owner {
        if(msg.sender != im_owner) {
            revert NotOwner();
        }
        _;
    }

    constructor(address _owner, string memory _institutionName) {
        im_owner = _owner;
        institutionName = _institutionName;
    }

    /**
     * @notice Dicionário para a instituição registrar informações adicionais além do que está no construtor
     * @param infoArray Lista de listas com informações chave valor
     */
    function registerInfo(string[2][] memory infoArray) external owner {
        for(uint i = 0; i < infoArray.length; i++) {            
            info[infoArray[i][0]] = infoArray[i][1];
            infoKeys.push(infoArray[i][0]);
        }
    }

    /**
     * @notice Valida endereço do agricutor (adicionar na lista branca)
     * @param _farmerAddr Endereço da carteira do agricultor 
     */
    function whitelistAddr(address _farmerAddr) external {
        whitelist[_farmerAddr] = true;
    }

    /**
     * @notice Remove a validação do endereço do agricutor
     * @param _farmerAddr Endereço da carteira do agricultor 
     */
    function blacklistAddr(address _farmerAddr) external {
        whitelist[_farmerAddr] = false;
    }

    // Criar um contrato agrícola
    function createInsuranceContract(
        address _deployer,
        address _farmer,
        uint256 _humidityLimit,
        uint256 _sampleMaxSize,
        uint256 _reparationValue,
        uint256 _updateInterval,
        address router,
        uint64 _subscriptionId,
        address _registry, // Era: IAutomationRegistryConsumer _registry
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

    // function getInsurance(uint256 _index) view public returns (AutomatedFunctionsConsumer){
    //     return contracts[msg.sender][_index];
    // }

    /**
     * @notice Para sacar o balanço do contrato
     */
    function withdraw() external owner {
        (bool callStatus, /* bytes memory data */) = payable(im_owner).call{value: address(this).balance}("");
        require(callStatus, "O saque falhou.");
    }

    /**
     * @notice Para consultar o balanço do contrato
     */
    function contractBalance() public view returns (uint){
        return address(this).balance;
    }

    /**
     * @notice Função para receber ether, msg.data deve estar vazio
     */
    receive() external payable {}

}