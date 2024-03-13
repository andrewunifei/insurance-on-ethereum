import * as ethers from 'ethers'
import * as APIManager from '../middleware/APIManager.js'
import * as institutionManager from '../middleware/institutionManager.js'
import * as insuranceContractManager from '../middleware/insuranceContractManager.js'
import institutionArtifacts from '../build/artifacts/contracts/Institution.sol/Institution.json' assert { type: 'json' }
import insuranceContractArtifacts from '../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }
import fs from 'node:fs/promises'

/**
 * Lê e retorna o endereço gravado no arquivo de parâmetro.
 * Se o arquivo não existe, cria um novo arquivo e retorna uma string vazia
 * @param {string} path 
 * @returns {Promise<string>}
 */
async function getAddress(path) {
    let address = ''

    try {
        const buffer = await fs.readFile(path)
        address = buffer.toString()
    }
    catch(e) {
        if(e.code === 'ENOENT') {
            await fs.writeFile(path, address)
        }
        else {
            throw new Error(e)
        }
    }

    return address
}

/**
 * Retorna a última API criada.
 * Se nenhum endereço de API existir no arquivo ${filename}, cria e retona uma nova API.
 * Caso necessário escreve o endereço da nova API no arquivo ${filename} 
 * @param {ethers.Wallet} signer 
 * @param {string} path 
 * @returns {Promise<ethers.BaseContract>}
 */
async function fetchAPI(signer, path, APIArtifact) {
    const filename = path.split("/").slice(-1)[0]
    let APIAddress = await getAddress(path)

    if(APIAddress.length === 0){
        console.log(`${filename} empty. Creating a new API...`)
        const API = await APIManager.createAPI(signer, APIArtifact)
        APIAddress = API.address
        await fs.writeFile(path, APIAddress)
        console.log(`✅ New API created! Its address was saved to ${filename}`)

        return API
    }

    const API = APIManager.getAPI(APIAddress, signer, APIArtifact)

    return API
}

/**
 * Retorna a última instituição criada.
 * Se nenhum endereço de instituição existir no arquivo ${filename}, cria e retona uma nova instituição.
 * Caso necessário escreve o endereço da nova instituição no arquivo ${filename} 
 * @param {ethers.Wallet} signer 
 * @param {ethers.BaseContract} API 
 * @param {Object} info 
 * @param {string} path
 * @returns {Promise<ethers.BaseContract>}
 */
async function fetchInstitution(signer, API, name, path) {
    const filename = path.split("/").slice(-1)[0]
    let institutionAddress = await getAddress(path)

    if(institutionAddress.length === 0){
        console.log(`${filename} empty. Creating a new institution...`)
        const receipt = await APIManager.createInstitution(API, name)
        institutionAddress = receipt.events[0].args[0]
        await fs.writeFile(path, institutionAddress)
        console.log(`✅ New institution created! Its address was saved to ${filename}`)

        const institution = new ethers.Contract(
            institutionAddress,
            institutionArtifacts.abi,
            signer
        )

        return { institution, receipt }
    }

    const institution = new ethers.Contract(
        institutionAddress,
        institutionArtifacts.abi,
        signer
    )

    return { institution, receipt: null }
}

/**
 * Retorna o id da última inscrição em Chainlink Functions.
 * Se nenhum id existe no arquivo ${filename}, realiza uma inscrição em Chainlink Functions e retona o id.
 * Caso necessário escreve o endereço da nova instituição no arquivo ${filename} 
 * @param {SubscriptionManager} manager 
 * @param {string} institutionAddress 
 * @param {string} path
 * @returns {Promise<number>}
 */
async function fetchSubscriptionId(manager, institutionAddress, path) {
    const filename = path.split("/").slice(-1)[0]
    let subscriptionId = await getAddress(path)

    if(subscriptionId.length === 0){
        console.log(`${filename} empty. Creating a new subscription...`)
        subscriptionId = await manager.createSubscription(institutionAddress)
        await fs.writeFile(path, String(subscriptionId))
        console.log(`✅ New Chainlink subscription created! Its ID was saved to ${filename}`)

        return Number(subscriptionId)
    }
    else{
        return Number(subscriptionId)
    }
}

/**
 * Retorna o último contrato de seguro criadao.
 * Se nenhum endereço de contrato de seguro existir no arquivo ${filename}, cria e retona um novo contrato.
 * Caso necessário escreve o endereço do novo contrato de seguro no arquivo ${filename} 
 * @param {ethers.Wallet} signer  
 * @param {ethers.BaseContract} institution 
 * @param {Object} params 
 * @param {string} path
 * @returns {Promise<ethers.BaseContract>}
 */
async function fetchInsuranceContract(signer, institution, params, path) {
    const filename = path.split("/").slice(-1)[0]
    let insuranceContractAddress = await getAddress(path)

    if(insuranceContractAddress.length === 0){
        console.log(`${filename} empty. Creating a new institution...`)
        const receipt = await institutionManager.createInsuranceContract(institution, params)
        insuranceContractAddress = receipt.events[0].args[0]
        await fs.writeFile(path, insuranceContractAddress)
        console.log(`✅ New Insurance Contract created! Its address was saved to ${filename}`)
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

export default { fetchAPI, fetchInstitution, fetchSubscriptionId, fetchInsuranceContract }