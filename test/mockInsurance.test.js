import { expect } from 'chai';
import helpers from '@nomicfoundation/hardhat-network-helpers';
//import ethers from 'ethers';

import blockchain from '../middleware/blockchain.js';
import { buildRequestParameters } from '../mock/mockController.js'
import insuranceContractArtifact from '../build/artifacts/contracts/mock/mockAutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }
import hre from 'hardhat';

describe('Smart Contract: mockAutomatedFunctionsConsumer', async () => {
    let insuranceContractFactory;
    let insuranceContract;
    const params = {
        // Esses endereços tem origem na blockcahin localhost (npx hardhat node)
        signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 
        farmer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 
        humidityLimit: 1,
        sampleMaxSize: 1,
        reparationValue: ethers.utils.parseEther("1"), // eth --> wei
        interval: 10,
        router: blockchain.sepolia.chainlinkRouterAddress,
        subscriptionId: 0,
        registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
        linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
        registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
        gaslimit: 300000
    };

    let signer;
    let provider;

    // Implanta o contrato inteligente toda vez antes de um novo 'describe'
    beforeEach(async () => {
        // const { signer, provider } = await blockchain.interaction(
        //     process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
        //     process.env.HARDHAT_RPC_URL
        // );

        provider = hre.network.provider
        signer = await ethers.getSigner()

        insuranceContractFactory = new ethers.ContractFactory(
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
            // estou usando o then para evitar a declaração de múltiplas variáveis
            await insuranceContract.institution()
                .then(value => expect(value).to.equal(params.signer));
            await insuranceContract.farmer()
                .then(value => expect(value).to.equal(params.farmer));
            await insuranceContract.humidityLimit()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(params.humidityLimit));   
            await insuranceContract.sampleMaxSize()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(params.sampleMaxSize));  
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
        it('Should revert if Upkeep is not needed', async () => {
            await expect(insuranceContract.performUpkeep([])).to.be.revertedWith('Time interval not met');
        })
        it('Should NOT revert if Upkeep is needed', async () => {
            await helpers.mine(2, { interval: 10 });
            await expect(insuranceContract.performUpkeep([])).not.to.be.reverted;
        })
    })
})