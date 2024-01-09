const { ethers } = require("hardhat")
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
    APIContract.waitForDeployment()

    return APIContract
}

/**
 * Retorna um contrato InsuranceAPI.sol já implantado na rede Ethereum
 * @param {string} APIAddress - O endereço do contrato na rede Ethereum
 * @returns {BaseContract}
 */
async function getAPI(APIAddress){
    const APIContractFactory = await ethers.getContractFactory("InsuranceAPI")
    const APIContract = await APIContractFactory.attach(APIAddress)

    return APIContract
}

module.exports = {
    createAPI,
    getAPI
}


