// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {IAutomationRegistryConsumer, RegistrationParams} from "./AutomationUtils.sol";
import {Upkeep} from "./Upkeep.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface UpkeepInterface {
  function register(RegistrationParams calldata params, address caller) external returns (uint256);
}

/**
 * @title Automated Functions Consumer
 * 
 * @notice Esse contrato é usado para iniciar Contratos de Seguro automatizados
 * @notice Ele é automatizado, então em intervalos pré-especificados ele lê dados climáticos
 * @notice Se os dados estão fora dos índices pré-definidos a função [INSERIR NOME DA FUNÇÃO] é disparada
 */
contract AutomatedFunctionsConsumer is FunctionsClient, ConfirmedOwner, AutomationCompatibleInterface {
  using FunctionsRequest for FunctionsRequest.Request;

  address public deployer;

  // Configuração Chainlink Functions
  bytes   public  requestCBOR; // Concise Binary Object Representation para transferência de dados
  bytes32 public  latestRequestId;
  bytes   public  latestResponse;
  bytes   public  latestError;
  uint64  public  subscriptionId;
  uint32  public  fulfillGasLimit;
  uint256 public  updateInterval;

  // Configuração Chainlink Automation
  IAutomationRegistryConsumer public immutable registry;
  address public  sepoliaLINKAddress;
  address public  sepoliaRegistrarAddress;
  Upkeep  public  c_upkeep;
  uint256 public  upkeepId;
  bytes   public  request;
  // uint32  public  gasLimit;
  bytes32 public  donID;
  uint256 public  lastUpkeepTimeStamp;
  uint256 public  upkeepCounter;
  uint256 public  responseCounter;
  bytes32 public  s_lastRequestId;
  bytes   public  s_lastResponse;
  bytes   public  s_lastError;
  uint256 public  s_requestCounter;
  uint256 public  s_responseCounter;
  uint8   private controlFlag;

  address public  farmer;
  string public farmName;

  error UnexpectedRequestID(bytes32 requestId);

  event Response(bytes32 indexed requestId, bytes response, bytes err);
  event RequestRevertedWithErrorMsg(string reason);
  event RequestRevertedWithoutErrorMsg(bytes data);
  event LINKsRetrieved(uint96 amountRetrieved);

  // Valores para regras de negócio
  uint256   public  reparationValue;
  uint256   public  humidityLimit;
  uint256   public  sampleMaxSize;
  // string[]  public  sampleStorage;
  mapping (uint8 => string[]) public sampleStorage;
  string    private metricJS; // Cálculo da computação do índice

  // Variável para armazenar a média das amostras
  uint256 private avg;

  // Erro retornado se um agente não permitido chamar performUpkeep
  error NotAllowedCaller(
        address caller,
        address owner,
        address automationRegistry
  );

  // event notAllowed(
  //       address caller,
  //       address owner,
  //       address automationRegistry
  // );

  event sender(address sndr);

  event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);
  event upkeepRegistered(uint256 upkeepId);
  event upkeepCreated(address upkeepAddress);

  event avgCalculated(uint256 num);
  event convertedResponse(string converted);
  event addressPaid(address paid);
  event upkeepCanceled(uint256 upkeepId);

  /**
   * @notice Reverte se chamado por qualquer um menos o repositório de automação.
   */
  modifier onlyAllowed() {
      if (msg.sender != owner() && msg.sender != address(registry)){
        revert NotAllowedCaller(msg.sender, owner(), address(registry));
      }
      _;
  }

  /**
   * @notice Construtor do contrato
   *
   * @param _humidityLimit O índice limite de comparação
   * @param router O contrato do oráculo interface do Chainlink Functions
   * @param _fulfillGasLimit Máximo de gás permitido para chamar a função `handleOracleFulfillment`
   * @param _updateInterval O intervalo de tempo que a Chainlink Automation deve chamar a `performUpkeep`
   */
  constructor(
    address _deployer,
    address _farmer,
    string memory _farmName,
    uint256 _humidityLimit,
    uint256 _sampleMaxSize,
    uint256 _reparationValue,
    uint256 _updateInterval,
    address router,
    address _registry,
    address _sepoliaLINKAddress, // Aqui para LinkTokenInterface
    address _sepoliaRegistrarAddress, // Aqui para AutomationRegistrarInterface
    uint32 _fulfillGasLimit,
    bytes32 _donID,
    string memory _metricJS
  ) FunctionsClient(router) ConfirmedOwner(_deployer) payable {
    deployer = _deployer;
    farmer = _farmer;
    farmName = _farmName;
    humidityLimit = _humidityLimit; 
    sampleMaxSize = _sampleMaxSize;
    reparationValue = _reparationValue;
    updateInterval = _updateInterval;
    registry = IAutomationRegistryConsumer(_registry);
    fulfillGasLimit = _fulfillGasLimit;
    sepoliaLINKAddress = _sepoliaLINKAddress;
    sepoliaRegistrarAddress = _sepoliaRegistrarAddress;
    lastUpkeepTimeStamp = block.timestamp;
    donID = _donID;
    metricJS = _metricJS;
    controlFlag = 0;
  }

  // ** SETTERS **
  /**
   * Preenche a variável armazenada para as configurações da requisição codificada em CBOR
   * @param _requestCBOR bytes com as configurações da requisição codificada em CBOR
   */
  function setCBOR(bytes memory _requestCBOR) external {
    requestCBOR = _requestCBOR;
  }

  /**
   * Preenche a variável armazenada para o id da subscrição em Chainlink Functions
   * @param _subscriptionId id da subscrição do Chainlink Functions 
   */
  function setSubscriptionId(uint64 _subscriptionId) external {
    subscriptionId = _subscriptionId;
  }
  // *********************

  // ** GETTERS **
  /**
   * Retorna todos os valores do array sampleStorage
   */
  function getAllSamples() view public returns (string[] memory) {
    return sampleStorage[0];
  }

  /**
   * Retorna todos os timestamps relacionados ao sampleStorage
   */
  function getAllSamplesTimestamps() view public returns (string[] memory) {
    return sampleStorage[1];
  }
  // *********************

  // /**
  //  * @notice Função para aprovar a movimentação de LINK para fora desse contrato
  //  * @param amount Quantidade de LINK que será retirada desse contrato
  //  */
  // function approveLINK(uint96 amount) public onlyOwner {
  //   LinkTokenInterface(sepoliaLINKAddress).approve(msg.sender, amount);
  // }

  /**
   * @notice Função para criar um Chainlink Automation Upkeep
   * @notice A lógica da criação do upkeep estã dentro do contrato 
   * @notice Isso porque o contrato seja capaz de controlar a upkeep (pausar por exemplo)
   * @param upkeepFundAmount Os fundos para o funcionamento da Upkeep
   */
  function createUpkeep(uint96 upkeepFundAmount) public {
      c_upkeep = new Upkeep(sepoliaLINKAddress, sepoliaRegistrarAddress, upkeepFundAmount); 
      LinkTokenInterface(sepoliaLINKAddress).approve(address(c_upkeep), upkeepFundAmount);
      c_upkeep.fund(address(this));
      emit upkeepCreated(address(c_upkeep));
  }

  /**
   * @notice Para registrar uma nova Upkeep
   */
  function registerUpkeep(RegistrationParams calldata params) public {
    upkeepId = UpkeepInterface(address(c_upkeep)).register(params, address(this));

    emit upkeepRegistered(upkeepId);
  }

  // function retrieveLINKs() private {
  //   uint96 upkeepBalance = registry.getBalance(upkeepId);
  //   registry.withdrawFunds(upkeepId, deployer);
  //   registry.cancelUpkeep(upkeepId);

  //   emit LINKsRetrieved(upkeepBalance);
  // }

  event performCalled(uint256 counter);
  /**
   * @notice Usado por Chainlink Automation para checar se `performUpkeep` deve ser chamada
   */
  function checkUpkeep(
    bytes calldata /* checkData */
  )
    external
    view
    override
    returns (bool upkeepNeeded, bytes memory /* performData */)
  {
    upkeepNeeded = (block.timestamp - lastUpkeepTimeStamp) > updateInterval;
  }

  // Testar chamar essa função com outra carteira além do deployer
  /**
   * @notice Chamada por Chainlink Automation para realizar uma requisição através da Chainlink Functions
   */
  function performUpkeep(bytes calldata) external override { // removi o onlyAllowed
    require(upkeepId != 0, "Upkeep not registered");
    // (bool upkeepNeeded, ) = checkUpkeep("");
    // require(upkeepNeeded, "Time interval not met");
    lastUpkeepTimeStamp = block.timestamp;
    upkeepCounter = upkeepCounter + 1;

    // Se a quantidade de amostras não é o suficiente, coleta nova amostra:
    if(sampleMaxSize > sampleStorage[0].length){
      try i_router.sendRequest(
          subscriptionId, 
          requestCBOR,
          FunctionsRequest.REQUEST_DATA_VERSION,
          fulfillGasLimit,
          donID
      )
      returns (bytes32 requestId) {
        s_lastRequestId = requestId;
        s_requestCounter = s_requestCounter + 1;
        emit RequestSent(requestId);
      } catch Error(string memory reason) {
        emit RequestRevertedWithErrorMsg(reason);
      } catch (bytes memory data) {
        emit RequestRevertedWithoutErrorMsg(data);
      }
    }
    // Se a quantidade de amostras é o suficiente:
    else{ 
      if(controlFlag == 0) {
        controlFlag = 1;

        FunctionsRequest.Request memory req;
        req.initializeRequest(
          FunctionsRequest.Location.Inline, 
          FunctionsRequest.CodeLanguage.JavaScript, 
          metricJS
        );
        req.setArgs(sampleStorage[0]);
        bytes memory encodedCBOR = req.encodeCBOR();

        try i_router.sendRequest(
            subscriptionId, 
            encodedCBOR,
            FunctionsRequest.REQUEST_DATA_VERSION,
            fulfillGasLimit,
            donID
        )
        returns (bytes32 requestId) {
          s_lastRequestId = requestId;
          s_requestCounter = s_requestCounter + 1;
          emit RequestSent(requestId);
        } catch Error(string memory reason) {
          emit RequestRevertedWithErrorMsg(reason);
        } catch (bytes memory data) {
          emit RequestRevertedWithoutErrorMsg(data);
        }
      }
      else {
        emit upkeepCanceled(upkeepId);
        registry.cancelUpkeep(upkeepId);
      }
    }
  }

  function verifyIndex() internal {
    if(avg < humidityLimit){
      // Transfere para a conta do agricultor
      (bool sent, /* bytes memory data */) = payable(farmer).call{value: address(this).balance}("");
      require(sent, "Erro ao pagar a indenizacao");
      emit addressPaid(farmer);
    }
    else{
      // Transfere para a conta da instituição
      (bool sent, /* bytes memory data */) = payable(deployer).call{value: address(this).balance}("");
      require(sent, "Erro ao retornar os fundos para a instituicao");
      emit addressPaid(deployer);
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
    // latestResponse = response;
    // latestError = err;
    // responseCounter = responseCounter + 1;
    // string memory responseAsString = string(response); 

    if(controlFlag == 0) {
      uint256 num = uint256(bytes32(response));
      string memory responseAsString = Strings.toString(num);
      sampleStorage[0].push(responseAsString);
      sampleStorage[1].push(Strings.toString(block.timestamp));
      emit convertedResponse(responseAsString);
      // emit OCRResponse(requestId, response, err);
    }
    else {
      // Converter a resposta para uint antes de enviar para o evento
      avg = uint256(bytes32(response));
      emit avgCalculated(avg);
      verifyIndex();
    }
  }

  // Consultar o balanço do contrato
  function contractBalance() public view returns (uint){
    return address(this).balance;
  }

  // Função para receber ether, msg.data deve estar vazio
  receive() external payable {}
}
