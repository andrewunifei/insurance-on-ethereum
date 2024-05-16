import createManager from '@/utils/Chainlink/functionsManager'
import sepolia from '@/utils/blockchain'
import { metricJS } from '../rules/metric';
import { ethers } from 'ethers';
import mountinsuranceContract from '../InsuranceContract.sol/mountInsuranceContract';
import mountLINK from '../Chainlink/mountLINK';
import buildRequestParameters from '../InsuranceContract.sol/controller';
import donParams from '../Chainlink/donParams';

async function handleChainlinkFunctions(signer, functionsFund, insuranceContractAddress, config) {
    try {
        // Objeto para interação com Chainlink Functions
        const manager = await createManager(
            signer, 
            sepolia.chainlinkLinkTokenAddress,
            sepolia.chainlinkRouterAddress
        );

        // ASSINATURA 2: Inscrição em Chainlink Functions
        const subscriptionId = await manager.createSubscription();
    
        // ASSINATURA 3: Financiamento de Chainlink Functions
        const juelsAmount = String(ethers.utils.parseEther(String(functionsFund))); // LINK --> Juels (Ether --> wei)
        await manager.fundSubscription({
            subscriptionId,
            juelsAmount
        });
        
        // ASSINATURA 4: Adicionar o Contrato de Seguro Agrícola a inscrição.
        await manager.addConsumer({
            subscriptionId,
            consumerAddress: insuranceContractAddress
        });

        // ASSINATURA 5: Armazenar no Contrato de Seguro Agrícola o ID da inscrição.
        const insuranceContract = mountinsuranceContract(signer, insuranceContractAddress);
        const txSetSubId = await insuranceContract.setSubscriptionId(subscriptionId);
        await txSetSubId.wait();

        // USE PROXY HOSPEDADO NO HEROKU 
        // // Adicionando ComputationJS como CBOR para o contrato de seguro
        // const payload = await buildRequestParameters(
        //     signer, 
        //     config,
        //     donParams
        // )
        // const txSetRequestCBOR = await insuranceContract.setCBOR(payload.requestCBOR);
        // await txSetRequestCBOR.wait();
        // *****************************

        return true;
    }
    catch(e) {
        console.log(e);
        return false;
    }
}

async function handleChainlinkAutomation(signer, automationFund, insuranceContractAddress) {
     // Adicionado LINK ao contrato para financiar Chainlink Functions
    const LINK = mountLINK(signer);
    const juelsAmount = String(ethers.utils.parseEther(String(automationFund))); // LINK --> Juels (Ether --> wei)
    const tx = await LINK.transfer(insuranceContractAddress, juelsAmount);
    await tx.wait();
}

export default async function handleInsuranceForm(signer, institution, params, statesSetters) {
    const donId = 'fun-ethereum-sepolia-1';
    const deployer = await signer.getAddress();
    const config = {
        args: [String(params.latitude), String(params.longitude)],
    };

    statesSetters.setContractCreated('pending');
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
    const insuranceReceipt = await tx.wait();
    if(insuranceReceipt) {
        statesSetters.setContractCreated('signed');
    }
    const insuranceContractAddress = insuranceReceipt.events[0].args[0]
    const chainlinkFunctionsStatus = await handleChainlinkFunctions(signer, params.functionsFund, insuranceContractAddress, config, statesSetters);
    const chainlinkAutomationStatus = await handleChainlinkAutomation(signer, params.automationFund, insuranceContractAddress, statesSetters);
}