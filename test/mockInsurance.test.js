import { expect } from 'chai';
import ethers from 'ethers';
import blockchain from '../middleware/blockchain.js';
import { buildRequestParameters } from '../mock/mockController.js'
import insuranceContractArtifact from '../build/artifacts/contracts/mock/mockAutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }

describe('mockAutomatedFunctionsConsumer', async () => {
    let insuranceContract;

    before(async () => {
        const { signer, provider } = await blockchain.interaction(
            process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
            process.env.HARDHAT_RPC_URL
        );

        const insuranceContractFactory = new ethers.ContractFactory(
            insuranceContractArtifact.abi,
            insuranceContractArtifact.bytecode,
            signer
        );

        const params = {
            // Esses endereços tem origem na blockcahin localhost (npx hardhat node)
            signer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 
            farmer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 
            humidityLimit: 1,
            sampleMaxSize: 1,
            reparationValue: ethers.utils.parseEther("1"), // eth --> wei
            interval: 1,
            router: blockchain.sepolia.chainlinkRouterAddress,
            subscriptionId: 0,
            registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
            linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
            registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
            gaslimit: 300000
        };

        insuranceContract = await insuranceContractFactory.deploy.apply(
            insuranceContractFactory, Object.values(params)
        );
        await insuranceContract.deployTransaction.wait(1);
    })

    describe('constructor', async () => {
        it('Should set the parameters correctly', async () => {
            insuranceContract.institution()
                .then(value => expect(value).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'))
            insuranceContract.farmer()
                .then(value => expect(value).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'))
            insuranceContract.humidityLimit()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(1));   
            insuranceContract.sampleMaxSize()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(1));  
            insuranceContract.reparationValue()
                .then(value => expect(ethers.BigNumber.from(value).toString())
                                .to.equal(ethers.BigNumber.from(ethers.utils.parseEther('1')).toString())); 
            insuranceContract.interval()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(1)); 
            insuranceContract.router()
                .then(value => expect(value).to.equal(blockchain.sepolia.chainlinkRouterAddress));
            insuranceContract.subscriptionId()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(0));
            insuranceContract.registry()
                .then(value => expect(value).to.equal(blockchain.sepolia.chainlinkRegistryAddress));
            insuranceContract.sepoliaLINKAddress()
                .then(value => expect(value).to.equal(blockchain.sepolia.chainlinkLinkTokenAddress));
            insuranceContract.sepoliaRegistrarAddress()
                .then(value => expect(value).to.equal(blockchain.sepolia.chainlinkRegistrarAddress));
            insuranceContract.fulfillGasLimit()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(300000));         
        })
    })

    describe('setRequest', async () => {
        let requestParameters;

        const config = {
            computation: '../rules/computation.js',
            args: ["44.34", "10.99"],
            gasLimit: 300000,
            secrets: { apiKey: process.env.OPEN_WEATHER_API_KEY },
            donId: 'fun-ethereum-sepolia-1',
            subscriptionId: 0
        }

        before(async () => {
            requestParameters = await buildRequestParameters(config)
        })

        it('Should set the request parameters correctly', async () => {
            await insuranceContract.setRequest(requestParameters)
            insuranceContract.requestCBOR()
                .then(value => console.log(value))
            insuranceContract.subscriptionId()
                .then(value => expect(value).to.equal(config.subscriptionId))
            insuranceContract.fulfillGasLimit()
                .then(value => expect(value).to.equal(config.gasLimit))   
            insuranceContract.donID()
                .then(value => expect(value).to.equal(config.donId))  
        })
    })

})