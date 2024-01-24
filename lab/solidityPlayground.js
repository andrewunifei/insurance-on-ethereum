import ethers from 'ethers'
import laboratoryArtifact from '../build/artifacts/contracts/lab/Laboratory.sol/Laboratory.json' assert { type: 'json' }
import * as blockchain from '../middleware/blockchain.js'

const { signer } = await blockchain.interaction(
    process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
    process.env.HARDHAT_RPC_URL
)
const labFactory = new ethers.ContractFactory(
    laboratoryArtifact.abi,
    laboratoryArtifact.bytecode,
    signer
)   
const parameter = ethers.utils.formatBytes32String("that's awesome")
const lab = await labFactory.deploy(parameter)
lab.deployTransaction.wait(1)

const tx = await lab.decodeCounter()
