import ethers from 'ethers'
import path from 'path';
import blockchain from '../../middleware/blockchain.js';
import chainlinkFunctions from '../../middleware/chainlinkFunctions.js'
import { expect } from 'chai';
import helpers from '../../mock/helpers.js';
import institutionManager from '../../middleware/institutionManager.js';
import APIArtifacts from '../../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' };
import LINKArtifacts from '../../build/artifacts/@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json' assert { type: 'json' };
import fsSync from 'node:fs';
import controller from '../../middleware/controller.js';
import dataParameters from '../../mock/mockDataParameters.js';
import insuranceContractManager from '../../middleware/insuranceContractManager.js';

describe('(TESTNET) Deployment Pipeline', async () => {
    // Interações com a Blockchain
    let signer;

    // Contratos
    let API, institution, insuranceContract, LINK;

    // Chainlink Functions
    let manager;
    let subscriptionId;

    before(async () => {
        const payload = await blockchain.interaction(
            process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
            process.env.ETHEREUM_SEPOLIA_RPC_URL
        );

        signer = payload.signer;
    });

    describe('InsuranceAPI', async () => {
        it('Should deploy the API contract to Sepolia Testnet successfully', async () => {
            const pathToFile = path.resolve('deployed/pipeline-test-API.txt');
            API = await helpers.fetchAPI(signer, pathToFile, APIArtifacts);
            expect(API.address.length).to.equal(42);
        });

        it('Should deploy an Institution through the API to Sepolia Testnet successfully', async () => {
            const pathToFile = path.resolve('deployed/pipeline-test-institution.txt');
            const payload = await helpers.fetchInstitution(signer, API, dataParameters.institutionInfo, pathToFile);
            institution = payload.institution;
            expect(institution.address.length).to.equal(42);
        });
    });

    describe('Institution', async () => {
        // it('Should register informations about the Institution correctly', async () => {
        //     const verification = await institution.info('Code');
        //     if(verification !== '123456789') {
        //         const tx = await institution.registerInfo(dataParameters.institutionInfo); // Array de array 
        //         await tx.wait();
        //         for (let pair of dataParameters.institutionInfo) {
        //             await institution.info(pair[0])
        //                 .then(value => expect(value).to.equal(pair[1]))
        //         };
        //     }
        // });

        it('Should whitelist the farmer address successfully', async () => {
            let addrWhiteListed = await institution.whitelist(dataParameters.farmerAddr);

            if(!addrWhiteListed) {
                await institutionManager.whitelistFarmer(institution, dataParameters.farmerAddr);
                addrWhiteListed = await institution.whitelist(dataParameters.farmerAddr);
            }
            
            expect(addrWhiteListed).to.be.true;
        });

        it('Should send Ether to the Institution correctly', async () => {
            console.log(dataParameters.reparationValue)
            const weiReparationValue = ethers.utils.parseEther(String(dataParameters.reparationValue))
            const pathToFile = path.resolve('deployed/pipeline-test-insuranceContract.txt');
            const exists = fsSync.existsSync(pathToFile);
            if(!exists) {
                let institutionBalance = await institution.contractBalance();

                // ARRUMAR ISSO: MESMO PROBLEMA COM A TRANSFERENCIA DE LINK
                if(String(institutionBalance) !== String(weiReparationValue)){
                    await institutionManager.fundInstitution(signer, institution, dataParameters.reparationValue);
                    institutionBalance = await institution.contractBalance();
                };
                expect(institutionBalance).to.equal(weiReparationValue);
            };
        });

        it('Should deploy a new Insurance Contract through the Institution successfully', async () => {
            insuranceContract = await helpers.fetchInsuranceContract(
                signer, 
                institution, 
                dataParameters.insuranceParams,
                'deployed/pipeline-test-insuranceContract.txt'
            );
            expect(insuranceContract.address.length).to.equal(42);
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
                pathToFile
            );
          
            expect(subscriptionId).to.be.greaterThan(0);
        });

        it('Should FUND the Chainlink Functions subscription correctly', async () => {
            const juelsAmount = String(ethers.utils.parseEther(String(2)));
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

        it('Should set the Subscription ID correctly in the Insurance Contract', async () => {
            let smartContractSubIdValue = await insuranceContract.subscriptionId();
            if(smartContractSubIdValue == 0) {
                const tx = await insuranceContract.setSubscriptionId(subscriptionId);
                await tx.wait();
                smartContractSubIdValue = await insuranceContract.subscriptionId();
            }
            expect(smartContractSubIdValue).to.equal(subscriptionId);
        });

        it('Should set the requestCBOR correctly in the Insurance Contract', async () => {
            let smartContractCBORValue = await insuranceContract.requestCBOR();
            if(smartContractCBORValue == ethers.utils.hexlify([])) {
                const payload = await controller.buildRequestParameters(
                    signer, 
                    dataParameters.config,
                    dataParameters.donParams
                );
                const tx = await insuranceContract.setCBOR(payload.requestCBOR);
                await tx.wait();
                smartContractCBORValue = await insuranceContract.requestCBOR();
                expect(smartContractCBORValue).to.equal(payload.requestCBOR);
            }
        });

        it('Should be properly funded with 10 LINK to be able to fund upkeep', async () => {
            const LINKAmount = ethers.utils.parseEther(String(2)); // eth --> wei
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