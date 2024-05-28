import sepolia from '@/utils/blockchain'
import { metricJS } from '../rules/metric';
import { ethers } from 'ethers';
import mountDonParams from './donParams';
import mountLINK from './mountLINK';
import mountInsuranceContract from '../InsuranceContract.sol/mountInsuranceContract';
import buildRequestParameters from '../InsuranceContract.sol/controller';

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

export default async function handleInsuranceForm(signer, institutionAddress, params, statesSetters) {
    console.log('testing')
    let insuranceReceipt;
    const deployer = await signer.getAddress();
    const blockManipulator = '0xB9D7Ed889752550140507faB5796654CbC7428b7'

    const config = {
        args: [String(params.latitude), String(params.longitude)],
    };
    const donParams = mountDonParams(Number(params.intervalNumber) * 60 * 2);

    setSignaturesStates(statesSetters, 'pending');

    // try {
    //     // ASSINATURA 1: Criação de um novo Contrato na blockchain
    //     const tx = await institution.createInsuranceContract(
    //         String(deployer),
    //         String(params.farmer),
    //         String(params.farmName),
    //         Number(params.humidityLimit),
    //         Number(params.sampleMaxSize),
    //         ethers.utils.parseEther(String(params.reparationValue)),
    //         Number(params.intervalNumber) * 60, // ** TODO ** Tratar esse parâmetro para outros casos
    //         sepolia.chainlinkRouterAddress,
    //         sepolia.chainlinkRegistryAddress,
    //         sepolia.chainlinkLinkTokenAddress,
    //         sepolia.chainlinkRegistrarAddress,
    //         1000000,
    //         ethers.utils.formatBytes32String(donParams.donId),
    //         metricJS
    //     )
    //     insuranceReceipt = await tx.wait();
    //     statesSetters.setContractCreated('signed');
    // }
    // catch(e) {
    //     console.log(e);
    // }

    // const insuranceContractAddress = insuranceReceipt.events[0].args[0];

    // const LINK = mountLINK(signer);

    // const transferFunctionsFund = await LINK.transfer(
    //     blockManipulator,
    //     ethers.utils.parseEther(String(params.functionsFund))
    // );
    // await transferFunctionsFund.wait();
    // statesSetters.setSubscriptionFunded('signed');

    // const transferAutomationFund = await LINK.transfer(
    //     blockManipulator,
    //     ethers.utils.parseEther(String(params.automationFund))
    // );
    // await transferAutomationFund.wait();
    // statesSetters.setAutomationFunded('signed');

    const options = {
        method: 'POST',
        body: JSON.stringify({
            insuranceParams: {
                deployer: String(deployer),
                farmer: String(params.farmer),
                farmName: String(params.farmName),
                humidityLimit: Number(params.humidityLimit),
                sampleMaxSize: Number(params.sampleMaxSize),
                reparationValue: params.reparationValue,
                intervalNumber: Number(params.intervalNumber) * 60, // ** TODO ** Tratar esse parâmetro para outros casos
                gasLimit: 300000,
                donId: donParams.donId,
                metricJS
            },
            institutionAddress,
            functionsFund: params.functionsFund,
            automationFund: params.automationFund,
            config: config,
            donParams: donParams

        }),
        headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
    }
    const response = await fetch('http://localhost:8080/insurance', options);
    const parsed = await response.json();
    console.log(parsed);
    statesSetters.setContractCreated('signed');

    // const chainlinkFunctionsStatus = await handleChainlinkFunctions(
    //     signer,
    //     params.functionsFund, 
    //     insuranceContract, 
    //     insuranceContractAddress, 
    //     config, 
    //     statesSetters
    // );
    // const chainlinkAutomationStatus = await handleChainlinkAutomation(
    //     signer, 
    //     params.automationFund, 
    //     insuranceContract, 
    //     insuranceContractAddress, 
    //     statesSetters
    // );

    setSignaturesStates(statesSetters, 'inactive');
}