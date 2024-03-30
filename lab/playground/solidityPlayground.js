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

let tx
tx = await lab.insert('test-1')
await tx.wait(1)
tx = await lab.insert('test-2')
await tx.wait(1)
tx = await lab.insert('test-3')
await tx.wait(1)
tx = await lab.insert('test-4')
await tx.wait(1)
tx = await lab.insert('test-5')
await tx.wait(1)
const value = await lab.sampleStorageSize()
console.log(BigInt(value._hex).toString())
const state = await lab.compare()
console.log(state)