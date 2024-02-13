import { expect } from 'chai';
import ethers from 'ethers';
import blockchain from '../middleware/blockchain.js';
import { buildRequestParameters } from '../mock/mockController.js'
import insuranceContractArtifact from '../build/artifacts/contracts/mock/mockAutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }

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
        interval: 1,
        router: blockchain.sepolia.chainlinkRouterAddress,
        subscriptionId: 0,
        registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
        linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
        registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
        gaslimit: 300000
    };

    before(async () => {
        const { signer, provider } = await blockchain.interaction(
            process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
            process.env.HARDHAT_RPC_URL
        );

        insuranceContractFactory = new ethers.ContractFactory(
            insuranceContractArtifact.abi,
            insuranceContractArtifact.bytecode,
            signer
        );
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
                .then(value => expect(value).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'))
            await insuranceContract.farmer()
                .then(value => expect(value).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'))
            await insuranceContract.humidityLimit()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(1));   
            await insuranceContract.sampleMaxSize()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(1));  
            await insuranceContract.reparationValue()
                .then(value => expect(ethers.BigNumber.from(value).toString())
                                .to.equal(ethers.BigNumber.from(ethers.utils.parseEther('1')).toString())); 
            await insuranceContract.interval()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(1)); 
            await insuranceContract.router()
                .then(value => expect(value).to.equal(blockchain.sepolia.chainlinkRouterAddress));
            await insuranceContract.subscriptionId()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(0));
            await insuranceContract.registry()
                .then(value => expect(value).to.equal(blockchain.sepolia.chainlinkRegistryAddress));
            await insuranceContract.sepoliaLINKAddress()
                .then(value => expect(value).to.equal(blockchain.sepolia.chainlinkLinkTokenAddress));
            await insuranceContract.sepoliaRegistrarAddress()
                .then(value => expect(value).to.equal(blockchain.sepolia.chainlinkRegistrarAddress));
            await insuranceContract.fulfillGasLimit()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(300000));         
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
        }

        before(async () => {
            requestParameters = await buildRequestParameters(config)
        })

        it('Should set the request parameters correctly', async () => {
            await insuranceContract.setRequest.apply(
                insuranceContract, Object.values(requestParameters)
            )
            await insuranceContract.requestCBOR()
                .then(value => expect(value).to.equal(requestParameters.requestCBOR))
            await insuranceContract.subscriptionId()
                .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(requestParameters.subscriptionId))
            await insuranceContract.donID()
                .then(value => expect(value).to.equal(requestParameters.bytes32DonId))  
        })
    })

})