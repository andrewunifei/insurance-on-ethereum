import * as blockchain from '../middleware/blockchain.js' 
import APIArtifact from '../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' }
import path from 'path'
import { fileURLToPath } from 'url';
import { createManager } from "../middleware/chainlinkFunctions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { signer } = await blockchain.interaction()

console.log(await createManager(
    signer,
    blockchain.sepolia.chainlinkLinkTokenAddress,
    blockchain.sepolia.chainlinkRouterAddress
))
