const ethers = require("ethers")
const insuranceArtifacts = require("../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json")
const abi = insuranceArtifacts.abi
const bytecode = insuranceArtifacts.bytecode

async function getInsuranceContract(insuranceContractAddr, deployer){
    // Stored in institution
    const insuranceFactory = new ethers.ContractFactory(abi, bytecode, deployer)
    const insuranceContract = insuranceFactory.attach(insuranceContractAddr);
    console.log(`Endereço do seguro: ${insuranceContract.address}`)

    return insuranceContract
}

// TODO: Fix this function
async function addInsuranceToSub(manager, subid, insuranceContractAddr){
    await addClientConsumerToSubscription(subid, insuranceContractAddr)
    console.log(`Contrato de seguro ${insuranceContractAddr} adicionado a subscrição ${subid} com sucesso.`)
}


module.exports = {
    getInsuranceContract,
    addInsuranceToSub
}