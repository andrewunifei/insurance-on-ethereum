import ethers from 'ethers';
import { expect } from 'chai';
import helpers from '../../mock/helpers.js';
import path from 'path';
import fs from 'node:fs/promises';
import LINKArtifacts from '../../build/artifacts/@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json' assert { type: 'json' };
import insuranceContractArtifacts from '../../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' };

describe('(CHAINLINK) Upkeep', async () => {
    // Parametros
    let upkeepParams;

    // Contratos
    let LINK, insuranceContract;

    before(async () => {
        const buffer = await fs.readFile(path)
        const insuranceContractAddress = buffer.toString()

        upkeepParams = {
            name: 'upkeep-pipeline-test',
            encryptedEmail: ethers.utils.hexlify([]),
            upkeepContract: insuranceContractAddress, // insuranceContractAddress
            gasLimit: 300000,
            adminAddress: signer.address, // Deployer
            triggerType: 0,
            checkData: ethers.utils.hexlify([]),
            triggerConfig: ethers.utils.hexlify([]),
            offchainConfig: ethers.utils.hexlify([]),
            amount: ethers.utils.parseEther(String(10)) // LINK --> Juels
        };

        insuranceContract = new ethers.Contract(
            insuranceContractAddress,
            insuranceContractArtifacts.abi,
            signer
        );

        const LINKFactory = new ethers.ContractFactory(
            LINKArtifacts.abi,
            LINKArtifacts.bytecode,
            signer 
        );
        LINK = LINKFactory.attach(blockchain.sepolia.chainlinkLinkTokenAddress);
    });

    it('Should create an upkeep through Insurance Contract successfully and fund it with 10 LINK', async () => {
        const LINKAmount = ethers.utils.parseEther(String(10));
        const LINKBalance = await LINK.balanceOf(insuranceContract.address);
        expect(String(LINKBalance) === String(LINKAmount)).to.be.true;
        if(String(LINKBalance) === String(LINKAmount)){
            upkeep = await helpers.fetchUpkeep(
                signer, 
                insuranceContract, 
                LINKAmount, 
                'deployed/pipeline-test-upkeep.txt'
            );
            expect(upkeep.address.length).to.equal(42);
        };
    });

    it('Should register the created upkeep successfully', async () => {
        let tx;
        await expect(
            tx = await insuranceContract.registerUpkeep(upkeepParams)
        ).to.emit(insuranceContract, 'upkeepRegistered'); 
        await tx.wait();
    });
});