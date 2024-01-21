import * as ethers from 'ethers'
import * as blockchain from './blockchain.js'
import * as chainlinkFunctions from './chainlinkFunctions.js'
import * as institutionManager from './institutionManager.js'
import * as helpers from '../mock/helpers.js'
import upkeepArtifact from '../build/artifacts/contracts/Upkeep.sol/Upkeep.json' assert { type: 'json' }
import LINKArtifacts from '../build/artifacts/@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json' assert { type: 'json' }
import insuranceContractParams from '../mock/InsuranceParamsMock.js'
import insuranceInfo from '../mock/institutionInfoMock.js'

const { signer, provider } = await blockchain.interaction(
    process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
    process.env.HARDHAT_RPC_URL
)
const API = await helpers.getAPI(signer)
const institution = await helpers.getInstitution(signer, API, insuranceInfo)
const signerAddress = signer.address
if(!await institution.isWhiteListed(nullAddress)){
    await institutionManager.whitelistFarmer(institution, signerAddress)
}

// const nullAddress = ethers.utils.hexlify(ethers.utils.zeroPad(0, 20))

// Aparentemente quando uma função em Solidity é pure ou view ela gera o retorno original da função
// Caso contrário ela gera uma 'tx' que pode se transformar em 'receipt'



//const insuranceContract = await helpers.getInsuranceContract(signer, institution, insuranceContractParams)
//console.log(insuranceContract)

// const juelsAmount = String(BigInt(10**18)) // 1 LINK
// const manager = await chainlinkFunctions.createManager(
//     signer,
//     blockchain.sepolia.chainlinkLinkTokenAddress,
//     blockchain.sepolia.chainlinkRouterAddress
// )
// const subscriptionId = await helpers.getSubscriptionId(manager)
// const subscriptionInfo = await manager.getSubscriptionInfo(subscriptionId)

// if(subscriptionInfo.balance <= BigInt(ethers.utils.parseEther(String(0.01))._hex)) {
//     const spinner = ora('Subscription without funds. Funding...').start();
//     receipt = await manager.fundSubscription({
//         subscriptionId, 
//         juelsAmount
//     })
//     spinner.succeed(`Successfully funded Subscription ${subscriptionId} at transaction ${receipt.transactionHash}`)
// }

// console.log(insuranceContract)

// ** TODO: Organizar, separar, e modularizar o conteúdo abaixo **

// const upkeepFactory = new ethers.ContractFactory(
//     upkeepArtifact.abi,
//     upkeepArtifact.bytecode,
//     signer 
// )

// // const upkeep = await upkeepFactory.deploy(
// //     blockchain.sepolia.chainlinkLinkTokenAddress,
// //     blockchain.sepolia.chainlinkRegistrarAddress,
// //     ethers.utils.parseEther(String(10)) // LINK --> Juels
// // )
// // upkeep.deployTransaction.wait(1)

// const upkeepAddress = '0x28CA1Ad8B5b5AF4E9ccc57543f914CA032f95e05'
// const upkeep = upkeepFactory.attach(upkeepAddress)

// // console.log(`Upkeep address: ${upkeep.address}`)

// // const approveTx = await LINK.approve(upkeep.address, ethers.utils.parseEther(String(10)))
// // const approveReceipt = await approveTx.wait(1)
// // console.log(approveReceipt)

// // const tx = await upkeep.fund()
// // const receipt = await tx.wait(1)
// // console.log(receipt)

// const tx = await upkeep.register(upkeepParams)
// const receipt = await tx.wait(1)

// console.log(receipt)