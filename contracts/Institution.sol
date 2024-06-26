// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./AutomatedFunctionsConsumer.sol";
import "hardhat/console.sol"; // Comentar essa linha 

error NotOwner();

contract Institution{
    address immutable public im_owner;
    string public institutionName;
    string[] public infoKeys; // Usar isso para retornar os valores do mapping 'info' em um loop off-chain
    mapping (string => string) public info;
    mapping (address => bool) public whitelist;
    mapping (address => bool) public blacklist;
    mapping (address => AutomatedFunctionsConsumer[]) public contracts; // Antes era mapping address => address[]
    mapping (uint8 => address[]) public farmers; // Usar essa variável dentro de um loop para buscar todos os contratos de seguro
    mapping(address => bool) public farmerExists;

    event InsuranceContractCreated(address insuranceContractAddress);

    modifier owner {
        if(msg.sender != im_owner) {
            revert NotOwner();
        }
        _;
    }

    constructor(address _owner, string[2][] memory infoArray) {
        im_owner = _owner;
        for(uint i = 0; i < infoArray.length; i++) {            
            info[infoArray[i][0]] = infoArray[i][1];
            infoKeys.push(infoArray[i][0]);
        }
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
     * Feature não-essencial: update info
     */

    /**
     * @notice Valida endereço do agricutor (adicionar na lista branca)
     * @param _farmerAddr Endereço da carteira do agricultor 
     */
    function whitelistAddr(address _farmerAddr) external {
        whitelist[_farmerAddr] = true;
        blacklist[_farmerAddr] = false;
    }

    /**
     * @notice Remove a validação do endereço do agricutor
     * @param _farmerAddr Endereço da carteira do agricultor 
     */
    function blacklistAddr(address _farmerAddr) external {
        whitelist[_farmerAddr] = false;
        blacklist[_farmerAddr] = true;
    }

    // Criar um contrato agrícola
    function createInsuranceContract(
        address _deployer,
        address _farmer,
        string memory _farmName,
        uint256 _humidityLimit,
        uint256 _sampleMaxSize,
        uint256 _reparationValue, // Essa variável espera um valor em wei
        uint256 _updateInterval,
        address router,
        address _registry,
        address _sepoliaLINKAddress,
        address _sepoliaRegistrarAddress,
        uint32 _fulfillGasLimit,
        bytes32 _donID,
        string memory _metricJS    
    ) external {
        require(whitelist[_farmer], "Endereco nao esta na lista branca");
        // require(_reparationValue <= address(this).balance, "Sem fundos suficiente para financiar o contrato");

        AutomatedFunctionsConsumer c = new AutomatedFunctionsConsumer{
            value: _reparationValue
        }(
            _deployer,
            _farmer,
            _farmName,
            _humidityLimit,
            _sampleMaxSize,
            _reparationValue,
            _updateInterval,
            router,
            _registry,
            _sepoliaLINKAddress,
            _sepoliaRegistrarAddress,
            _fulfillGasLimit,
            _donID,
            _metricJS            
        );
        contracts[_farmer].push(c);
        if(!farmerExists[_farmer]) {
            farmers[0].push(_farmer);
            farmerExists[_farmer] = true;
        }
        emit InsuranceContractCreated(address(c));
    }

    // ** GETTERS **
    /**
     * @notice retorna todos os contratos associados a um fazendeiro
     */
    function getAllInsuranceContracts(address _farmerAddress) view public returns (AutomatedFunctionsConsumer[] memory){
        return contracts[_farmerAddress];
    }

    /**
     * 
     * @notice retorna todos os endereços de fazendeiros com contrato ativo
     */
    function getAllFarmers() view public returns (address[] memory){
        return farmers[0];
    }
    // *********************

    /**
     * @notice Para sacar o balanço do contrato
     */
    function withdraw(uint amount) external owner {
        (bool callStatus, /* bytes memory data */) = payable(im_owner).call{value: amount}("");
        require(callStatus, "Withdraw failed.");
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