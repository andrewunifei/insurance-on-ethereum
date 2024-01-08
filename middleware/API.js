const { ethers } = require("hardhat")
const APIArtifact = require("../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json")
const abi = APIArtifact.abi
const bytecode = APIArtifact.bytecode

async function createAPI(deployer){
    const APIContractFactory = new ethers.ContractFactory(abi, bytecode, deployer)

    // Deploy API
    const APIContract = await APIContractFactory.deploy(
        deployer.address
    )

    APIContract.waitForDeployment()

    return APIContract
}

async function getAPI(APIContractAddress){
    // Get contract already deployed
    const APIContractFactory = await ethers.getContractFactory("InsuranceAPI")
    const APIContract = await APIContractFactory.attach(
        APIContractAddress // Sepolia
    )

    return APIContract
}

module.exports = {
    createAPI,
    getAPI
}


