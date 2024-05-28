import ethers from 'ethers';
import path from 'path';
import fs from 'node:fs/promises';
import blockchain from '../middleware/blockchain.js';

const farmerAddr = '0xF91CA466849f1f53D12ACb40F7245dA43Af4A839';
const reparationValue = 0.0001;

const pathToFile = path.resolve('rules/metric.js');
const readSource = await fs.readFile(pathToFile);
const source = readSource.toString();

const { signer } = await blockchain.interaction(
    process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
    process.env.ETHEREUM_SEPOLIA_RPC_URL
);

const config = {
    computationPath:'rules/computation.js',
    //args: ["44.34", "10.99"],
    args: ["-45.45", "-44.34"],
};

const donParams = {
    secrets: { apiKey: process.env.OPEN_WEATHER_API_KEY },
    donId: 'fun-ethereum-sepolia-1',
    slotId: 0,
    minutesUntilExpiration: 1440, // 1 dia
    // minutesUntilExpiration: 60,
    gatewayUrls: [
        "https://01.functions-gateway.testnet.chain.link/",
        "https://02.functions-gateway.testnet.chain.link/"
    ]
    // gatewayUrls: [
    //     "https://01.functions-gateway.testnet.chain.link/",
    //     "https://02.functions-gateway.testnet.chain.link/"
    // ]
};

const institutionInfo = [
    ['Code', '123456789'],
    ['Full Name', 'Capital Expansion LTDA'],
    ['Short name', 'CE'],
    ['Address', 'Wall St'],
    ['State', 'New York'],
    ['Email', 'contact@ce.com'],
    ['Phone', '+00 000000000'],
    // ... Pesquisar na literatura informações relevantes para identificar uma instituição
];

const insuranceParams = {
    signer:             signer.address, // Endereço da carteira da instituição
    farmer:             farmerAddr, // Endereço do fazendeiro
    farmName:           'Farm test',
    humidityLimit:      20, // Limite de umidade
    sampleMaxSize:      4, // Número de amostras a ser coletado
    reparationValue:    ethers.utils.parseEther(String(reparationValue)), // Valor da indenização
    interval:           3600, // Intervalo entre a busca por amostra
    router:             blockchain.sepolia.chainlinkRouterAddress,
    registryAddress:    blockchain.sepolia.chainlinkRegistryAddress,
    linkTokenAddress:   blockchain.sepolia.chainlinkLinkTokenAddress,
    registrarAddress:   blockchain.sepolia.chainlinkRegistrarAddress,
    gaslimit:           300000,
    donId:              ethers.utils.formatBytes32String(donParams.donId),
    metricJS:           source // String com o código para cálculo do índice em função das amostras
};

export default { config, donParams, institutionInfo, insuranceParams, farmerAddr, reparationValue };