import { expect } from 'chai';
import helpers from '@nomicfoundation/hardhat-network-helpers';
import hh from 'hardhat';
const { ethers } = hh;

//import ethers from 'ethers';

import blockchain from '../middleware/blockchain.js';
import { buildRequestParameters } from '../mock/mockController.js'
import insuranceContractArtifact from '../build/artifacts/contracts/mock/mockAutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }

describe('Smart Contract: mockAutomatedFunctionsConsumer', async () => {
    let insuranceContract;
    let signer;

    const params = {
        // Esses endereços tem origem na blockcahin localhost (npx hardhat node)
        signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 
        farmer: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 
        humidityLimit: 10,
        maxSampleQuantity: 10,
        reparationValue: ethers.utils.parseEther(String(1)), // eth --> wei
        interval: 10,
        router: blockchain.sepolia.chainlinkRouterAddress,
        subscriptionId: 0,
        registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
        linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
        registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
        gaslimit: 300000
    };

    // Implanta o contrato inteligente toda vez antes de um novo 'describe'
    beforeEach(async () => {
        // const { signer, provider } = await blockchain.interaction(
        //     process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
        //     process.env.HARDHAT_RPC_URL
        // );

        signer = await ethers.getSigner();

        const insuranceContractFactory = new ethers.ContractFactory(
            insuranceContractArtifact.abi,
            insuranceContractArtifact.bytecode,
            signer
        );

        // apply permite uma [lista] de argumentos para uma função
        insuranceContract = await insuranceContractFactory.deploy.apply( 
            insuranceContractFactory, Object.values(params) 
        );
        await insuranceContract.deployTransaction.wait(1);
    })

    describe('constructor', async () => {
        it('Should set the parameters correctly', async () => {
            // await e then em conjunto é necessário porque o mocha não aguarda o then, mas aguarda o await
            // Estou usando o then para evitar a declaração de múltiplas variáveis
            await insuranceContract.institution()
                .then(value => expect(value).to.equal(params.signer));
            await insuranceContract.farmer()
                .then(value => expect(value).to.equal(params.farmer));
            await insuranceContract.humidityLimit()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(params.humidityLimit));   
            await insuranceContract.maxSampleQuantity()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(params.maxSampleQuantity));  
            await insuranceContract.reparationValue()
                .then(value => expect(ethers.BigNumber.from(value).toString())
                                .to.equal(ethers.BigNumber.from(params.reparationValue).toString())); 
            await insuranceContract.interval()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(params.interval)); 
            await insuranceContract.router()
                .then(value => expect(value).to.equal(params.router));
            await insuranceContract.subscriptionId()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(params.subscriptionId));
            await insuranceContract.registry()
                .then(value => expect(value).to.equal(params.registryAddress));
            await insuranceContract.sepoliaLINKAddress()
                .then(value => expect(value).to.equal(params.linkTokenAddress));
            await insuranceContract.sepoliaRegistrarAddress()
                .then(value => expect(value).to.equal(params.registrarAddress));
            await insuranceContract.fulfillGasLimit()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(params.gaslimit));         
        })
    })

    describe('setRequest', async () => {
        let requestParameters;
        const config = {
            computation: '../rules/computation.js',
            args: ["44.34", "10.99"],
            secrets: { apiKey: process.env.OPEN_WEATHER_API_KEY },
            donId: 'fun-ethereum-sepolia-1',
            subscriptionId: 0
        };
       
        before(async () => {
            requestParameters = buildRequestParameters(config);
        });
        it('Should set the request parameters correctly', async () => {
            // Modifica a blockchain. Isso cria um novo bloco e modifica o timestamp (+1 segundo)
            await insuranceContract.setRequest.apply(
                insuranceContract, Object.values(requestParameters)
            );

            // Não modifica a blockchain, apenas consulta o estado de variáveis públicas
            await insuranceContract.requestCBOR()
                .then(value => expect(value).to.equal(requestParameters.requestCBOR));
            await insuranceContract.subscriptionId()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(requestParameters.subscriptionId));
            await insuranceContract.donID()
                .then(value => expect(value).to.equal(requestParameters.bytes32DonId));
        });
    });

    describe('checkUpkeep', async () => {
        it('If the difference of timestamps is equal to the interval (seconds), should return false', async () => {
            // Move o timestamp ${interval} segundo(s) no futuro + 1 segundo (tempo para minerar o bloco)
            // É necessário minerar dois blocos para funcionar, porque o intervalo é entre esss dois blocos
            await helpers.mine(2 ,{ interval: 9 });
            const check = await insuranceContract.checkUpkeep([]);
            expect(check[0]).to.equal(false) ;
        });
        it('If the difference of timestamps is greater than the interval (seconds), should return true', async () => {
            // Move o timestamp ${interval} segundo(s) no futuro + 1 segundo (tempo para minerar o bloco)
            // É necessário minerar dois blocos para funcionar, porque o intervalo é entre esss dois blocos
            await helpers.mine(2, { interval: 10 });
            const check = await insuranceContract.checkUpkeep([]);
            expect(check[0]).to.equal(true);
        });
    });

    describe('performUpkeep', async () => {
        it('Should revert if Upkeep is NOT needed', async () => {
            await expect(insuranceContract.performUpkeep([], 0)).to.be.revertedWith('Time interval not met');
        })
        it('Should NOT revert if Upkeep is needed', async () => {
            await helpers.mine(2, { interval: 10 });
            await expect(insuranceContract.performUpkeep([], 0)).not.to.be.reverted;
        })
        it('Max sample size NOT met: should correctly call _sendRequest() from mock Chainlink Functions', async () => {
            const expectIdValue = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32)
            await helpers.mine(2, { interval: 10 });
            await expect(insuranceContract.performUpkeep([], 0))
                .to.emit(insuranceContract, 'RequestIdUpdated')
                .withArgs(expectIdValue);
        })
        it('Max sample size NOT met: Should NOT change controlFlag value', async () => {
            await helpers.mine(2, { interval: 10 });
            await expect(insuranceContract.performUpkeep([], 0))
                .to.emit(insuranceContract, 'ControlFlagValue')
                .withArgs(0);
        })
        it('Max sample size met: Should correctly call _sendRequest() from mock Chainlink Functions', async () => {
            const expectIdValue = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32)
            await helpers.mine(2, { interval: 10 });
            await expect(insuranceContract.performUpkeep([], 11))
                .to.emit(insuranceContract, 'RequestIdUpdated')
                .withArgs(expectIdValue)
        })
        it('Max sample size met: Should change controlFlag value', async () => {
            await helpers.mine(2, { interval: 10 });
            await expect(insuranceContract.performUpkeep([], 11))
                .to.emit(insuranceContract, 'ControlFlagValue')
                .withArgs(1);
        })
    })

    describe('fulfillRequest', async () => {
        it('Max sample size NOT met: Should push the new sample to data structure', async () => {
            const requestId = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);
            const response = ethers.utils.arrayify('0x616e64726577');
            await expect(insuranceContract.fulfillRequest(requestId, response, []))
                .to.emit(insuranceContract, 'sampleStorageLength')
                .withArgs(1);
        })
        it('Max sample quantity met: Should bypass controlFlag', async () => {
            const requestId = ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 32);
            const response = ethers.utils.arrayify('0x616e64726577');
            await helpers.mine(2, { interval: 10 });
            await insuranceContract.performUpkeep([], 11);
            await expect(insuranceContract.fulfillRequest(requestId, response, []))
                .to.emit(insuranceContract, 'sampleStorageLength')
                .withArgs(params.maxSampleQuantity);
        })
    })

    describe('verify', async () => {
        beforeEach(async () => {
            const tx = await signer.sendTransaction(
                {
                    to: insuranceContract.address,
                    value: ethers.utils.parseEther(String(2)) // eth --> wei
                }
            );
            await tx.wait(1);
        })
        it('Should send the contract balance to the farmer because condition met', async () => {
            await insuranceContract.verifyIndex(1);
            const farmerBalance = await ethers.provider.getBalance(params.farmer);
            expect(farmerBalance).to.equal(ethers.utils.parseEther(String(10002)));
        });
        it('Should send the contract balance to the institution because condition NOT met', async () => {
            const institutionBalanceBefore = await ethers.provider.getBalance(signer.address);
            await insuranceContract.verifyIndex(11);
            const institutionBalanceAfter = await ethers.provider.getBalance(signer.address);
            const difference = institutionBalanceAfter - institutionBalanceBefore;
            const condition = (difference >= ethers.utils.parseEther(String(1.99)) && difference <= ethers.utils.parseEther(String(2)));
            expect(condition).to.be.true;
        })
    })

    describe('contractBalance', async () => {
        it('Should return the correct contract balance', async () => {
            const tx = await signer.sendTransaction(
                {
                    to: insuranceContract.address,
                    value: ethers.utils.parseEther(String(2)) // eth --> wei
                }
            );
            await tx.wait(1);

            expect(await insuranceContract.contractBalance()).to.equal(ethers.utils.parseEther(String(2)))
        });
    });
})