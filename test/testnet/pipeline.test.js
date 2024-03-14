import ethers from 'ethers'
import path from 'path';
import blockchain from '../../middleware/blockchain.js';
import chainlinkFunctions from '../../middleware/chainlinkFunctions.js'
import { expect } from 'chai';
import helpers from '../../mock/helpers.js';
import APIArtifact from '../../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' };

describe('(TESTNET) Deployment Pipeline', async () => {
    // Interações com a Blockchain
    let signer;
    let provider;

    // Contratos
    let API, institution, insuranceContract;

    // Chainlink Functions
    let manager;
    let subscriptionId;

    // Parâmetros
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
    let insuranceParams;

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

    describe('Chainlink Functions', async () => {
        before(async () => {
            manager = await chainlinkFunctions.createManager(
                signer,
                blockchain.sepolia.chainlinkLinkTokenAddress,
                blockchain.sepolia.chainlinkRouterAddress
            );
        });

        it('Should CREATE a Chainlink Functions subscription successfully', async () => {
            subscriptionId = await helpers.fetchSubscriptionId(
                manager, 
                institution.address,
                'deployed/pipeline-test-subscriptionId.txt'
            );
          
            expect(subscriptionId).to.be.greaterThan(0);
        });

        it('Should FUND the Chainlink Functions subscription correctly', async () => {
            const juelsAmount = String(ethers.utils.parseEther(String(1))); // 1 LINK
            let subscriptionInfo = await manager.getSubscriptionInfo(subscriptionId);

            if(subscriptionInfo.balance <= BigInt(ethers.utils.parseEther(String(0.01))._hex)) {
                console.log(`❗️ Subscription without funds. Funding...`)
                const receipt = await manager.fundSubscription({
                    subscriptionId, 
                    juelsAmount
                });
                console.log(`✅ Successfully funded Subscription ${subscriptionId} at transaction ${receipt.transactionHash}`)
            };

            subscriptionInfo = await manager.getSubscriptionInfo(subscriptionId);
            expect(subscriptionInfo.balance).to.equal(juelsAmount);
        })
    });

    describe('Institution', async () => {
        before(async () => {
            insuranceParams = {
                signer: signer.address,
                farmer: farmerAddr,
                hudityLimit: 50,
                sampleMaxSize: 5,
                reparationValue: ethers.utils.parseEther(String(0.01)),
                updateInteval: 3 * 60,
                router: blockchain.sepolia.chainlinkRouterAddress,
                subscriptionId,
                regitry: blockchain.sepolia.chainlinkRegistryAddress,
                sepoliaLINKAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
                sepoliaRegistratAddress: blockchain.sepolia.chainlinkRegistrarAddress,
                fulfillGasLimit: 300000
            };
        });

        it('Should register informations about the Institution correctly', async () => {
            const tx = await institution.registerInfo(institutionInfo); // Array de array 
            await tx.wait();
            for (let pair of institutionInfo) {
                await institution.info(pair[0])
                    .then(value => expect(value).to.equal(pair[1]))
            };
        });

        it('Should whitelist the farmer address successfully', async () => {
            let addrWhiteListed = await institution.whitelist(farmerAddr);

            if(!addrWhiteListed) {
                const tx = await institution.whitelistAddr(farmerAddr);
                await tx.wait();
                addrWhiteListed = await institution.whitelist(farmerAddr);
            }
            
            expect(addrWhiteListed).to.be.true;
        });

        // it('Should deploy a new Insurance Contract through the Institution successfully', async () => { 
        //     insuranceContract = await helpers.fetchInsuranceContract(
        //         signer, 
        //         institution, 
        //         insuranceParams,
        //         'deployed/pipeline-test-insuranceContract.txt'
        //     )
        //     expect(insuranceContract.address.length).to.equal(42);
        // })
    });
})