const { SubscriptionManager } = require("@chainlink/functions-toolkit");

/**
 * Instancia um objeto para acessar as funcionalidades de Chainlink Functions 
 * @param {HardhatEthersSigner} signer 
 * @param {string} linkTokenAddress 
 * @param {string} routerAddress 
 * @returns {Promise<SubscriptionManager>}
 */
async function createManager(signer, linkTokenAddress, routerAddress) {
    const manager = new SubscriptionManager(
        {
            signer: signer,
            linkTokenAddress: linkTokenAddress, 
            functionsRouterAddress: routerAddress
        }
    )

    await manager.initialize()

    return manager
} 

module.exports = {
    createManager
}