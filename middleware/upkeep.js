const ethers = require('ethers')
import * as ethers from 'ethers'
import * as blockchain from './blockchain.js'
import upkeepArtifacts from '../build/artifacts/contracts/Upkeep.sol/Upkeep.json' assert { type: 'json' }

async function createUpkeep(signer){
    const upkeepFactory = new ethers.ContractFactory(
        upkeepArtifacts.abi,
        upkeepArtifacts.bytecode,
        signer
    )

    const upkeep = await upkeepFactory.deploy(
        blockchain.sepolia.chainlinkLinkTokenAddress,
        blockchain.sepolia.chainlinkRegistrarAddress
    )

    console.log(`\nUpkeep creation: waiting 1 block for deployment ${upkeep.hash} to be confirmed...`)
    await upkeep.deployTransaction.wait(1)
    
    return upkeep
}

async function getUpkeep(upkeepAddress, signer){
    const upkeep = new ethers.Contract(
        upkeepAddress,
        upkeepArtifacts.abi,
        signer
    )

    return upkeep
}

export { createUpkeep, getUpkeep }