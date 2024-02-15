import * as ethers from 'ethers'
import * as blockchain from '../middleware/blockchain.js'
import fs from 'node:fs/promises'

const params = {
    // Esses endereços tem origem na blockcahin localhost (npx hardhat node)
    signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 
    farmer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 
    humidityLimit: 1,
    sampleMaxSize: 1,
    reparationValue: ethers.utils.parseEther("0"), // eth --> wei
    interval: 1,
    router: blockchain.sepolia.chainlinkRouterAddress,
    subscriptionId: 0,
    registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
    linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
    registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
    gaslimit: 300000
}

export default params