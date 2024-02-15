import { expect } from 'chai';
import helpers from '@nomicfoundation/hardhat-network-helpers';
import ethers from 'ethers';
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

    const signer = await ethers.getSigner()
    console.log(signer)

    before(async () => {
        // const { signer, provider } = await blockchain.interaction(
        //     process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
        //     process.env.HARDHAT_RPC_URL
        // );

        const provider = hre.network.provider
        const signer = await ethers.getSigner()
        console.log(signer)

        // insuranceContractFactory = new ethers.ContractFactory(
        //     insuranceContractArtifact.abi,
        //     insuranceContractArtifact.bytecode,
        //     signer
        // );
    })

    describe('constructor', async () => {
        it('Should set the parameters correctly', async () => {
            insuranceContract = await insuranceContractFactory.deploy.apply( 
                insuranceContractFactory, Object.values(params) // apply permite uma [lista] de argumentos
            );
            await insuranceContract.deployTransaction.wait(1);

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
            console.log(await helpers.time.latestBlock())
            await helpers.mine(5, { interval: 15 });
            console.log(await helpers.time.latestBlock()) 
            await insuranceContract.setRequest.apply(
                insuranceContract, Object.values(requestParameters)
            );
            await insuranceContract.requestCBOR()
                .then(value => expect(value).to.equal(requestParameters.requestCBOR));
            await insuranceContract.subscriptionId()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(requestParameters.subscriptionId));
            await insuranceContract.donID()
                .then(value => expect(value).to.equal(requestParameters.bytes32DonId));
            console.log(await helpers.time.latestBlock())
        });
    });

    // describe('checkUpkeep', async () => {
    //     it('Should check the time correctly', async () => {
    //         console.log(await helpers.time.latestBlock())
    //         await helpers.mine(1, { interval: 15 });
    //         console.log(await helpers.time.latestBlock())
    //         await insuranceContract.checkUpkeep([]);
    //         console.log(await helpers.time.latestBlock())
    //     });
    // });

})