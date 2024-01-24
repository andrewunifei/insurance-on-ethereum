// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import { FunctionsClient } from "./mockChainlink/mockFunctionsClient.sol";
import { FunctionsRequest } from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import { ConfirmedOwner } from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import { AutomationCompatibleInterface } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "hardhat/console.sol"; // Comentar essa linha 

interface IFunctionsRouter {
  /// @notice Sends a request using the provided subscriptionId
  /// @param subscriptionId - A unique subscription ID allocated by billing system,
  /// a client can make requests from different contracts referencing the same subscription
  /// @param data - CBOR encoded Chainlink Functions request data, use FunctionsClient API to encode a request
  /// @param dataVersion - Gas limit for the fulfillment callback
  /// @param callbackGasLimit - Gas limit for the fulfillment callback
  /// @param donId - An identifier used to determine which route to send the request along
  /// @return requestId - A unique request identifier
  function sendRequest(
    uint64 subscriptionId,
    bytes calldata data,
    uint16 dataVersion,
    uint32 callbackGasLimit,
    bytes32 donId
  ) external returns (bytes32);
}

/**
 * @title Automated Functions Consumer
 * 
 * @notice Esse contrato é usado para iniciar Contratos de Seguro automatizados
 * @notice Ele é automatizado, então em intervalos pré-especificados ele lê dados climáticos
 * @notice Se os dados estão fora dos índices pré-definidos a função [INSERIR NOME DA FUNÇÃO] é disparada
 */
