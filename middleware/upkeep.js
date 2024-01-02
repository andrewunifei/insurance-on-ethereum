const { ethers } = require("hardhat")

async function createUpkeep(){
    await run("compile")

    sepoliaLINKAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'
    sepoliaRegistrarAddress = '0x9a811502d843E5a03913d5A2cfb646c11463467A'

    const UpkeepFactory = await ethers.getContractFactory("Upkeep")

    const UpkeepContract = await UpkeepFactory.deploy(
        sepoliaLINKAddress,
        sepoliaRegistrarAddress
    )
    await UpkeepContract.deployTransaction.wait(1)
    console.log(`upkeep contract address: ${UpkeepContract.address}`)
}

async function callRegister(upkeepAddress, params){
    await run("compile")

    const UpkeepFactory = await ethers.getContractFactory("Upkeep")
    const UpkeepContract = await UpkeepFactory.attach(
        upkeepAddress
    )

    const upkeepID = await UpkeepContract.register(params)

    return upkeepID
}

module.exports = {
    createUpkeep,
    callRegister
}