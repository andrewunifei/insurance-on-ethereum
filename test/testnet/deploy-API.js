import path from 'path';
import APIArtifacts from '../../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' };
import { expect } from 'chai';
import helpers from '../../mock/helpers.js';
import blockchain from '../../middleware/blockchain.js';

describe('(FRONTEND)', async () => {
    let signer;

    before(async () => {
        const payload = await blockchain.interaction(
            process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
            process.env.ETHEREUM_SEPOLIA_RPC_URL
        );

        signer = payload.signer;
    });

    describe('Deploy API', async () => {
        it('Should deploy the API contract to Sepolia Testnet successfully', async () => {
            const pathToFile = path.resolve('deployed/pipeline-test-API.txt');
            const API = await helpers.fetchAPI(signer, pathToFile, APIArtifacts);
            expect(API.address.length).to.equal(42);
        });
    })
});