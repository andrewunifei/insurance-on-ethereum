import { expect } from 'chai';
import helpers from '@nomicfoundation/hardhat-network-helpers';
import hh from 'hardhat';
const { ethers } = hh;

import blockchain from '../middleware/blockchain.js';
import institutionArtifact from '../build/artifacts/contracts/mock/mockInstitution.sol/Institution.json' assert { type: 'json' }

describe('Smart Contract: mockInsurance', async () => {
    let institutionContract;
    let signer;

    const params = {
        owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        institutionName: 'Capital Expansion LTDA'
    };

    const info = [
        ['Code', '123456789'],
        ['Full Name', 'Capital Expansion LTDA'],
        ['Short name', 'CE'],
        ['Address', 'Wall St'],
        ['State', 'New York'],
        ['Email', 'contact@ce.com'],
        ['Phone', '+00 000000000'],
    ]

    beforeEach(async () => {
        signer = await ethers.getSigner();

        const institutionFactory = new ethers.ContractFactory(
            institutionArtifact.abi,
            institutionArtifact.bytecode,
            signer
        );

        institutionContract = await institutionFactory.deploy.apply(
            institutionFactory, Object.values(params)
        );
        await institutionContract.deployTransaction.wait(1);
    })

    describe('constructor', async () => {
        it('Should set the parameters correctly', async () => {
            await institutionContract.im_owner()
                .then(value => expect(value).to.equal(params.owner));
            await institutionContract.institutionName()
                .then(value => expect(value).to.equal(params.institutionName));
        });
    });

    describe('registerInfo', async () => {
        it('Should set the institution extra information correctly', async () => {
            await institutionContract.registerInfo(info);
            for (let pair of info) {
                await institutionContract.info(pair[0])
                    .then(value => expect(value).to.equal(pair[1]))
            };
        });
    })
})