contract AutomatedFunctionsConsumer is FunctionsClient, ConfirmedOwner{
  bytes   public  requestCBOR; // Concise Binary Object Representation para transferência de dados
  bytes32 public  latestRequestId;
  bytes   public  latestResponse;
  bytes   public  latestError;
  uint64  public  subscriptionId;
  uint32  public  fulfillGasLimit;
  uint256 public  updateInterval;
  uint256 public  lastUpkeepTimeStamp;
  uint256 public  upkeepCounter;
  uint256 public  responseCounter;
  uint8   private controlFlag;

  // Configuracao da automacao
  address public  registry;
  uint256 public  upkeepId;
  bytes   public  request;
  uint32  public  gasLimit;
  bytes32 public  donID;
  bytes32 public  s_lastRequestId;
  bytes   public  s_lastResponse;
  bytes   public  s_lastError;
  uint256 public  s_upkeepCounter;
  uint256 public  s_requestCounter;
  uint256 public  s_responseCounter;

  address public  institution;
  address public  farmer;
  address public  upkeepContract;

  error UnexpectedRequestID(bytes32 requestId);

  event Response(bytes32 indexed requestId, bytes response, bytes err);
  event RequestRevertedWithErrorMsg(string reason);
  event RequestRevertedWithoutErrorMsg(bytes data);

  // Valores para regras de negócio
  uint256   public  reparationValue;
  uint256   public  humidityLimit;
  uint256   public  sampleMaxSize;
  string[]  public  sampleStorage;
  string    private computationJS; // calculo da computacao do indice

  // Variável para armazenar a média das amostras
  uint256 private mean;

  // Erro retornado se um agente não permitido chamar performUpkeep
  error NotAllowedCaller(
        address caller,
        address owner,
        address automationRegistry
  );

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
  event upkeepRegistered(uint256 upkeepId);
  event upkeepCreated(address upkeepAddress);

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
   * @param router O contrato do oráculo interface do Chainlink Functions
   * @param _subscriptionId O ID da subscrição na Rede Descentralizada de Oráculos (DON) para cobranças de requisições
   * @param _fulfillGasLimit Máximo de gás permitido para chamar a função `handleOracleFulfillment`
   * @param _updateInterval O intervalo de tempo que a Chainlink Automation deve chamar a `performUpkeep`
   */
  constructor(
    address _deployer,
    address _farmer,
    uint256 _humidityLimit,
    uint256 _sampleMaxSize,
    uint256 _reparationValue,
    uint256 _updateInterval,
    address router,
    uint64  _subscriptionId,
    address _registry,
    address sepoliaLINKAddress, // Aqui para LinkTokenInterface
    address sepoliaRegistrarAddress, // Aqui para AutomationRegistrarInterface
    uint32  _fulfillGasLimit
  ) ConfirmedOwner(_deployer) payable {
    institution = _deployer;
    farmer = _farmer;
    humidityLimit = _humidityLimit; 
    subscriptionId = _subscriptionId;
    fulfillGasLimit = _fulfillGasLimit;
    updateInterval = _updateInterval;
    sampleMaxSize = _sampleMaxSize;
    reparationValue = _reparationValue;
    registry = _registry;
    lastUpkeepTimeStamp = block.timestamp;
  }

  /**
   * @notice Muda o estado do contrato para armazenar o objeto FunctionsRequest.Request codificado em CBOR
   * @notice Essas informações são enviados para a `performUpkeep` quando esta é chamada
   * 
   * @param newRequestCBOR Bytes representando o objeto FunctionsRequest.Request codificado em CBOR
   * @param _subscriptionId O ID da subscrição na Rede Descentralizada de Oráculos para cobranças de requisições
   * @param _fulfillGasLimit Máximo de gás permitido para chamar a função `handleOracleFulfillment`
   * @param _donID Novo ID do job
   * @param _updateInterval O intervalo de tempo que a Chainlink Automation deve chamar a `performUpkeep`
   */
  function setRequest(
    bytes calldata newRequestCBOR,
    uint64 _subscriptionId,
    uint32 _fulfillGasLimit,
    bytes32 _donID,
    uint256 _updateInterval
  ) external onlyOwner {
    requestCBOR = newRequestCBOR;
    subscriptionId = _subscriptionId;
    fulfillGasLimit = _fulfillGasLimit;
    donID = _donID;
    updateInterval = _updateInterval;
  }

  /**
   * @notice Usado por Chainlink Automation para checar se `performUpkeep` deve ser chamada
   */
  function checkUpkeep(bytes memory) public view returns (bool upkeepNeeded, bytes memory) {
    upkeepNeeded = (block.timestamp - lastUpkeepTimeStamp) > updateInterval;
  }

  /**
   * @notice Chamada por Chainlink Automation para realizar uma requisição através da Chainlink Functions
   */
  function performUpkeep(bytes calldata) external onlyAllowed {
    (bool upkeepNeeded, ) = checkUpkeep("");
    require(upkeepNeeded, "Time interval not met");
    lastUpkeepTimeStamp = block.timestamp;
    upkeepCounter = upkeepCounter + 1;

    // Se a quantidade de amostras não é o suficiente, coleta nova amostra:
    if(sampleMaxSize > sampleStorage.length){
      s_upkeepCounter = s_upkeepCounter + 1;
      s_lastRequestId = _sendRequest(
          requestCBOR,
          subscriptionId,
          gasLimit,
          donID
      );
      s_requestCounter = s_requestCounter + 1;
    }
    // Se a quantidade de amostras é o suficiente:
    else{ 
      require(upkeepId != 0, "Upkeep not registered");

      controlFlag = 1;

      // Seria interessante codificar o CBOR do computation.js com JavaScript
      // Mas por enquanto vou colocar oresquerCBOR que já foi codificado

      s_upkeepCounter = s_upkeepCounter + 1;
      _sendRequest(
          requestCBOR,
          subscriptionId, 
          gasLimit,
          donID
      );
        s_lastRequestId = requestId;
        s_requestCounter = s_requestCounter + 1;
      }

      // registry.pauseUpkeep(upkeepId);
  }

  function verifyIndex() internal {
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
  function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal {
    latestResponse = response;
    latestError = err;
    responseCounter = responseCounter + 1;

    if(controlFlag == 0){
      string memory responseAsString = string(response); // Isso aqui era: string(bytes32(response))

      // Armazena no array as amostras de dados
      sampleStorage.push(responseAsString);
    }
    else{
      // Refazer isso para que a rede Chainlink realize uma computação do índice mais complexo do que a média
      // Essa computação do índice deve ser com base na literatura científica
      mean = uint256(bytes32(response)); // remover

      verifyIndex(); // remover
    }

    emit OCRResponse(requestId, response, err);
  }

  // Consultar o balanço do contrato
  function contractBalance() public view returns (uint){
    return address(this).balance;
  }
}
