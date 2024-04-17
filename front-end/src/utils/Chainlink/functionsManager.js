import { SubscriptionManager } from '@chainlink/functions-toolkit'

/**
 * Instancia um objeto para acessar as funcionalidades de Chainlink Functions 
 * @param {ethers.Wallet} signer 
 * @param {string} linkTokenAddress 
 * @param {string} routerAddress 
 * @returns {Promise<SubscriptionManager>}
 */
export default async function createManager(signer, linkTokenAddress, routerAddress) {
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