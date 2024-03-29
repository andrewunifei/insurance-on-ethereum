import ethers from 'ethers'
import path from 'path';
import blockchain from '../../middleware/blockchain.js';
import chainlinkFunctions from '../../middleware/chainlinkFunctions.js'
import { expect } from 'chai';
import helpers from '../../mock/helpers.js';
import institutionManager from '../../middleware/institutionManager.js'
import APIArtifacts from '../../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' };
import LINKArtifacts from '../../build/artifacts/@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json' assert { type: 'json' };
import fsSync from 'node:fs';
import buildRequestParameters from '../../middleware/controller.js';
import config from '../../mock/mockBuildRequestConfig.js';
import donParams from '../../mock/mockDonParams.js'

describe('(TESTNET) Deployment Pipeline', async () => {
    // Interações com a Blockchain
    let signer;
    let provider;

    // Contratos
    let API, institution, insuranceContract, upkeep, LINK;

    // Chainlink Functions
    let manager;
    let subscriptionId;

    // Parâmetros
    const institutionName = 'Capital Expansion LTDA';
    const farmerAddr = '0xF91CA466849f1f53D12ACb40F7245dA43Af4A839';
    const reparationValue = ethers.utils.parseEther(String(0.01));
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
            API = await helpers.fetchAPI(signer, pathToFile, APIArtifacts);
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
            const pathToFile = path.resolve('deployed/pipeline-test-subscriptionId.txt');
            subscriptionId = await helpers.fetchSubscriptionId(
                manager, 
                institution.address,
                pathToFile
            );
          
            expect(subscriptionId).to.be.greaterThan(0);
        });

        it('Should FUND the Chainlink Functions subscription correctly', async () => {
            const juelsAmount = String(ethers.utils.parseEther(String(10))); // 1 LINK
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
            const payload = await buildRequestParameters(
                signer, 
                config,
                donParams
            );
            const donId = paylaod.formatedDonId;
            const requestCBOR = payload.requestCBOR
            const computationJS = '';
            insuranceParams = {
                signer: signer.address,
                farmer: farmerAddr,
                humidityLimit: 50,
                sampleMaxSize: 5,
                reparationValue,
                interval: 3 * 60, // 3 Minutos
                router: blockchain.sepolia.chainlinkRouterAddress,
                subscriptionId,
                registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
                linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
                registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
                gaslimit: 300000,
                donId,
                requestCBOR,
                computationJS
            };
        });

        it('Should register informations about the Institution correctly', async () => {
            const verification = await institution.info('Code');
            if(verification !== '123456789') {
                const tx = await institution.registerInfo(institutionInfo); // Array de array 
                await tx.wait();
                for (let pair of institutionInfo) {
                    await institution.info(pair[0])
                        .then(value => expect(value).to.equal(pair[1]))
                };
            }
        });

        it('Should whitelist the farmer address successfully', async () => {
            let addrWhiteListed = await institution.whitelist(farmerAddr);

            if(!addrWhiteListed) {
                await institutionManager.whitelistFarmer(institution, farmerAddr);
                addrWhiteListed = await institution.whitelist(farmerAddr);
            }
            
            expect(addrWhiteListed).to.be.true;
        });

        it('Should send Ether to the Institution correctly', async () => {
            const pathToFile = path.resolve('deployed/pipeline-test-insuranceContract.txt');
            const exists = fsSync.existsSync(pathToFile);
            if(!exists) {
                let institutionBalance = await institution.contractBalance();

                // ARRUMAR ISSO: MESMO PROBLEMA COM A TRANSFERENCIA DE LINK
                if(String(institutionBalance) !== String(reparationValue)){
                    await institutionManager.fundInstitution(signer, institution, 0.01);
                    institutionBalance = await institution.contractBalance();
                };
                expect(institutionBalance).to.equal(reparationValue);
            };
        });

        it('Should deploy a new Insurance Contract through the Institution successfully', async () => {
            insuranceContract = await helpers.fetchInsuranceContract(
                signer, 
                institution, 
                insuranceParams,
                'deployed/pipeline-test-insuranceContract.txt'
            );
            expect(insuranceContract.address.length).to.equal(42);
        });
    });

    describe('Insurance Contract', async () => {
        before(async () => {
            const LINKFactory = new ethers.ContractFactory(
                LINKArtifacts.abi,
                LINKArtifacts.bytecode,
                signer 
            );
            LINK = LINKFactory.attach(blockchain.sepolia.chainlinkLinkTokenAddress);
        });

        it('Should add Insurance Contract to Chainlink Functions subscription', async () => {
            let subscriptionInfo = await manager.getSubscriptionInfo(subscriptionId);
            let verification = subscriptionInfo.consumers.includes(insuranceContract.address);
            if(!verification){
                await insuranceContractManager.addInsuranceToSub(manager, subscriptionId, insuranceContract.address);
                subscriptionInfo = await manager.getSubscriptionInfo(subscriptionId);
                verification = subscriptionInfo.consumers.includes(insuranceContract.address);
            };
            expect(verification).to.be.true;
        });

        it('Should be properly funded with 10 LINK', async () => {
            const LINKAmount = ethers.utils.parseEther(String(10)); // eth --> wei
            let LINKBalance = await LINK.balanceOf(insuranceContract.address);
            if(LINKBalance.lt(LINKAmount)) {
                const diff = LINKAmount.sub(LINKBalance);
                const tx = await LINK.transfer(insuranceContract.address, diff);
                await tx.wait();
            }
            else if(LINKBalance.gt(LINKAmount)) {
                const diff = LINKBalance.sub(LINKAmount);
                await insuranceContract.approveLINK(diff);
                const tx = await LINK.transferFrom(insuranceContract.address, signer.address, diff);
                await tx.wait();
            }
            LINKBalance = await LINK.balanceOf(insuranceContract.address);
            expect(LINKBalance).to.equal(LINKAmount);
        });
    });
})