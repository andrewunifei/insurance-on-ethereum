require('dotenv').config()

// Eu irei importar o Hardhat Ethers para fazer alguns testes com funções relacioandas com tempo
// No projeto em geral eu estou usando o Ethers normal
// Talvez seja necessário remover essa linha
// require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

const REPORT_GAS = process.env.REPORT_GAS?.toLowerCase() === "true" ? true : false
const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2
const SHARED_DON_PUBLIC_KEY = 'a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c'

const SOLC_SETTINGS = {
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
  viaIR: true
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: SOLC_SETTINGS,
      },
      {
        version: "0.8.7",
        settings: SOLC_SETTINGS,
      }
    ],
  },
  networks: {
    hardhat: {
    },
    ethereumSepolia: {
      url: process.env.ETHEREUM_SEPOLIA_RPC_URL || "UNSET",
      gasPrice: undefined,
      accounts: process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY !== undefined ? [process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY] : [],
      verifyApiKey: process.env.ETHERSCAN_API_KEY || "UNSET",
      chainId: 11155111,
      confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
      nativeCurrencySymbol: "ETH",
      linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      linkPriceFeed: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
      functionsOracleProxy: "0x649a2C205BE7A3d5e99206CEEFF30c794f0E31EC",
      functionsBillingRegistryProxy: "0x3c79f56407DCB9dc9b852D139a317246f43750Cc",
      functionsPublicKey: SHARED_DON_PUBLIC_KEY,
    },
  },
  etherscan: {
    // npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    // to get exact network names: npx hardhat verify --list-networks
    apiKey: {
      sepolia: process.env.ETHEREUM_SEPOLIA_VERIFY_API_KEY,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  }
}
