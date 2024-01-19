import * as ethers from 'ethers'
import insuranceArtifacts from '../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' }

async function getInsuranceContract(insuranceContractAddr, signer){
    // Stored in institution
    const insuranceContract = new ethers.Contract(
        insuranceContractAddr,
        insuranceArtifacts.abi, 
        signer
    )

    return insuranceContract
}

// TODO: Fix this function
async function addInsuranceToSub(subid, insuranceContractAddr){
    await addClientConsumerToSubscription(subid, insuranceContractAddr)
    console.log(`Contrato de seguro ${insuranceContractAddr} adicionado a subscrição ${subid} com sucesso.`)
}

export { getInsuranceContract, addInsuranceToSub }