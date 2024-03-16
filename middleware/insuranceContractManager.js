async function addInsuranceToSub(manager, subscriptionId, insuranceContractAddr){
    const receipt = await manager.addConsumer({
        subscriptionId,
        consumerAddress: insuranceContractAddr,
    });
    console.log(`Insurance Contact ${insuranceContractAddr} added to subscription ${subscriptionId} successfully`);

    return receipt;
}

async function createUpkeep(insuranceContract, upkeepFundAmount) {
    const tx = await insuranceContract.createUpkeep(upkeepFundAmount);
    console.log(`Upkeep Contract creation: waiting 1 block for transaction ${tx.hash} to be confirmed...`);
    const receipt = await tx.wait(1);

    return receipt;
}

export default { addInsuranceToSub, createUpkeep }