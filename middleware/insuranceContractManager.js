import * as ethers from 'ethers'

// TODO: Fix this function
async function addInsuranceToSub(subid, insuranceContractAddr){
    await addClientConsumerToSubscription(subid, insuranceContractAddr)
    console.log(`Contrato de seguro ${insuranceContractAddr} adicionado a subscrição ${subid} com sucesso.`)
}

export { addInsuranceToSub }