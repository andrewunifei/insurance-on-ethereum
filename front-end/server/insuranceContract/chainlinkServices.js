import blockchain from '../blockchain.js'
import buildRequestParameters from './handleBuild.js'
import mountLINK from '../mounts/mountLINKToken.js'
import { ethers } from 'ethers';
import {
    SubscriptionManager
} from '@chainlink/functions-toolkit'

/**
 * Instancia um objeto para acessar as funcionalidades de Chainlink Functions 
 * @param {ethers.Wallet} signer 
 * @param {string} linkTokenAddress 
 * @param {string} routerAddress 
 * @returns {Promise<SubscriptionManager>}
 */
async function createManager(signer, linkTokenAddress, routerAddress) {
    const manager = new SubscriptionManager(
        {
            signer: signer,
            linkTokenAddress: linkTokenAddress, 
            functionsRouterAddress: routerAddress
        }
    )

    await manager.initialize()

    return manager
}

async function handleChainlinkFunctions(
    signer, 
    functionsFund, 
    insuranceContract,
    insuranceContractAddress, 
    config,
    donParams
) {
    try {
        let subscriptionId;

        // Objeto para interação com Chainlink Functions
        const manager = await createManager(
            signer, 
            blockchain.sepolia.chainlinkLinkTokenAddress,
            blockchain.sepolia.chainlinkRouterAddress
        );

        try {
            // ASSINATURA 2: Inscrição em Chainlink Functions
            subscriptionId = await manager.createSubscription();
            
            // SEND WEBSOCKET NOTIFICATION TO CHANGE
            // statesSetters.setSubscriptionCreated('signed');
        }
        catch(e) {
            console.log(e);
        }

    
        try {
            // ASSINATURA 3: Financiamento de Chainlink Functions
            const juelsAmount = String(ethers.utils.parseEther(String(functionsFund))); // LINK --> Juels (Ether --> wei)
            await manager.fundSubscription({
                subscriptionId,
                juelsAmount
            });

            // SEND WEBSOCKET NOTIFICATION TO CHANGE
            // statesSetters.setSubscriptionFunded('signed');
        }
        catch(e) {
            console.log(e);
        }

        try {
            // ASSINATURA 4: Adicionar o Contrato de Seguro Agrícola a inscrição.
            await manager.addConsumer({
                subscriptionId,
                consumerAddress: insuranceContractAddress
            });

            // SEND WEBSOCKET NOTIFICATION TO CHANGE
            // statesSetters.setConsumerAdded('signed');
        }
        catch(e) {
            console.log(e);
        }

        try {
            // ASSINATURA 5: Armazenar no Contrato de Seguro Agrícola o ID da inscrição.
            const txSetSubId = await insuranceContract.setSubscriptionId(subscriptionId);
            await txSetSubId.wait();
            const id = await insuranceContract.subscriptionId();
            console.log(`subid: ${id}`);

            // SEND WEBSOCKET NOTIFICATION TO CHANGE
            // statesSetters.setSubscriptionIdSetted('signed');
        }
        catch(e) {
            console.log(e);
        }

        // ASSINATURA 6: Adicionando ComputationJS como CBOR para o contrato de seguro
        try {   
            const requestCBOR = await buildRequestParameters(signer, config, donParams);
            const txSetRequestCBOR = await insuranceContract.setCBOR(requestCBOR);
            await txSetRequestCBOR.wait();
            const cbor = await insuranceContract.requestCBOR();
            console.log(`cbor: ${cbor}`);

            // SEND WEBSOCKET NOTIFICATION TO CHANGE
            // statesSetters.setCborSetted('signed');
        }
        catch(e) {
            console.log(e);
        }
        // *****************************

        console.log('** 2 OK **');
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

function getUpkeepParams(admin, insuranceContractAddress, juels) {
    const upkeepParams = {
        name:           'automation-functions-consumer',
        encryptedEmail: ethers.utils.hexlify([]),
        upkeepContract: insuranceContractAddress,
        gasLimit:       1000000,
        adminAddress:   admin,
        triggerType:    0,
        checkData:      ethers.utils.hexlify([]),
        triggerConfig:  ethers.utils.hexlify([]),
        offchainConfig: ethers.utils.hexlify([]),
        amount:         juels
    };

    return upkeepParams;
}

async function handleChainlinkAutomation(
    signer, 
    automationFund,
    insuranceContract, 
    insuranceContractAddress
) {
    try {
        console.log('entrei')
        const admin = await signer.getAddress();
        console.log(admin);
        const juelsAmount = ethers.utils.parseEther(String(automationFund)); // LINK --> Juels (Ether --> wei)
        const upkeepParams = getUpkeepParams(admin, insuranceContractAddress, juelsAmount)
        const LINK = mountLINK(signer);
    
        // ASSINATURA 7: Adicionado LINK ao contrato para financiar Chainlink Automation
        const transferLINKTx = await LINK.transfer(insuranceContractAddress, juelsAmount);
        await transferLINKTx.wait();
    
        // SEND WEBSOCKET NOTIFICATION TO CHANGE
        // statesSetters.setAutomationFunded('signed'); 
    
        // ASSINATURA 8: Criação do contrato Upkeep na Blockchain
        const createUpkeepTx = await insuranceContract.createUpkeep(juelsAmount);
        await createUpkeepTx.wait();
    
        // SEND WEBSOCKET NOTIFICATION TO CHANGE
        // statesSetters.setUpkeepCreation('signed');
    
        // ASSINATURA 9: 
        const registerUpkeepTx = await insuranceContract.registerUpkeep(upkeepParams);
        await registerUpkeepTx.wait();
    
        // SEND WEBSOCKET NOTIFICATION TO CHANGE
        // statesSetters.setUpkeepRegistration('signed');

        console.log('ok')
        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

export default { handleChainlinkFunctions, handleChainlinkAutomation }