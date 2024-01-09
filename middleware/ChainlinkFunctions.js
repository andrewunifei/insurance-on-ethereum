const { SubscriptionManager } = require("@chainlink/functions-toolkit");

/**
 * Instancia um objeto para acessar as funcionalidades de Chainlink Functions 
 * @param {HardhatEthersSigner} signer 
 * @param {string} linkTokenAddress 
 * @param {string} routerAddress 
 * @returns {SubscriptionManager}
 */
async function createManager(signer, linkTokenAddress, routerAddress) {
    const manager = new SubscriptionManager(
        signer,
        linkTokenAddress, 
        routerAddress
    )

    await manager.initialize()

    return manager
} 

module.exports = {
    createManager
}