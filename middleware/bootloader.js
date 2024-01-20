import * as ethers from 'ethers'
import * as blockchain from './blockchain.js'
import * as chainlinkFunctions from './chainlinkFunctions.js'

import * as APIManager from './APIManager.js'
import * as institutionManager from './institutionManager.js'
import * as insuranceContractManager from './insuranceContractManager.js'

import institutionArtifacts from '../build/artifacts/contracts/Institution.sol/Institution.json' assert { type: 'json' }
import upkeepArtifact from '../build/artifacts/contracts/Upkeep.sol/Upkeep.json' assert { type: 'json' }
import LINKArtifacts from '../build/artifacts/@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json' assert { type: 'json' }

import path from 'path'
import fs from 'node:fs/promises'
import ora from 'ora'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Retorna a última API criada
 * Se nenhum endereço de API existe no arquivo APIAddress.txt, cria e retona uma nova
 * @param {ethers.Wallet} signer 
 * @returns {Promise<ethers.BaseContract>}
 */
async function getAPI(signer) {
    let APIAddress = ''
    
    try {
        APIAddress = await fs.readFile(path.join(__dirname, '..', 'APIAddress.txt'))
    }
    catch(e) {
        if(e.code === 'ENOENT') {
            const fileToWrite = path.resolve(__dirname, '..', 'APIAddress.txt')
            await fs.writeFile(fileToWrite, APIAddress)
        }
        else {
            throw new Error(e)
        }
    }

    if(APIAddress.length === 0){
        const spinner = ora('APIAddress.txt empty. Creating a new API...').start();
        const API = await APIManager.createAPI(signer)
        APIAddress = API.address
        const fileToWrite = path.resolve(__dirname, '..', 'APIAddress.txt')
        await fs.writeFile(fileToWrite, APIAddress)
        spinner.succeed('New API created! Its address was saved to APIAddress.txt')

        return API
    }

    const API = APIManager.getAPI(APIAddress.toString(), signer)

    return API
}

/**
 * Retorna a última instituição criada.
 * Se nenhum endereço de instituição existe no arquivo institutionAddress.txt, cria e retona uma nova
 * @param {ethers.Wallet} signer 
 * @param {ethers.BaseContract} API 
 * @param {Object} info 
 * @returns {Promise<ethers.BaseContract>}
 */
async function getInstitution(signer, API, info) {
    let institutionAddress = ''
    
    try {
        institutionAddress = await fs.readFile(path.join(__dirname, '..', 'institutionAddress.txt'))
    }
    catch(e) {
        if(e.code === 'ENOENT') {
            const fileToWrite = path.resolve(__dirname, '..', 'institutionAddress.txt')
            await fs.writeFile(fileToWrite, institutionAddress)
        }
        else {
            throw new Error(e)
        }
    }

    if(institutionAddress.length === 0){
        const spinner = ora('institutionAddress.txt empty. Creating a new institution...').start();
        const receipt = await APIManager.createInstitution(API, info)
        institutionAddress = receipt.events[0].args[0]
        const fileToWrite = path.resolve(__dirname, '..', 'institutionAddress.txt')
        await fs.writeFile(fileToWrite, institutionAddress)
        spinner.succeed('New institution created! Its address was saved to institutionAddress.txt')
    }

    const institution = new ethers.Contract(
        institutionAddress.toString(),
        institutionArtifacts.abi,
        signer
    )

    return institution
}

function getInfo() {
    return {
        name: 'Institution Version X'
        // ... Pesquisar na literatura informações relevantes para identificar uma instituição
    }
}

/**
 * Retorna o id da última inscrição em Chainlink Functions.
 * Se nenhum id existe no arquivo subscriptionId.txt, realiza uma inscrição em Chainlink Functions e retona o id
 * @param {SubscriptionManager} manager 
 * @param {string} institutionAddress 
 * @returns {Promise<number>}
 */
async function getSubscriptionId(manager, institutionAddress) {
    let subscriptionId = ''
    
    try {
        subscriptionId = await fs.readFile(path.join(__dirname, '..', 'subscriptionId.txt'))
    }
    catch(e) {
        if(e.code === 'ENOENT') {
            const fileToWrite = path.resolve(__dirname, '..', 'subscriptionId.txt')
            await fs.writeFile(fileToWrite, subscriptionId)
        }
        else {
            throw new Error(e)
        }
    }

    if(subscriptionId.length === 0){
        const spinner = ora('subscriptionId.txt empty. Creating a new subscription...').start();
        subscriptionId = await manager.createSubscription(institutionAddress)
        const fileToWrite = path.resolve(__dirname, '..', 'subscriptionId.txt')
        await fs.writeFile(fileToWrite, String(subscriptionId))
        spinner.succeed('New Chainlink subscription created! Its ID was saved to subscriptionId.txt')

        return Number(subscriptionId)
    }
    else{
        return Number(subscriptionId.toString())
    }
}

// Conectando a blockchian local hardhat
const { signer, provider } = await blockchain.interaction(
    process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
    process.env.HARDHAT_RPC_URL
)

const API = await getAPI(signer)
console.log(API.address)

const info = getInfo()
const institution = await getInstitution(signer, API, info)

const juelsAmount = String(BigInt(10**18)) // 1 LINK
const manager = await chainlinkFunctions.createManager(
    signer,
    blockchain.sepolia.chainlinkLinkTokenAddress,
    blockchain.sepolia.chainlinkRouterAddress
)
const subscriptionId = await getSubscriptionId(manager)
const subscriptionInfo = await manager.getSubscriptionInfo(subscriptionId)

