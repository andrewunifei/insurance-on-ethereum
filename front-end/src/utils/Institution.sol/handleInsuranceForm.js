import createManager from '@/utils/Chainlink/functionsManager'
import sepolia from '@/utils/blockchain'
import { metricJS } from '../rules/metric';
import { ethers } from 'ethers';
import mountinsuranceContract from '../InsuranceContract.sol/mountInsuranceContract';
import mountLINK from '../Chainlink/mountLINK';
import buildRequestParameters from '../InsuranceContract.sol/controller';
import donParams from '../Chainlink/donParams';
import getUpkeepParams from '../Chainlink/getUpkeepParams';

async function handleChainlinkFunctions(
    signer, 
    functionsFund, 
    insuranceContract,
    insuranceContractAddress, 
    config, 
    statesSetters
) {
    try {
        let subscriptionId;

        // Objeto para interação com Chainlink Functions
        const manager = await createManager(
            signer, 
            sepolia.chainlinkLinkTokenAddress,
            sepolia.chainlinkRouterAddress
        );

        try {
            // ASSINATURA 2: Inscrição em Chainlink Functions
            subscriptionId = await manager.createSubscription();
            statesSetters.setSubscriptionCreated('signed');
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
            statesSetters.setSubscriptionFunded('signed');
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
            statesSetters.setConsumerAdded('signed');
        }
        catch(e) {
            console.log(e);
        }

        try {
            // ASSINATURA 5: Armazenar no Contrato de Seguro Agrícola o ID da inscrição.
            const txSetSubId = await insuranceContract.setSubscriptionId(subscriptionId);
            await txSetSubId.wait();
            statesSetters.setSubscriptionIdSetted('signed');
        }
        catch(e) {
            console.log(e);
        }


        // USE PROXY HOSPEDADO NO HEROKU 
        // ASSINATURA 6: Adicionando ComputationJS como CBOR para o contrato de seguro
        try {   
            const payload = await buildRequestParameters(
                signer, 
                config,
                donParams
            )
            const txSetRequestCBOR = await insuranceContract.setCBOR(payload.requestCBOR);
            await txSetRequestCBOR.wait();
            statesSetters.setCborSetted('signed');
        }
        catch(e) {
            console.log(e);
        }
        // *****************************

        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

async function handleChainlinkAutomation(
    signer, 
    automationFund,
    insuranceContract, 
    insuranceContractAddress, 
    statesSetters
) {
    const juelsAmount = String(ethers.utils.parseEther(String(automationFund))); // LINK --> Juels (Ether --> wei)
    const notStringJuelsAmount = ethers.utils.parseEther(String(automationFund)); // LINK --> Juels (Ether --> wei)
    const upkeepParams = getUpkeepParams(signer, insuranceContractAddress, juelsAmount)
    const LINK = mountLINK(signer);

    // ASSINATURA 7: Adicionado LINK ao contrato para financiar Chainlink Automation
    const transferLINKTx = await LINK.transfer(insuranceContractAddress, juelsAmount);
    await transferLINKTx.wait();
    statesSetters.setAutomationFunded('signed'); 

    // ASSINATURA 8: Criação do contrato Upkeep na Blockchain
    const createUpkeepTx = await insuranceContract.createUpkeep(notStringJuelsAmount);
    await createUpkeepTx.wait();
    statesSetters.setUpkeepCreation('signed');

    // ASSINATURA 9: 
    const registerUpkeepTx = await insuranceContract.registerUpkeep(upkeepParams);
    await registerUpkeepTx.wait();
    statesSetters.setUpkeepRegistration('signed');
}

function setSignaturesStates(statesSetters, state) {
    statesSetters.setContractCreated(state);
    statesSetters.setSubscriptionCreated(state);
    statesSetters.setSubscriptionFunded(state);
    statesSetters.setConsumerAdded(state);
    statesSetters.setSubscriptionIdSetted(state);
    statesSetters.setCborSetted(state);
    statesSetters.setAutomationFunded(state);
    statesSetters.setUpkeepCreation(state);
    statesSetters.setUpkeepRegistration(state);
}

export default async function handleInsuranceForm(signer, institution, params, statesSetters) {
    let insuranceReceipt;
    const donId = 'fun-ethereum-sepolia-1';
    const deployer = await signer.getAddress();
    const config = {
        args: [String(params.latitude), String(params.longitude)],
    };

    setSignaturesStates(statesSetters, 'pending');

    try {
        // ASSINATURA 1: Criação de um novo Contrato na blockchain
        const tx = await institution.createInsuranceContract(
            String(deployer),
            String(params.farmer),
            String(params.farmName),
            Number(params.humidityLimit),
            Number(params.sampleMaxSize),
            ethers.utils.parseEther(String(params.reparationValue)),
            Number(params.intervalNumber) * 60, // ** TODO ** Tratar esse parâmetro para outros casos
            sepolia.chainlinkRouterAddress,
            sepolia.chainlinkRegistryAddress,
            sepolia.chainlinkLinkTokenAddress,
            sepolia.chainlinkRegistrarAddress,
            1000000,
            ethers.utils.formatBytes32String(donId),
            metricJS
        )
        insuranceReceipt = await tx.wait();
        statesSetters.setContractCreated('signed');
    }
    catch(e) {
        console.log(e);
    }

    const insuranceContractAddress = insuranceReceipt.events[0].args[0];
    const insuranceContract = mountinsuranceContract(signer, insuranceContractAddress);

    const chainlinkFunctionsStatus = await handleChainlinkFunctions(
        signer,
        params.functionsFund, 
        insuranceContract, 
        insuranceContractAddress, 
        config, 
        statesSetters
    );
    const chainlinkAutomationStatus = await handleChainlinkAutomation(
        signer, 
        params.automationFund, 
        insuranceContract, 
        insuranceContractAddress, 
        statesSetters
    );

    setSignaturesStates(statesSetters, 'inactive');
}