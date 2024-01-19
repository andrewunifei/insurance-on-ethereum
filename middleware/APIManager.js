const ethers = require("ethers")
const APIArtifact = require("../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json")
const abi = APIArtifact.abi
const bytecode = APIArtifact.bytecode

/**
 * Implanta o contrato InsuranceAPI.sol na rede Ethereum
 * @param {ethers.Wallet} signer
 * @returns {BaseContract}
 */
async function createAPI(signer){
    const APIFactory = new ethers.ContractFactory(abi, bytecode, signer)
    const API = await APIFactory.deploy(signer.address)
    
    console.log(`API creation: waiting 1 block for deployment ${API.deployTransaction.hash} to be confirmed...`)
    API.deployTransaction.wait(1)

    return API
}

/**
 * Retorna um contrato InsuranceAPI.sol já implantado na rede Ethereum
 * @param {string} APIAddress O endereço do contrato na rede Ethereum
 * @param {ethers.Wallet} signer
 * @returns {BaseContract}
 */
function getAPI(APIAddress, signer){
    const APIFactory = new ethers.ContractFactory(abi, bytecode, signer)
    const API = APIFactory.attach(APIAddress)

    return API
}

/**
 * Cria uma instituição a partir do contrato InsuranceAPI
 * O endereço da instituição na rede Ethereum é armazenado em uma lista no InsuranceAPI
 * @param {BaseContract} API 
 * @param {Object} info Informações para identificar a instituição
 * @returns {ContractTransactionReceipt}
 */
async function createInstitution(API, info) {
    const tx = await API.createInstitution(
        info.name
    )

    console.log(`Institution creation: waiting 1 block for transaction ${tx.hash} to be confirmed...`)
    const receipt = await tx.wait(1)

    return receipt
}

module.exports = {
    createAPI,
    getAPI,
    createInstitution
}

// Atual API
// 0x74Ce03A9655585754F50627F13359cc2F40D8FFB
