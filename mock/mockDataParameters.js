import ethers from 'ethers';
import fs from 'node:fs/promises';
import blockchain from '../../middleware/blockchain.js';

const reparationValue = 0.001

const pathToFile = path.resolve('rules/metric.js');
const readSource = await fs.readFile(pathToFile);
const source = readSource.toString();

const config = {
    computationPath:'rules/computation.js',
    args: ["44.34", "10.99"],
};

const donParams = {
    secrets: { apiKey: process.env.OPEN_WEATHER_API_KEY },
    donId: 'fun-ethereum-sepolia-1',
    slotId: 0,
    minutesUntilExpiration: 60,
    gatewayUrls: [
        "https://01.functions-gateway.testnet.chain.link/",
        "https://02.functions-gateway.testnet.chain.link/"
    ]
};

const info = [
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
    signer:             signer.address,
    farmer:             farmerAddr,
    humidityLimit:      50,
    sampleMaxSize:      5,
    reparationValue:    ethers.utils.parseEther(String(reparationValue)),
    interval:           3 * 60,
    router:             blockchain.sepolia.chainlinkRouterAddress,
    registryAddress:    blockchain.sepolia.chainlinkRegistryAddress,
    linkTokenAddress:   blockchain.sepolia.chainlinkLinkTokenAddress,
    registrarAddress:   blockchain.sepolia.chainlinkRegistrarAddress,
    gaslimit:           300000,
    donId:              ethers.utils.formatBytes32String(donParams.donId),
    metricJS:           source
};

const upkeepParams = {
    name:           'automation-of-project-test-1',
    encryptedEmail: ethers.utils.hexlify([]),
    upkeepContract: insuranceContractAddress, // insuranceContractAddress
    gasLimit:       1000000,
    adminAddress:   signer.address, // Deployer
    triggerType:    0,
    checkData:      ethers.utils.hexlify([]),
    triggerConfig:  ethers.utils.hexlify([]),
    offchainConfig: ethers.utils.hexlify([]),
    amount:         ethers.utils.parseEther(String(10)) // LINK --> Juels
};

export default { config, donParams, info, upkeepParams, insuranceParams };