const upkeepParams = {
    name: 'upkeep-teste',
    encryptedEmail: ethers.utils.hexlify([]),
    upkeepContract: insuranceContractAddress,
    gasLimit: 300000,
    adminAddress: signer.address, // Pode ser a instituição (talvez)
    triggerType: 0,
    checkData: ethers.utils.hexlify([]),
    triggerConfig: ethers.utils.hexlify([]),
    offchainConfig: ethers.utils.hexlify([]),
    amount: ethers.utils.parseEther(String(5)) // LINK --> Juels
}

export default upkeepParams