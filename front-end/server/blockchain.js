import { ethers }  from "ethers";

/**
 * Objeto com endereços relevantes de contratos Chainlink na blockchain Ethereum Sepolia
 */
const sepolia = {
    chainlinkRegistrarAddress:  '0xb0E49c5D0d05cbc241d68c05BC5BA1d1B7B72976',
    chainlinkRegistryAddress:   '0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad',
    chainlinkLinkTokenAddress:  '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    chainlinkRouterAddress:     '0xb83E47C2bC239B3bf370bc41e1459A34b41238D0'
};

/**
 * Retorna um objeto contendo
 * uma instância do provedor para comunicar com a blockchain
 * e um assinante na rede ethereum
 * @returns {Object}
 */
async function interaction(privateKey, rpcUrl) {
    if(!privateKey) {
        throw new Error('Private key not provided - check your environment variables');
    }

    if(!rpcUrl) {
        throw new Error('RPCURL not provided  - check your environment variables');
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    return { signer, provider };
}

export default { sepolia, interaction }