import ethers from 'ethers';
import fs from 'node:fs/promises';
import path from 'path';
import insuranceContractArtifacts from '../../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' };

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
    const topic = 'responseString';

    console.log(`\n🌀 Listening for events on topic \"${topic}\"...\n`);
    insuranceContract.on(topic, (response) => {
        console.log(response);
    });
}

main();




// describe('(CHAINLINK) Functions and Automation', async () => {
//     let insuranceContract;
//     let aaa;

//     before(async () => {
//         const { signer } = await blockchain.interaction(
//             process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
//             process.env.ETHEREUM_SEPOLIA_RPC_URL
//         );
//         const pathToAddress = path.resolve('deployed/pipeline-test-insuranceContract.txt');
//         const buffer = await fs.readFile(pathToAddress);
//         const insuranceContractAddress = buffer.toString();

//         insuranceContract = new ethers.Contract(
//             insuranceContractAddress,
//             insuranceContractArtifacts.abi,
//             signer
//         );
//     });

//     it('Should capture the event responseString when fulfillRequest is called', async () => {
//         while(true){
//             await insuranceContract.on("responseString", (response) => {
//                 console.log(response);
//             });
//         }
//     });

//     it('Should capture the event OCRResponse when fulfillRequest is called', async () => {
//         insuranceContract.on("OCRResponse", (reqId, response, err) => {
//             console.log(reqId, response, err);
//         });
//     });
// })