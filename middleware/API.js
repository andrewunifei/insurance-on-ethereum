const { ethers } = require("hardhat")

async function createAPI(deployer){
    // Compile
    await run("compile")

    console.log(`Endereço do deployer: ${deployer.address}`)

    const APIContractFactory = await ethers.getContractFactory("InsuranceAPI")

    // Deploy API
    const APIContract = await APIContractFactory.deploy(
        deployer.address
    )
        
    console.log(`\nWaiting 1 block for transaction ${APIContract.deployTransaction.hash} to be confirmed...`)
    await APIContract.deployTransaction.wait(1)

    console.log(`Endereço da interface: ${APIContract.address}`)

    return APIContract
}

async function getAPI(APIContractAddress){
    // Already deployed
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


