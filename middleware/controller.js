import * as ethers from 'ethers'
import blockchain from './blockchain.js'
import {
    SecretsManager,
    simulateScript,
    buildRequestCBOR,
    ReturnType,
    decodeResult,
    Location,
    CodeLanguage,
} from '@chainlink/functions-toolkit'

 // DON-Hosted Secrets
async function setDonHostedSecrets(signer, parameters, ) {
    const { secrets, donId, slotId, minutesUntilExpiration, gatewayUrls } = parameters;

    // Request
    console.log("Initializing setting of DON Hosted Secrets...\n");

    // Encripta a chave da API
    const secretsManager = new SecretsManager(
        {
            signer,
            functionsRouterAddress: blockchain.sepolia.chainlinkRouterAddress,
            donId
        }
    );
    await secretsManager.initialize();
    const encryptedSecrets = await secretsManager.encryptSecrets(secrets);

    // Carrega a encriptação para o DON 
    console.log(`Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotId}. Expiration in minutes: ${expirationTimeMinutes}`)
    const uploadResult = await secretsManager.uploadEncryptedSecretsToDON(
        {
            encryptedSecretsHexstring: encryptedSecrets.encryptedSecrets,
            gatewayUrls,
            slotId,
            minutesUntilExpiration
        }
    );

    if(!uploadResult.success) {
        throw new Error(`Failed to upload encrypted secrets to ${gatewayUrls}`);
    };
    console.log(`\n✅ Secrets uploaded properly to gateways ${gatewayUrls}! Gateways response: `, uploadResult);

    const donHostedSecretsVersion = parseInt(uploadResult.version);
    const donHostedEncryptedSecretsReference = secretsManager.buildDONHostedEncryptedSecretsReference(
        {
            slotId,
            version: donHostedSecretsVersion
        }
    );

    return donHostedEncryptedSecretsReference;
}

async function buildRequestParameters(signer, config, donParams={}) {
    let donHostedEncryptedSecretsReference;
    let secretsLocation;

    if(Object.keys(donParams).length !== 0) {
        donHostedEncryptedSecretsReference = await setDonHostedSecrets(signer, donParams,);
        secretsLocation = Location.DONHosted;
    }
    else {
        donHostedEncryptedSecretsReference = null;
        secretsLocation = null;
    }

    const requestCBOR = buildRequestCBOR(
        {
            codeLocation: Location.Inline,
            codeLanguage: CodeLanguage.JavaScript,
            secretsLocation,
            source: config.computationPath,
            encryptedSecretsReference: donHostedEncryptedSecretsReference,
            args: config.args | null,
            bytesArgs: null
        }
    );

    return { 
        requestCBOR,
        formatedDonId: ethers.utils.formatBytes32String(donParams.donId)
     };
}

export default { buildRequestParameters }