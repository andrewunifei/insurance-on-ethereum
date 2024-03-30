import ethers from 'ethers';
import fs from 'node:fs/promises';
import path from 'path';
import insuranceContractArtifacts from '../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' };

async function main() {
    const pathToAddress = path.resolve('deployed/pipeline-test-insuranceContract.txt');
    const provider = new ethers.providers.WebSocketProvider(process.env.ETHEREUM_SEPOLIA_WEBSOCKET_URL);
    const buffer = await fs.readFile(pathToAddress);
    const insuranceContractAddress = buffer.toString();
    const insuranceContract = new ethers.Contract(
        insuranceContractAddress,
        insuranceContractArtifacts.abi,
        provider
    );
    // const topic = 'OCRResponse';
    const topic = 'asNum';

    console.log(`\n🌀 Listening for events on topic \"${topic}\" for Insurance Contract ${insuranceContractAddress}...\n`);
    insuranceContract.on(topic, (requestId, result, err, event) => {
        const res = {
            requestId,
            result,
            err,
            data: event
        };
        console.log(JSON.stringify(res));
    });
}

main();