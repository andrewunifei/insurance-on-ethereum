// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {Functions, FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {Upkeep} from "./Upkeep.sol";
import "hardhat/console.sol"; // Comentar essa linha 

/** 
 * @notice Interface para interagir com upkeep criado para automação
 */ 
interface IAutomationRegistryConsumer {
  function getBalance(uint256 id) external view returns (uint96 balance);
  function getMinBalance(uint256 id) external view returns (uint96 minBalance);
  function cancelUpkeep(uint256 id) external;
  function pauseUpkeep(uint256 id) external;
  function unpauseUpkeep(uint256 id) external;
  function addFunds(uint256 id, uint96 amount) external;
  function withdrawFunds(uint256 id, address to) external;
}

/**
 * @title Automated Functions Consumer
 * 
 * @notice Esse contrato é usado para iniciar Contratos de Seguro automatizados
 * @notice Ele é automatizado, então em intervalos pré-especificados ele lê dados climáticos
 * @notice Se os dados estão fora dos índices pré-definidos a função [INSERIR NOME DA FUNÇÃO] é disparada
 */
contract AutomatedFunctionsConsumer is FunctionsClient, ConfirmedOwner, AutomationCompatibleInterface {
  using Functions for Functions.Request;

  bytes public requestCBOR; // Concise Binary Object Representation para transferência de dados
  bytes32 public latestRequestId;
  bytes public latestResponse;
  bytes public latestError;
  uint64 public subscriptionId;
  uint32 public fulfillGasLimit;
  uint256 public updateInterval;
  uint256 public lastUpkeepTimeStamp;
  uint256 public upkeepCounter;
  uint256 public responseCounter;
  uint8 private controlFlag;

  // Configuracao da automacao
  IAutomationRegistryConsumer public immutable registry;
  Upkeep public s_upkeep;
  uint256 upkeepID;

  address public institution;
  address public farmer;
  address public upkeepContract;

  // Valores para regras de negócio
  uint256 reparationValue;
  uint256 humidityLimit;
  uint256 public sampleMaxSize;
  string[] public sampleStorage;
  string private computationJS; // calculo da computacao do indice

  // Variável para armazenar a média das amostras
  uint256 private mean;

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
  event upkeepRegistered(uint256 indexed upkeepID);

  /**
   * @notice Reverte se chamado por qualquer um menos o repositório de automação.
   */
  modifier onlyAllowed() {
      if (msg.sender != owner() && msg.sender != upkeepContract)
          revert NotAllowedCaller(msg.sender, owner(), upkeepContract);
      _;
  }

  /**
   * @notice Construtor do contrato
   *
   * @param _humidityLimit O índice limite de comparação
   * @param oracle O contrato do oráculo interface do Chainlink Functions
   * @param _subscriptionId O ID da subscrição na Rede Descentralizada de Oráculos (DON) para cobranças de requisições
   * @param _fulfillGasLimit Máximo de gás permitido para chamar a função `handleOracleFulfillment`
   * @param _updateInterval O intervalo de tempo que a Chainlink Automation deve chamar a `performUpkeep`
   */
  constructor(
    address _deployer,
    address _farmer,
    int256 _humidityLimit,
    address oracle,
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    uint256 _updateInterval,
    uint256 _sampleMaxSize,
    uint256 _reparationValue,
    IAutomationRegistryConsumer _registry,
    
    // Se for necessário mudar também é preciso importar as bibliotecas desses tipo de dados
    address sepoliaLINKAddress, // Aqui para LinkTokenInterface
    address sepoliaRegistrarAddress // Aqui para AutomationRegistrarInterface
  ) FunctionsClient(oracle) ConfirmedOwner(_deployer) public payable {
    institution = msg.sender;
    farmer = _farmer;
    humidityLimit = _humidityLimit; 
    subscriptionId = _subscriptionId;
    fulfillGasLimit = _fulfillGasLimit;
    updateInterval = _updateInterval;
    sampleMaxSize = _sampleMaxSize;
    reparationValue = _reparationValue;
    registry = _registry;
    i_upkeep = new Upkeep(sepoliaLINKAddress, sepoliaRegistrarAddress);

    lastUpkeepTimeStamp = block.timestamp;
  }

  /**
   * @notice Registrando um novo upkeep
   */

  function registerUpkeep(params) public {
    upkeepID = i_upkeep.register(params);

    emit upkeepRegistered(upkeepID);
  }

  /**
   * @notice Gera um novo objeto Functions.Request codificado em CBOR
   * @notice O modificador `pure` permite que o objeto CBOR seja gerado fora da blockchain, dessa forma a função se torna mais economica
   * 
   * @param source Código fonte em JavaScript para requisição
   * @param secrets Informações sensíveis que serão escondidas da blockchain durante a transação
   * @param args Lista de string com argumentos que podem ser acessados no código fonte
   */
  function generateRequest(
    string calldata source,
    bytes calldata secrets,
    string[] calldata args
  ) public pure returns (bytes memory) {
    Functions.Request memory req;
    req.initializeRequest(Functions.Location.Inline, Functions.CodeLanguage.JavaScript, source);
    if (secrets.length > 0) {
      req.addRemoteSecrets(secrets);
    }

    if (args.length > 0) {
      req.addArgs(args);
    }

    return req.encodeCBOR();
  }

  /**
   * @notice Muda o estado do contrato para armazenar o objeto Functions.Request codificado em CBOR
   * @notice Essas informações são enviados para a `performUpkeep` quando esta é chamada
   * 
   * @param _subscriptionId O ID da subscrição na Rede Descentralizada de Oráculos para cobranças de requisições
   * @param _fulfillGasLimit Máximo de gás permitido para chamar a função `handleOracleFulfillment`
   * @param _updateInterval O intervalo de tempo que a Chainlink Automation deve chamar a `performUpkeep`
   * @param newRequestCBOR Bytes representando o objeto Functions.Request codificado em CBOR
   */
  function setRequest(
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    uint256 _updateInterval,
    bytes calldata newRequestCBOR
  ) external onlyOwner {
    updateInterval = _updateInterval;
    subscriptionId = _subscriptionId;
    fulfillGasLimit = _fulfillGasLimit;
    requestCBOR = newRequestCBOR;
  }

  /**
   * @notice Usado por Chainlink Automation para checar se `performUpkeep` deve ser chamada
   */
  function checkUpkeep(bytes memory) public view override returns (bool upkeepNeeded, bytes memory) {
    upkeepNeeded = (block.timestamp - lastUpkeepTimeStamp) > updateInterval;
  }

  /**
   * @notice Chamada por Chainlink Automation para realizar uma requisição através da Chainlink Functions
   */
  function performUpkeep(bytes calldata) external onlyAllowed override {
    (bool upkeepNeeded, ) = checkUpkeep("");
    require(upkeepNeeded, "Time interval not met");
    lastUpkeepTimeStamp = block.timestamp;
    upkeepCounter = upkeepCounter + 1;

    // se a quantidade de amostras não é o suficiente, coleta nova amostra 
    if(sampleMaxSize > sampleStorage.length){
      bytes32 requestId = s_oracle.sendRequest(subscriptionId, requestCBOR, fulfillGasLimit);

      s_pendingRequests[requestId] = s_oracle.getRegistry();
      emit RequestSent(requestId);
      latestRequestId = requestId;
    }
    else{ // se a quantidade de amostras é o suficiente entao:
      require(upkeepID != 0, "Upkeep not registered");

      controlFlag = 1;

      bytes memory encodedCBOR = generateRequest(computationJS, "0x", sampleStorage);
  
      bytes32 requestId = s_oracle.sendRequest(subscriptionId, encodedCBOR, fulfillGasLimit);

      s_pendingRequests[requestId] = s_oracle.getRegistry();
      emit RequestSent(requestId);
      latestRequestId = requestId;

      registry.pauseUpkeep(upkeepID);
    }
  }

  function verifyIndex(uint256 mean) internal {
    if(mean < humidityLimit){
      // Transfere para a conta do agricultor
      (bool sent, /* bytes memory data */) = payable(farmer).call{value: address(this).balance}("");
      require(sent, "Erro ao pagar a indenizacao");
    }
    else{
      // Transfere para a conta da instituição
      (bool sent, /* bytes memory data */) = payable(institution).call{value: address(this).balance}("");
      require(sent, "Erro ao retornar os fundos para a instituicao");
    }
  }

  /**
   * @notice Callback chamada quando a Rede Descentralizada de Oráculos termina a requisição
   *
   * @param requestId O ID da requisição retornado por `s_oracle.sendRequest()`
   * @param response Resposta da requisição
   * @param err Erro do código fonte ou do pipeline de execução da requisição
   */
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
    latestResponse = response;
    latestError = err;
    responseCounter = responseCounter + 1;

    if(controlFlag == 0){
      string memory responseAsString = string(bytes32(response));

      // Armazena no array as amostras de dados
      sampleStorage.push(responseAsString);
    }
    else{
      // Refazer isso para que a rede Chainlink realize uma computação do índice mais complexo do que a média
      // Essa computação do índice deve ser com base na literatura científica
      mean = uint256(bytes32(response)); // remover

      verifyIndex(mean); // remover
    }

    emit OCRResponse(requestId, response, err);
  }

  // Consultar o balanço do contrato
  function contractBalance() public view returns (uint){
    return address(this).balance;
  }
}
