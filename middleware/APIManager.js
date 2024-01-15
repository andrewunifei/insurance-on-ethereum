const ethers = require("ethers")
const APIArtifact = require("../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json")
const abi = APIArtifact.abi
const bytecode = APIArtifact.bytecode

/**
 * Implanta o contrato InsuranceAPI.sol na rede Ethereum
 * @param {HardhatEthersSigner} deployer
 * @returns {BaseContract}
 */
async function createAPI(deployer){
    const APIContractFactory = new ethers.ContractFactory(abi, bytecode, deployer)
    const APIContract = await APIContractFactory.deploy(deployer.address)
    
    console.log(`\nAPI creation: waiting 1 block for deployment ${APIContract.hash} to be confirmed...`)
    APIContract.deployTransaction.wait(1)

    return APIContract
}

/**
 * Retorna um contrato InsuranceAPI.sol já implantado na rede Ethereum
 * @param {string} APIAddress - O endereço do contrato na rede Ethereum
 * @returns {BaseContract}
 */
async function getAPI(APIAddress, deployer){
    const APIContractFactory = new ethers.ContractFactory(abi, bytecode, deployer)
    const APIContract = await APIContractFactory.attach(APIAddress)

    return APIContract
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

    console.log(`\nInstitution creation: waiting 1 block for transaction ${tx.hash} to be confirmed...`)
    const receipt = await tx.wait(1)

    return receipt
}

module.exports = {
    createAPI,
    getAPI,
    createInstitution
}


