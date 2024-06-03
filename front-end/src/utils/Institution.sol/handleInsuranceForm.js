import { metricJS } from '../rules/metric';
import { ethers } from 'ethers';
import mountDonParams from './donParams';
import mountLINK from './mountLINK';

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
    const blockManipulator = '0xB9D7Ed889752550140507faB5796654CbC7428b7'

    const config = {
        args: [String(params.latitude), String(params.longitude)],
    };

    setSignaturesStates(statesSetters, 'pending');

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

    let intervalNumber;
    if(params.intervalScale === 'minutes'){
        intervalNumber = Number(params.intervalNumber) * 60;
    }
    else if(params.intervalScal === 'hours') {
        intervalNumber = Number(params.intervalNumber) * 3600;
    }
    else {
        intervalNumber = Number(params.intervalNumber) * 86400;
    }

    console.log(intervalNumber)

    // const donParams = mountDonParams((Number(params.intervalNumber) * Number(params.sampleMaxSize)) + 1);
    const donParams = mountDonParams(60);
    console.log(donParams.minutesUntilExpiration);

    const options = {
        method: 'POST',
        body: JSON.stringify({
            insuranceParams: {
                deployer: institutionAddress,
                farmer: String(params.farmer),
                farmName: String(params.farmName),
                humidityLimit: Number(params.humidityLimit),
                sampleMaxSize: Number(params.sampleMaxSize),
                reparationValue: params.reparationValue,
                intervalNumber, // ** TODO ** Tratar esse parâmetro para outros casos
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

    setSignaturesStates(statesSetters, 'inactive');
}