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
    //APIContract.waitForDeployment() -- Substituir provalvemente
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

module.exports = {
    createAPI,
    getAPI
}


