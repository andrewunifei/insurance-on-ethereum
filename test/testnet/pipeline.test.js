import path from 'path';
import blockchain from '../../middleware/blockchain.js';
import { expect } from 'chai';
import helpers from '../../mock/helpers.js';
import APIArtifact from '../../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' };

function minutesToSeconds(minutes) {
    return minutes * 60;
}

describe('(TESTNET) Deployment Pipeline', async () => {
    let signer;
    let provider;
    let API, institution;
    const institutionName = 'Capital Expansion LTDA';
    const farmerAddr = '0xF91CA466849f1f53D12ACb40F7245dA43Af4A839';
    const institutionInfo = [
        ['Code', '123456789'],
        ['Full Name', 'Capital Expansion LTDA'],
        ['Short name', 'CE'],
        ['Address', 'Wall St'],
        ['State', 'New York'],
        ['Email', 'contact@ce.com'],
        ['Phone', '+00 000000000'],
    ];
    const insuranceParams = {
        signer: signer.address,
        farmer: farmerAddr,
        hudityLimit: 50,
        sampleMaxSize: 5,
        reparationValue: ethers.utils.parseEther(String(0.01)),
        updateInteval: minutesToSeconds(3),
        router: blockchain.sepolia.chainlinkRouterAddress,
        subscriptionId: 0, // TODO
        regitry: blockchain.sepolia.chainlinkRegistryAddress,
        sepoliaLINKAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
        sepoliaRegistratAddress: blockchain.sepolia.chainlinkRegistrarAddress,
        fulfillGasLimit: 300000
    }

    before(async () => {
        const payload = await blockchain.interaction(
            process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
            process.env.ETHEREUM_SEPOLIA_RPC_URL
        );

        signer = payload.signer;
        provider = payload.provider;
    });

    describe('InsuranceAPI', async () => {
        it('Should deploy the API contract to Sepolia Testnet successfully', async () => {
            const pathToFile = path.resolve('deployed/pipeline-test-API.txt');
            API = await helpers.fetchAPI(signer, pathToFile, APIArtifact);
            expect(API.address.length).to.equal(42);
        });

        it('Should deploy an Institution through the API to Sepolia Testnet successfully', async () => {
            const pathToFile = path.resolve('deployed/pipeline-test-institution.txt');
            const payload = await helpers.fetchInstitution(signer, API, institutionName, pathToFile);
            institution = payload.institution;
            expect(institution.address.length).to.equal(42);
        });
    });

    describe('Institution', async () => {
        it('Should register infomations about the Institution correctly', async () => {
            const tx = await institution.registerInfo(institutionInfo); // Array de array 
            await tx.wait();
            for (let pair of institutionInfo) {
                await institution.info(pair[0])
                    .then(value => expect(value).to.equal(pair[1]))
            };
        });

        it('Should deploy a new Insurance Contract through the Institution successfully', async () => { 
            const tx = await institution.whitelistAddr(farmerAddr);
            await tx.wait();
            const tx2 = await institution.createInsuranceContract(

            );
        })
    });
})