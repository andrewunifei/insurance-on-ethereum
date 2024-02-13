import * as ethers from 'ethers'
import * as blockchain from './blockchain.js'
import insuranceArtifacts from '../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }
import {
    SecretsManager,
    simulateScript,
    buildRequestCBOR,
    ReturnType,
    decodeResult,
    Location,
    CodeLanguage,
} from '@chainlink/functions-toolkit'

const insuranceContractAddress = '' // Mock value
const subscriptionId = 0 // Mock value

async function setDonHostedSecrets(secrets, parameters) {
    const donId = parameters.donId
    const signer = parameters.signer

    // IMPORTANTE: Esses parâmetros devem ser passados para essa função através de `parameters` 
    // DON-Hosted Secrets
    const gatewayUrls = [
        "https://01.functions-gateway.testnet.chain.link/",
        "https://02.functions-gateway.testnet.chain.link/"
    ]
    const slotId = 0
    const minutesUntilExpiration = 60
    // ****************************************************************************************

    // Request
    console.log("Initializing setting of DON Hosted Secrets...\n")

    // Encripta a chave da API
    const secretsManager = new SecretsManager(
        {
            signer,
            functionsRouterAddress: blockchain.sepolia.chainlinkRouterAddress,
            donId
        }
    )
    await secretsManager.initialize()
    const encryptedSecrets = await secretsManager.encryptSecrets(secrets)

    // Carrega a encriptação para o DON 
    console.log(`Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotId}. Expiration in minutes: ${expirationTimeMinutes}`)
    const uploadResult = await secretsManager.uploadEncryptedSecretsToDON(
        {
            encryptedSecretsHexstring: encryptedSecrets.encryptedSecrets,
            gatewayUrls,
            slotId,
            minutesUntilExpiration
        }
    )

    if(!uploadResult.success){
        throw new Error(`Failed to upload encrypted secrets to ${gatewayUrls}`);
    }
    console.log(`\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `, uploadResult);

    const donHostedSecretsVersion = parseInt(uploadResult.version)
    const donHostedEncryptedSecretsReference = secretsManager.buildDONHostedEncryptedSecretsReference(
        {
            slotId,
            version: donHostedSecretsVersion
        }
    )

    return donHostedEncryptedSecretsReference
}

async function setRequest(config) {
    /*
        IMPORTANTE: As partes comentadas dizem respeito a mecânica antiga
        que buscava um contrato já instanciado 
        e após a construção do CBOR imediatamente chamava a setRequest do contrato
    */

    // const explorerUrl = blockchain.sepoliaExplorerURL
    const { signer } = await blockchain.interaction()

    // IMPORTANTE: Esses parâmetros devem ser passados para essa função, e não definidos por ela
    // const computation = '../rules/computation.js'
    // const args = ["44.34", "10.99"]
    // const gasLimit = 300000
    // const secrets = { apiKey: process.env.OPEN_WEATHER_API_KEY }
    // const donId = 'fun-ethereum-sepolia-1'
    // *****************************************************************************************

    const parameters = {
        donId: config.donId,
        signer
    }

    const donHostedEncryptedSecretsReference = await setDonHostedSecrets(config.secrets, parameters)

    const requestCBOR = buildRequestCBOR(
        {
            codeLocation: Location.Inline,
            codeLanguage: CodeLanguage.JavaScript,
            secretsLocation: Location.DONHosted,
            source: config.computation,
            encryptedSecretsReference: donHostedEncryptedSecretsReference,
            args: config.args,
            bytesArgs: []
        }
    )

    return { 
        requestCBOR,
        subscriptionId,
        gasLimit,
        formatedDonId: ethers.utils.formatBytes32String(config.donId)
     }

    // const insuranceContract = new ethers.Contract(
    //     insuranceContractAddress,
    //     insuranceArtifacts.abi, 
    //     signer
    // )
    //
    // const tx = insuranceContract.setRequest(
    //     requestCBOR,
    //     subscriptionId,
    //     gasLimit: config.gasLimit,
    //     ethers.utils.formatBytes32String(donId)
    // )

    // console.log(`\n✅ Automated Functions request settings updated! Transaction hash ${tx.hash} - Check the explorer ${explorerUrl}/tx/${tx.hash}`);
}
