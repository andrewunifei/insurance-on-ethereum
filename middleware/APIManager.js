import * as ethers from 'ethers'

/**
 * Implanta o contrato InsuranceAPI.sol na rede Ethereum
 * @param {ethers.Wallet} signer
 * @returns {Promise<ethers.BaseContract>}
 */
async function createAPI(signer, APIArtifact){
    const APIFactory = new ethers.ContractFactory(
        APIArtifact.abi,
        APIArtifact.bytecode,
        signer
    )
    const API = await APIFactory.deploy(signer.address)
    
    console.log(`API creation: waiting 1 block for deployment ${API.deployTransaction.hash} to be confirmed...`)
    API.deployTransaction.wait(1)

    return API
}

/**
 * Retorna um contrato InsuranceAPI.sol já implantado na rede Ethereum
 * @param {string} APIAddress O endereço do contrato na rede Ethereum
 * @param {ethers.Wallet} signer
 * @returns {ethers.BaseContract}
 */
function getAPI(APIAddress, signer, APIArtifact){
    const APIFactory = new ethers.ContractFactory(
        APIArtifact.abi,
        APIArtifact.bytecode,
        signer
    )
    const API = APIFactory.attach(APIAddress)

    return API
}

/**
 * Cria uma instituição a partir do contrato InsuranceAPI
 * O endereço da instituição na rede Ethereum é armazenado em uma lista no InsuranceAPI
 * @param {ethers.BaseContract} API 
 * @param {Object} name Nome da instituição
 * @returns {ContractTransactionReceipt}
 */
async function createInstitution(API, institutionInfo) {
    const tx = await API.createInstitution(institutionInfo)

    console.log(`Institution creation: waiting 1 block for transaction ${tx.hash} to be confirmed...`)
    const receipt = await tx.wait(1)

    return receipt
}

export default { createAPI, getAPI, createInstitution }