const ethers = require("ethers")
const blockchain = require("./blockchain")
const InsuranceArtifact = require("../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json")
const abi = InsuranceArtifact.abi
const bytecode = InsuranceArtifact.bytecode
const {
    SecretsManager,
    simulateScript,
    buildRequestCBOR,
    ReturnType,
    decodeResult,
    Location,
    CodeLanguage,
} = require("@chainlink/functions-toolkit")

const insuranceContractAddress = ''
const subscriptionId = 0

async function setDonHostedSecrets(secrets, parameters) {
    const donId = 'fun-ethereum-sepolia-1'

    // DON-Hosted Secrets
    const gatewayUrls = [
        "https://01.functions-gateway.testnet.chain.link/",
        "https://02.functions-gateway.testnet.chain.link/"
    ]
    const slotId = 0
    const minutesUntilExpiration = 60

    // Request
    console.log("Initializing request....\n")

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

    // Crrega a encriptação para o DON 
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

async function setRequest() {
    const explorerUrl = blockchain.sepoliaExplorerURL
    const { signer } = await blockchain.interaction()

    const computation = '../rules/computation.js'
    const args = ["44.34", "10.99"]
    const gasLimit = 300000

    const secrets = { apiKey: process.env.OPEN_WEATHER_API_KEY }
    const donHostedEncryptedSecretsReference = await setDonHostedSecrets(secrets)

    const insuranceContract = new ethers.Contract(
        insuranceContractAddress,
        abi, 
        signer
    )

    const functionsRequestBytesHexString = buildRequestCBOR(
        {
            codeLocation: Location.Inline,
            codeLanguage: CodeLanguage.JavaScript,
            secretsLocation: Location.DONHosted,
            source: computation,
            encryptedSecretsReference: donHostedEncryptedSecretsReference,
            args,
            bytesArgs: []
        }
    )

    const tx = insuranceContract.setRequest(
        functionsRequestBytesHexString,
        subscriptionId,
        gasLimit,
        ethers.utils.formatBytes32String(donId)
    )

    console.log(`\n✅ Automated Functions request settings updated! Transaction hash ${tx.hash} - Check the explorer ${explorerUrl}/tx/${tx.hash}`);
}
