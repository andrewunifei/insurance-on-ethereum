import blockchain from '../blockchain.js'
import mountInsuranceContract from '../mounts/mountInsuranceContract.js';
import mountInstitution from "../mounts/mountInstitution.js";
import chainlinkServices from './chainlinkServices.js';
import createInsurance from './createInsurance.js';

async function handleInsurance(body) {
    const interactionPayload = await blockchain.interaction(
        process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
        process.env.ETHEREUM_SEPOLIA_RPC_URL
    );
    const signer = interactionPayload.signer;
    const institution = mountInstitution(signer, body.institutionAddress);
    const {status, insuranceContractAddress } = await createInsurance(institution, body.insuranceParams);

    if(status) {
        console.log(insuranceContractAddress);
        const insuranceContract = mountInsuranceContract(signer, insuranceContractAddress);
    
        const statusChainlinkFunctions = await chainlinkServices.handleChainlinkFunctions(
            signer, 
            body.functionsFund,
            insuranceContract,
            insuranceContractAddress,
            body.config,
            body.donParams
        );
        const statusChainlinkAutomation = await chainlinkServices.handleChainlinkAutomation(
            signer,
            body.automationFund,
            insuranceContract,
            insuranceContractAddress
        )
    
        if(statusChainlinkFunctions && statusChainlinkAutomation) {
            return {status: true, contractAddress: insuranceContractAddress};
        }
        else {
            return false;
        }
    }
    else {
        console.log(insuranceContractAddress);
        return false;
    }

}

export default handleInsurance;