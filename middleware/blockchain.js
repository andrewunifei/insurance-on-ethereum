import * as ethers from 'ethers'
import * as dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

/**
 * Objeto com endereços relevantes de contratos Chainlink
 */
const sepolia = {
    chainlinkRegistrarAddress: '0xb0E49c5D0d05cbc241d68c05BC5BA1d1B7B72976',
    chainlinkRegistryAddress: '0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad',
    chainlinkLinkTokenAddress: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
    chainlinkRouterAddress: '0xb83E47C2bC239B3bf370bc41e1459A34b41238D0'
}

const sepoliaExplorerURL = 'https://sepolia.etherscan.io/'

/**
 * Retorna um objeto contendo
 * uma instância do provedor para comunicar com a blockchain
 * e um assinante na rede ethereum
 * @returns {Object}
 */
async function interaction() {
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey) {
        throw new Error("Private key not provided - check your environment variables");
    }

    const RPCURL = process.env.ETHEREUM_SEPOLIA_RPC_URL;
    if(!RPCURL) {
        throw new Error(`RPCURL not provided  - check your environment variables`);
    }

    const provider = new ethers.providers.JsonRpcProvider(RPCURL);
    const signer = new ethers.Wallet(privateKey, provider);

    return { signer, provider };
}

export { sepolia, sepoliaExplorerURL, interaction }