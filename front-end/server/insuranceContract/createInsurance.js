import { ethers } from 'ethers';
import blockchain from "../blockchain.js";

async function createInsurance(institution, params) {
    try {
        console.log(params);
        // ASSINATURA 1: Criação de um novo Contrato na blockchain
        const tx = await institution.createInsuranceContract(
            String(params.deployer),
            String(params.farmer),
            String(params.farmName),
            parseInt(params.humidityLimit, 10),
            parseInt(params.sampleMaxSize, 10),
            ethers.utils.parseEther(String(params.reparationValue)),
            parseInt(params.intervalNumber, 10), // ** TODO ** Tratar esse parâmetro para outros casos
            blockchain.sepolia.chainlinkRouterAddress,
            blockchain.sepolia.chainlinkRegistryAddress,
            blockchain.sepolia.chainlinkLinkTokenAddress,
            blockchain.sepolia.chainlinkRegistrarAddress,
            parseInt(params.gasLimit, 10),
            ethers.utils.formatBytes32String(params.donId),
            String(params.metricJS)
        )
        const insuranceReceipt = await tx.wait();
        const insuranceContractAddress = insuranceReceipt.events[0].args[0];

        return {
            status: true,
            insuranceContractAddress
        }
    }
    catch(e) {
        return {
            status: false ,
            insuranceContractAddress: e.toString()
        }
    }

}

export default createInsurance;