import path from 'path'
import { fileURLToPath } from 'url';
import blockchain from '../../middleware/blockchain.js';
import { expect } from 'chai';
import hh from 'hardhat';
const { ethers } = hh;

import helpers from '../../mock/helpers.js'

import APIArtifact from '../../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' };
import institutionArtifact from '../../build/artifacts/contracts/Institution.sol/Institution.json' assert { type: 'json' };
import insuranceContractArtifact from '../../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' };

describe('(TESTNET) Deployment Pipeline', async () => {
    let signer;
    let provider;
    let API;

    before(async () => {
        const data = await blockchain.interaction(
            process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
            process.env.ETHEREUM_SEPOLIA_RPC_URL
        );

        signer = data.signer;
        provider = data.provider;
    });

    describe('InsuranceAPI', async () => {
        it('Should deploy the API contract to Sepolia Testnet correctly', async () => {
            const pathToFile = path.resolve('deployed/pipeline-test-API.txt');
            console.log(pathToFile);
            API = await helpers.fetchAPI(signer, pathToFile, APIArtifact);

            console.log(API)
        })
    })
})