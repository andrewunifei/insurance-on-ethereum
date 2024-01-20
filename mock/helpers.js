import * as ethers from 'ethers'
import * as APIManager from '../middleware/APIManager.js'
import * as institutionManager from '../middleware/institutionManager.js'
import * as insuranceContractManager from '../middleware/insuranceContractManager.js'
import institutionArtifacts from '../build/artifacts/contracts/Institution.sol/Institution.json' assert { type: 'json' }
import insuranceContractArtifacts from '../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }
import path from 'path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Lê e retorna o endereço gravado no arquivo de parâmetro.
 * Se o arquivo não existe, cria um novo arquivo e retorna uma string vazia
 * @param {string} file 
 * @returns {Promise<string>}
 */
async function getAddress(file) {
    let address = ''

    try {
        const buffer = await fs.readFile(file)
        address = buffer.toString()
    }
    catch(e) {
        if(e.code === 'ENOENT') {
            await fs.writeFile(file, address)
        }
        else {
            throw new Error(e)
        }
    }

    return address
}

/**
 * Retorna a última API criada.
 * Se nenhum endereço de API existir no arquivo APIAddress.txt, cria e retona uma nova API.
 * Caso necessário escreve o endereço da nova API no arquivo APIAddress.txt 
 * @param {ethers.Wallet} signer 
 * @returns {Promise<ethers.BaseContract>}
 */
async function getAPI(signer) {
    const file = path.resolve(__dirname, '..', 'deployed', 'APIAddress.txt')
    let APIAddress = await getAddress(file)

    if(APIAddress.length === 0){
        console.log('APIAddress.txt empty. Creating a new API...')
        const API = await APIManager.createAPI(signer)
        APIAddress = API.address
        await fs.writeFile(file, APIAddress)
        console.log('✅ New API created! Its address was saved to APIAddress.txt')

        return API
    }

    const API = APIManager.getAPI(APIAddress, signer)

    return API
}

/**
 * Retorna a última instituição criada.
 * Se nenhum endereço de instituição existir no arquivo institutionAddress.txt, cria e retona uma nova instituição.
 * Caso necessário escreve o endereço da nova instituição no arquivo institutionAddress.txt 
 * @param {ethers.Wallet} signer 
 * @param {ethers.BaseContract} API 
 * @param {Object} info 
 * @returns {Promise<ethers.BaseContract>}
 */
async function getInstitution(signer, API, info) {
    const file = path.resolve(__dirname, '..', 'deployed', 'institutionAddress.txt')
    let institutionAddress = await getAddress(file)

    if(institutionAddress.length === 0){
        console.log('institutionAddress.txt empty. Creating a new institution...')
        const receipt = await APIManager.createInstitution(API, info)
        institutionAddress = receipt.events[0].args[0]
        await fs.writeFile(file, institutionAddress)
        console.log('✅ New institution created! Its address was saved to institutionAddress.txt')
    }

    const institution = new ethers.Contract(
        institutionAddress,
        institutionArtifacts.abi,
        signer
    )

    return institution
}

/**
 * Retorna o id da última inscrição em Chainlink Functions.
 * Se nenhum id existe no arquivo subscriptionId.txt, realiza uma inscrição em Chainlink Functions e retona o id.
 * Caso necessário escreve o endereço da nova instituição no arquivo subscriptionId.txt 
 * @param {SubscriptionManager} manager 
 * @param {string} institutionAddress 
 * @returns {Promise<number>}
 */
async function getSubscriptionId(manager, institutionAddress) {
    const file = path.resolve(__dirname, '..', 'subscriptionId.txt')
    let subscriptionId = await getAddress(file)

    if(subscriptionId.length === 0){
        console.log('subscriptionId.txt empty. Creating a new subscription...')
        subscriptionId = await manager.createSubscription(institutionAddress)
        await fs.writeFile(file, String(subscriptionId))
        console.log('✅ New Chainlink subscription created! Its ID was saved to subscriptionId.txt')

        return Number(subscriptionId)
    }
    else{
        return Number(subscriptionId)
    }
}

/**
 * Retorna o último contrato de seguro criadao.
 * Se nenhum endereço de contrato de seguro existir no arquivo insuranceContractAddress.txt, cria e retona um novo contrato.
 * Caso necessário escreve o endereço do novo contrato de seguro no arquivo insuranceContractAddress.txt 
 * @param {ethers.Wallet} signer  
 * @param {ethers.BaseContract} institution 
 * @param {Object} params 
 * @returns 
 */
async function getInsuranceContract(signer, institution, params) {
    const file = path.resolve(__dirname, '..', 'insuranceContractAddress.txt')
    let insuranceContractAddress = await getAddress(file)

    if(insuranceContractAddress.length === 0){
        console.log('insuranceContractAddress.txt empty. Creating a new institution...')
        const receipt = await institutionManager.createInsuranceContract(institution, params)
        insuranceContractAddress = receipt.events[0].args[0]
        await fs.writeFile(file, insuranceContractAddress)
        console.log('✅ New Insurance Contract created! Its address was saved to insuranceContractAddress.txt')
    }

    const insuranceContract = new ethers.Contract(
        insuranceContractAddress,
        insuranceContractArtifacts.abi,
        signer
    )

    return insuranceContract
}

// ** TODO: Implementar essa função usando fs-extra **
// async function clearAll() {

// }

export { getAPI, getInstitution, getSubscriptionId, getInsuranceContract }