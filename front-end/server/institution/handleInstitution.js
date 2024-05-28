import mountApi from '../mounts/mountAPI.js';
import blockchain from '../blockchain.js';

async function handleInstitution(payload) {
    try {
        const institutionInfo = payload.institutionInfo;

        const interactionPayload = await blockchain.interaction(
            process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
            process.env.ETHEREUM_SEPOLIA_RPC_URL
        );
        const signer = interactionPayload.signer;
    
        const api = mountApi(signer);
        const tx = await api.createInstitution(institutionInfo);
        const receipt = await tx.wait(1);
        const institutionAddress = receipt.events[0].args[0];

        console.log(institutionAddress);
    
        return {
            status: true,
            payload: institutionAddress
        };
    }
    catch(e) {
        console.log(e);

        return {
            status: false,
            payload: e.toString()
        }
    }

}

export default handleInstitution;