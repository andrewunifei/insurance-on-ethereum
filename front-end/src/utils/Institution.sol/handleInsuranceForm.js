import { metricJS } from '../rules/metric';
import { ethers } from 'ethers';
import mountDonParams from './donParams';
import mountLINK from './mountLINK';

export default async function handleInsuranceForm(signer, setContractSpin, openNotification, institutionAddress, params) {
    const blockManipulator = '0xB9D7Ed889752550140507faB5796654CbC7428b7'
    setContractSpin(true);

    const config = {
        args: [String(params.latitude), String(params.longitude)],
    };

    const LINK = mountLINK(signer);
    const totalLINK = Number(params.functionsFund) + Number(params.automationFund);
    const transferFunctionsFund = await LINK.transfer(
        blockManipulator,
        ethers.utils.parseEther(String(totalLINK))
    );
    await transferFunctionsFund.wait();

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

    // const donParams = mountDonParams((Number(params.intervalNumber) * Number(params.sampleMaxSize)) + 1);
    const donParams = mountDonParams(60);

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
                intervalNumber,
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
    setContractSpin(false);
    openNotification({
        message: 'Novo Contrato de Seguro Agrícola criado com sucesso!',
        description: `Endereço na blockchain: ${parsed.insuranceContractAddress}`
    });
}