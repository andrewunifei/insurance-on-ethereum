import {
    SubscriptionManager,
    SecretsManager,
    simulateScript,
    buildRequestCBOR,
    ReturnType,
    decodeResult,
    Location,
    CodeLanguage,
} from '@chainlink/functions-toolkit'

/**
 * Instancia um objeto para acessar as funcionalidades de Chainlink Functions 
 * @param {ethers.Wallet} signer 
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

async function simulateComputation(source, args, bytesArgs = [], secrets = {}) {
    console.log("Start simulation...");

    const response = await simulateScript({
        source,
        args,
        bytesArgs, // bytesArgs - arguments can be encoded off-chain to bytes.
        secrets,
    });

    const errorString = response.errorString;

    if (errorString) {
        console.log(`❌ Error during simulation: `, errorString);
    }
    else {
        const returnType = ReturnType.uint256;
        const responseBytesHexstring = response.responseBytesHexstring;

        if (ethers.utils.arrayify(responseBytesHexstring).length > 0) {
            const decodedResponse = decodeResult(
                response.responseBytesHexstring,
                returnType
            );
            console.log(`✅ Decoded response to ${returnType}... Returning both response and decoded response`);

            return { response, decodedResponse }
        }
    }
}

export default { createManager, simulateComputation }