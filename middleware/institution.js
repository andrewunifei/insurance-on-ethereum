const { ethers } = require("hardhat")

async function whitelistFarmer(institution, farmerAddress){
    receipt = await institution.whitelistAddr(farmerAddress)
    await receipt.wait(1)
    console.log(`Agricultor ${farmerAddress} adicionado a lista branca da instituição ${institution.address}`)
}

async function blacklistFarmer(institution, farmerAddress){
    receipt = await institution.blacklistAddr(farmerAddress)
    await receipt.wait(1)
    console.log(`Agricultor ${farmerAddress} removido da lista branca da instituição ${institution.address}`)
}

module.exports = {
    whitelistFarmer,
    blacklistFarmer,
}