if(subscriptionInfo.balance <= BigInt(ethers.utils.parseEther(String(0.01))._hex)) {
    const spinner = ora('Subscription without funds. Funding...').start();
    receipt = await manager.fundSubscription({
        subscriptionId, 
        juelsAmount
    })
    spinner.succeed(`Successfully funded Subscription ${subscriptionId} at transaction ${receipt.transactionHash}`)
}

// const insuranceFlag = 0

// // Chainlink Functions
// const addToSubFlag = 0

// // Chainlink Automation 
// const upkeepFlag = 1

// let institutionAddress
// let insuranceContractAddress

// try {
//     if(insuranceFlag) {
//         // Enviar Ether para contrato através do signer 
//         // const tx = await signer.sendTransaction(
//         //     {
//         //         to: institution.address,
//         //         value: ethers.utils.parseEther("0") // eth --> wei
//         //     }
//         // )

//         // Coloca o endereço do fazendeiro na lista branca
//         // const txWhiteList = await institution.whitelistAddr(signer.address)
//         // await txWhiteList.wait(1)
//         // console.log('Farmer added to whitelist')

//         const balance = await provider.getBalance(institution.address);
//         console.log(balance)

//         const args = {
//             signer: institution.address,
//             farmer: signer.address, // Para fins de teste
//             humidityLimit: 50,
//             sampleMaxSize: 1,
//             reparationValue: ethers.utils.parseEther("0"), // eth --> wei
//             interval: 1,
//             router: blockchain.sepolia.chainlinkRouterAddress,
//             subscriptionId,
//             registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
//             linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
//             registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
//             gaslimit: 300000
//         }

//         const receipt = await institutionManager.createInsuranceContract(institution, args)

//         // ** TODO: Tratar o receipt.logs **
//         console.log(receipt.events)

//         return
//     }
//     else { 
//         insuranceContractAddress = '0xb70eE5899c2Fe65256587686918879a4c030bbf9'

//         console.log('Current Insurance Contract Address: 0xb70eE5899c2Fe65256587686918879a4c030bbf9')
        
//         // Antigo insuraneContractAddress = 0x3dc8420f89f74997a1345a6f80627ea6e5b670ae
//     }

//     try {
//         if(addToSubFlag) {
//             const tx = await manager.addConsumer(
//                 {
//                     subscriptionId,
//                     consumerAddress: insuranceContractAddress
//                 }
//             )

//             console.log(`Consumer added to subscription at transaction ${tx.hash}.`)
//         }
//     }
//     catch(e) {
//         throw new Error(e)
//     }

//     try {
//         if(upkeepFlag) {
//             const upkeepParams = {
//                 name: 'upkeep-teste',
//                 encryptedEmail: ethers.utils.hexlify([]),
//                 upkeepContract: insuranceContractAddress,
//                 gasLimit: 300000,
//                 adminAddress: signer.address, // Pode ser a instituição (talvez)
//                 triggerType: 0,
//                 checkData: ethers.utils.hexlify([]),
//                 triggerConfig: ethers.utils.hexlify([]),
//                 offchainConfig: ethers.utils.hexlify([]),
//                 amount: ethers.utils.parseEther(String(5)) // LINK --> Juels
//             }

//             let insuranceContract = await insuranceContractManager.getInsuranceContract(
//                 insuranceContractAddress, signer
//             )

//             // const upkeepAddr = await insuranceContract.i_upkeep()

//             // const upkeepFactory = new ethers.ContractFactory(
//             //     abi,
//             //     bytecode,
//             //     signer 
//             // )
//             // const upkeep = upkeepFactory.attach(upkeepAddr)

//             // const tx = await upkeep.register(upkeepParams)
            
//             // console.log(tx)

//             // const tx = await insuranceContract.registerUpkeep(upkeepParams)
//             // const receipt = tx.wait(1)

//             // console.log(receipt.logs)

//             const LINKFactory = new ethers.ContractFactory(
//                 LINKArtifacts.abi,
//                 LINKArtifacts.bytecode,
//                 signer
//             )
//             const LINK = LINKFactory.attach(blockchain.sepolia.chainlinkLinkTokenAddress)

//             const upkeepFactory = new ethers.ContractFactory(
//                 upkeepArtifact.abi,
//                 upkeepArtifact.bytecode,
//                 signer 
//             )

//             // const upkeep = await upkeepFactory.deploy(
//             //     blockchain.sepolia.chainlinkLinkTokenAddress,
//             //     blockchain.sepolia.chainlinkRegistrarAddress,
//             //     ethers.utils.parseEther(String(10)) // LINK --> Juels
//             // )
//             // upkeep.deployTransaction.wait(1)

//             const upkeepAddress = '0x28CA1Ad8B5b5AF4E9ccc57543f914CA032f95e05'
//             const upkeep = upkeepFactory.attach(upkeepAddress)

//             // console.log(`Upkeep address: ${upkeep.address}`)

//             // const approveTx = await LINK.approve(upkeep.address, ethers.utils.parseEther(String(10)))
//             // const approveReceipt = await approveTx.wait(1)
//             // console.log(approveReceipt)

//             // const tx = await upkeep.fund()
//             // const receipt = await tx.wait(1)
//             // console.log(receipt)

//             const tx = await upkeep.register(upkeepParams)
//             const receipt = await tx.wait(1)

//             console.log(receipt)
//         }
//     }
//     catch(e) {
//         throw new Error(e)
//     }
// }
// catch(e) {
//     throw new Error(e)
// }