import * as ethers from 'ethers'
import * as blockchain from '../middleware/blockchain.js'
import fs from 'node:fs/promises'

const params = {
    signer: '', 
    farmer: '', 
    humidityLimit: 50,
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