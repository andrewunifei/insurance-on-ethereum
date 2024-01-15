const ethers = require("ethers")
const insuranceArtifacts = require("../build/artifacts/contracts/InsuranceAPI.sol/InsuranceAPI.json")

// const { addClientConsumerToSubscription } = require("../tasks/Functions-billing/add")

async function getInsuranceContract(institution, id, deployer){
    // Stored in institution
    const insuranceContractAddr = await institution.getInsurance(id);
    const insuranceFactory = new ethers.ContractFactory(
        insuranceArtifacts.abi,
        insuranceArtifacts.bytecode,
        deployer
    )
    const insuranceContract = await insuranceFactory.attach(insuranceContractAddr);
    console.log(`Endereço do seguro: ${insuranceContract.address}`)

    return insuranceContract
}

// TODO: Fix this function
async function addInsuranceToSub(subid, insuranceContractAddr){
    await addClientConsumerToSubscription(subid, insuranceContractAddr)
    console.log(`Contrato de seguro ${insuranceContractAddr} adicionado a subscrição ${subid} com sucesso.`)
}


module.exports = {
    getInsuranceContract,
    addInsuranceToSub
}