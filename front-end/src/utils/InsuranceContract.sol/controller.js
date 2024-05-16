import * as ethers from 'ethers'
import sepolia from '@/utils/blockchain'
import {
    SecretsManager,
    buildRequestCBOR,
    Location,
    CodeLanguage,
} from '@chainlink/functions-toolkit'
import { computationJS } from '../rules/metric';

 // DON-Hosted Secrets
async function setDonHostedSecrets(signer, parameters) {
    const { secrets, donId, slotId, minutesUntilExpiration, gatewayUrls } = parameters;

    // Request
    console.log("Initializing setting of DON Hosted Secrets...\n");

    // Encripta a chave da API
    const secretsManager = new SecretsManager(
        {
            signer,
            functionsRouterAddress: sepolia.chainlinkRouterAddress,
            donId
        }
    );
    await secretsManager.initialize();
    const encryptedSecrets = await secretsManager.encryptSecrets(secrets);

    // Carrega a encriptação para o DON 
    console.log(`Upload encrypted secret to gateways ${gatewayUrls}. slotId ${slotId}. Expiration in minutes: ${minutesUntilExpiration}`)
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
        donHostedEncryptedSecretsReference = await setDonHostedSecrets(signer, donParams);
        secretsLocation = Location.DONHosted;
    }
    else {
        donHostedEncryptedSecretsReference = null;
        secretsLocation = null;
    }

    const requestCBOR = buildRequestCBOR(
        {
            codeLocation: Location.Inline,
            secretsLocation,
            codeLanguage: CodeLanguage.JavaScript,
            source: computationJS,
            encryptedSecretsReference: donHostedEncryptedSecretsReference,
            args: config.args,
            bytesArgs: null
        }
    );

    return { 
        requestCBOR,
        formatedDonId: ethers.utils.formatBytes32String(donParams.donId)
     };
}

export default buildRequestParameters