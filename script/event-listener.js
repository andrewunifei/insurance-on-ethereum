import ethers from 'ethers';
import fs from 'node:fs/promises';
import path from 'path';
import insuranceContractArtifacts from '../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' };

async function main() {
    let insuranceContract;
    let insuranceContractAddress
    const topic = 'avgCalculated';

    console.log('\n🟡 Event Listener initiated. Trying to fetch address of deployed Insurance Contract...')
    try {
        const pathToAddress = path.resolve('deployed/pipeline-test-insuranceContract.txt');
        const provider = new ethers.providers.WebSocketProvider(process.env.ETHEREUM_SEPOLIA_WEBSOCKET_URL);
        const buffer = await fs.readFile(pathToAddress);
        insuranceContractAddress = buffer.toString();
        insuranceContract = new ethers.Contract(
            insuranceContractAddress,
            insuranceContractArtifacts.abi,
            provider
        );   
        console.log('✅ Success fetching address of deployed Insurance Contract!\n')
    }
    catch(e) {
        console.log(`❌ It was not possible to fetch address of deployed Insurance Contract. Reason: ${e}\n`)
    }

    console.log(`\n🌀 Listening for events on topic \"${topic}\" for Insurance Contract ${insuranceContractAddress}...\n`);
    try {
        // insuranceContract.on(topic, (requestId, result, err, event) => {
        //     console.log(JSON.stringify(result));
        // });

        insuranceContract.on(topic, (num, event) => {
            console.log(Number(num._hex));
        })

        // insuranceContract.on(topic, (converted, event) => {
        //     console.log(converted);
        //     console.log(typeof converted);
        // })
    }
    catch(e) {
        console.log(`❌ Listener stopped unexpectedly. Reason: ${e}`)
    }

}

main();