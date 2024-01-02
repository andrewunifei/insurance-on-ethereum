const { ethers } = require("Hardhat")
const { addClientConsumerToSubscription } = require("../tasks/Functions-billing/add")

async function getInsuranceContract(institution, id){
    // Stored in institution
    const insuranceContractAddr = await institution.getInsurance(id);
    const insuranceContract = await ethers.getContractAt("AutomatedFunctionsConsumer", insuranceContractAddr);
    console.log(`Endereço do seguro: ${insuranceContract.address}`)

    return insuranceContract
}

async function addInsuranceToSub(subid, insuranceContractAddr){
    await addClientConsumerToSubscription(subid, insuranceContractAddr)
    console.log(`Contrato de seguro ${insuranceContractAddr} adicionado a subscrição ${subid} com sucesso.`)
}


module.exports = {
    getInsuranceContract,
    addInsuranceToSub
}