const { networks } = require("../../networks")
const { subscriptionManager, SubscriptionManager } = require("@chainlink/functions-toolkit");

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