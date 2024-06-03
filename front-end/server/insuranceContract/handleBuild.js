import blockchain from '../blockchain.js'
import {
    SecretsManager,
    buildRequestCBOR,
    Location,
    CodeLanguage,
} from '@chainlink/functions-toolkit'

const MAP_HEX = {
    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6,
    7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13,
    e: 14, f: 15, A: 10, B: 11, C: 12, D: 13,
    E: 14, F: 15
};

function fromHex(hexString) {
    const bytes = new Uint8Array(Math.floor((hexString || "").length / 2));
    let i;
    for (i = 0; i < bytes.length; i++) {
      const a = MAP_HEX[hexString[i * 2]];
      const b = MAP_HEX[hexString[i * 2 + 1]];
      if (a === undefined || b === undefined) {
        break;
      }
      bytes[i] = (a << 4) | b;
    }
    return i === bytes.length ? bytes : bytes.slice(0, i);
}

 // DON-Hosted Secrets
async function setDonHostedSecrets(signer, parameters, secrets) {
    const { donId, slotId, minutesUntilExpiration, gatewayUrls } = parameters;

    console.log(`INTERVAL NUMBER: ${minutesUntilExpiration}`);

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

async function buildRequestParameters(signer, config, donParams) {
    const secrets = { apiKey: process.env.OPEN_WEATHER_API_KEY };

    let donHostedEncryptedSecretsReference;
    let secretsLocation;

    if(Object.keys(donParams).length !== 0) {
        donHostedEncryptedSecretsReference = await setDonHostedSecrets(signer, donParams, secrets);
        secretsLocation = Location.DONHosted;
    }
    else {
        donHostedEncryptedSecretsReference = null;
        secretsLocation = null;
    }

    const computationJSHex = '696628736563726574732e6170694b6579203d3d20222229207b0a202020207468726f77204572726f7228224572726f72207769746820746865207765617468657220415049206b65792e22290a7d3b0a6c65742064617461537472756374757265203d205b5d3b0a636f6e73742075726c203d206068747470733a2f2f6170692e6f70656e776561746865726d61702e6f72672f646174612f322e352f776561746865723f6c61743d247b617267735b305d7d266c6f6e3d247b617267735b315d7d2661707069643d247b736563726574732e6170694b65797d603b0a0a2f2f202a2a204d41594245202a2a3a2041677265676172206f20726573756c7461646f206465206dc3ba6c7469706c6173204150497320706172612061756d656e74617220612064657363656e7472616c697a61c3a7c3a36f0a636f6e737420726573706f6e7365203d2061776169742046756e6374696f6e732e6d616b654874747052657175657374287b75726c7d293b0a646174615374727563747572652e70757368287061727365496e7428726573706f6e73652e646174612e6d61696e2e68756d696469747929293b0a72657475726e2046756e6374696f6e732e656e636f646555696e7432353628646174615374727563747572655b305d293b0a'
    const buf = fromHex(computationJSHex);
    const computationJS = new TextDecoder().decode(buf);

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

    return requestCBOR;
}

export default buildRequestParameters;