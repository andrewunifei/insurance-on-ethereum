/**
 * Cria um contrato de seguro a partir do contrato Institution
 * O endereço do contrato de seguro na rede Ethereum é armazenado na em uma lista na Institution
 * @param {ethers.BaseContract} institution 
 * @param {Object} params 
 * @returns {Object} Recibo da transação
 */
async function createInsuranceContract(institution, params) {
    const tx = await institution.createInsuranceContract(
        params.signer,
        params.farmer,
        params.humidityLimit,
        params.sampleMaxSize,
        params.reparationValue,
        params.interval,
        params.router,
        //params.subscriptionId,
        params.registryAddress,
        params.linkTokenAddress,
        params.registrarAddress,
        params.gaslimit,
        params.donId
        // params.requestCBOR,
        // params.computationJS
    );

    // const tx = await institution.createInsuranceContract.apply(
    //     institution, Object.values(params)
    // );

    console.log(`Insurance Contract creation: waiting 1 block for transaction ${tx.hash} to be confirmed...`);
    const receipt = tx.wait(1);

    return receipt;
}

/**
 * Adiciona o endereço na rede Ethereum do fazendeiro na lista branca da instituição
 * @param {ethers.BaseContract} institution 
 * @param {string} farmerAddr 
 * @returns {Object} Recibo da transação
 */
async function whitelistFarmer(institution, farmerAddr) {
    const tx = await institution.whitelistAddr(farmerAddr)
    console.log(`Adding to whitelist: waiting 1 block for transaction ${tx.hash} to be confirmed...`)
    const receipt = await tx.wait(1)
    console.log(`✅ Farmer ${farmerAddr} added to whitelist of institution ${institution.address}`)

    return receipt
}

/**
 * Adiciona o endereço na rede Ethereum do fazendeiro na lista branca da instituição
 * @param {ethers.BaseContract} institution 
 * @param {string} farmerAddr 
 * @returns {Object} Recibo da transação
 */
async function blacklistFarmer(institution, farmerAddr) {
    const tx = await institution.blacklistAddr(farmerAddr)
    console.log(`Removing from whitelist: waiting 1 block for transaction ${tx.hash} to be confirmed...`)
    const receipt = await tx.wait(1)
    console.log(`✅ Farmer ${farmerAddr} removed from whitelist of institution ${institution.address}`)

    return receipt
}

/**
 * Através de uma carteira, envia fundos para o contrato de uma instituição 
 * @param {ethers.Wallet} signer 
 * @param {ethers.BaseContract} institution 
 * @param {Number} amount
 * @returns {Object} Recibo da transação
 */
async function fundInstitution(signer, institution, amount) {
    const tx = await signer.sendTransaction(
        {
            to: institution.address,
            value: ethers.utils.parseEther(String(amount)) // eth --> wei
        }
    )
    console.log(`Funding institution ${institution.address} with ${String(amount)} ethers`)
    const receipt = await tx.wait(1)

    return receipt
}

export default { createInsuranceContract, whitelistFarmer, blacklistFarmer, fundInstitution }