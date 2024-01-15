/**
 * Cria um contrato de seguro a partir do contrato Institution
 * O endereço do contrato de seguro na rede Ethereum é armazenado na em uma lista na Institution
 * @param {BaseContract} institution 
 * @param {Object} args 
 * @returns {Object} Recibo da transação
 */
async function createInsuranceContract(institution, args){
    const tx = await institution.createInsuranceContract(
        args.deployer,
        args.farmer,
        args.humidityLimit,
        args.sampleMaxSize,
        args.reparationValue,
        args.interval,
        args.router,
        args.subscriptionId,
        args.registryAddress,
        args.linkTokenAddress,
        args.registrarAddress,
        args.gaslimit
    )

    console.log(`\nInsurance Contract creation: waiting 1 block for transaction ${tx.hash} to be confirmed...`)
    const receipt = tx.wait(1)

    return receipt
}

/**
 * Adiciona o endereço na rede Ethereum do fazendeiro na lista branca da instituição
 * @param {BaseContract} institution 
 * @param {string} farmerAddress 
 * @returns {Object} Recibo da transação
 */
async function whitelistFarmer(institution, farmerAddress){
    const tx = await institution.whitelistAddr(farmerAddress)
    const receipt = await tx.wait(1)
    console.log(`\nAdding to white list: waiting 1 block for transaction ${tx.hash} to be confirmed...`)
    console.log(`\nFarmer ${farmerAddress} added to white list of institution ${institution.address}`)

    return receipt
}

/**
 * Adiciona o endereço na rede Ethereum do fazendeiro na lista branca da instituição
 * @param {BaseContract} institution 
 * @param {string} farmerAddress 
 * @returns {Object} Recibo da transação
 */
async function blacklistFarmer(institution, farmerAddress){
    const tx = await institution.blacklistAddr(farmerAddress)
    const receipt = await tx.wait(1)
    console.log(`\nRemoving from white list: waiting 1 block for transaction ${tx.hash} to be confirmed...`)
    console.log(`\nFarmer ${farmerAddress} removed from white list of institution ${institution.address}`)

    return receipt
}

module.exports = {
    createInsuranceContract,
    whitelistFarmer,
    blacklistFarmer
}