import { expect } from 'chai';
import ethers from 'ethers';
import blockchain from '../middleware/blockchain.js';
import insuranceContractArtifact from '../build/artifacts/contracts/mock/mockAutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }

describe('mockAutomatedFunctionsConsumer', async () => {
    const { signer, provider } = await blockchain.interaction(
        process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
        process.env.HARDHAT_RPC_URL
    );
    const insuranceContractFactory = new ethers.ContractFactory(
        insuranceContractArtifact.abi,
        insuranceContractArtifact.bytecode,
        signer
    );

    it('Should set the parameters correctly', async () => {
        const params = {
            // Esses endereços origem na blockcahin localhost (npx hardhat node)
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
        const insuranceContract = await insuranceContractFactory.deploy.apply(
            insuranceContractFactory, Object.values(params)
        );
        await insuranceContract.deployTransaction.wait(1);

        await insuranceContract.institution()
            .then(value => expect(value).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'))

        await insuranceContract.farmer()
            .then(value => expect(value).to.equal('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'))

        await insuranceContract.humidityLimit()
            .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(1));   

        await insuranceContract.sampleMaxSize()
            .then(value => expect(ethers.BigNumber.from(value).toNumber()).to.equal(211));  

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