const ethers = require('ethers')
const blockchain = require('./blockchain')
const upkeepArtifacts = require('../build/artifacts/contracts/Upkeep.sol/Upkeep.json')

async function createUpkeep(deployer){
    const upkeepFactory = new ethers.ContractFactory(
        upkeepArtifacts.abi,
        upkeepArtifacts.bytecode,
        deployer
    )

    const upkeep = await upkeepFactory.deploy(
        blockchain.sepolia.chainlinkLinkTokenAddress,
        blockchain.sepolia.chainlinkRegistrarAddress
    )

    console.log(`\nUpkeep creation: waiting 1 block for deployment ${upkeep.hash} to be confirmed...`)
    await upkeep.deployTransaction.wait(1)
    
    return upkeep
}

async function getUpkeep(upkeepAddress, deployer){
    const upkeep = new ethers.Contract(
        upkeepAddress,
        upkeepArtifacts.abi,
        deployer
    )

    return upkeep
}

module.exports = {
    createUpkeep,
    getUpkeep
}