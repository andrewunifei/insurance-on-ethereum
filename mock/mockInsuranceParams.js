import ethers from 'ethers';
import blockchain from '../middleware/blockchain.js';

const params = {
    // Esses endereços tem origem na blockcahin localhost (npx hardhat node)
    signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 
    farmer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 
    humidityLimit: 10,
    maxSampleQuantity: 10,
    reparationValue: ethers.utils.parseEther(String(1)), // eth --> wei
    interval: 10,
    router: blockchain.sepolia.chainlinkRouterAddress,
    subscriptionId: 0,
    registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
    linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
    registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
    gaslimit: 300000
};

export default params