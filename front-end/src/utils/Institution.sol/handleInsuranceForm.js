import createManager from '@/utils/Chainlink/functionsManager'
import sepolia from '@/utils/blockchain'
import { metricJS } from '../rules/metric';
import { ethers } from 'ethers';
import mountinsuranceContract from '../InsuranceContract.sol/mountInsuranceContract';
import buildRequestParameters from '../InsuranceContract.sol/controller';
import donParams from '../Chainlink/donParams';

async function handleChainlinkFunctions(signer, functionsFund, insuranceContractAddress, config) {
        // Inscrição no Chainlink Functions
        const manager = await createManager(
            signer, 
            sepolia.chainlinkLinkTokenAddress,
            sepolia.chainlinkRouterAddress
        );
        const subscriptionId = await manager.createSubscription();
    
        // Financiamento de Chainlink Functions
        const juelsAmount = String(ethers.utils.parseEther(String(functionsFund))); // LINK --> Juels (Ether --> wei)
        await manager.fundSubscription({
            subscriptionId,
            juelsAmount
        });
        
        // Adicionando o Contrato de Seguro a inscrição
        await manager.addConsumer({
            subscriptionId,
            consumerAddress: insuranceContractAddress
        });

        // Altearndo a variável referente ao ID da inscrição Chainlink Functions
        const insuranceContract = mountinsuranceContract(signer, insuranceContractAddress);
        const txSetSubId = await insuranceContract.setSubscriptionId(subscriptionId);
        await txSetSubId.wait();

        // Adicionando ComputationJS como CBOR para o contrato de seguro
        const payload = await buildRequestParameters(
            signer, 
            config,
            donParams
        )
        const txSetRequestCBOR = await insuranceContract.setCBOR(payload.requestCBOR);
        await txSetRequestCBOR.wait();

        return addedReceipt;
}

export default async function handleInsuranceForm(signer, institution, params) {
    const donId = 'fun-ethereum-sepolia-1';
    const deployer = await signer.getAddress();
    const config = {
        args: [String(params.latitude), String(params.longitude)],
    };

    const tx = await institution.createInsuranceContract(
        String(deployer),
        String(params.farmer),
        Number(params.humidityLimit),
        Number(params.sampleMaxSize),
        ethers.utils.parseEther(String(params.reparationValue)),
        Number(params.intervalNumber) * 60, // ** TODO ** Tratar esse parâmetro para outros casos
        sepolia.chainlinkRouterAddress,
        sepolia.chainlinkRegistryAddress,
        sepolia.chainlinkLinkTokenAddress,
        sepolia.chainlinkRegistrarAddress,
        1000000,
        ethers.utils.formatBytes32String(donId),
        metricJS
    )
    const insuranceReceipt = await tx.wait();
    const insuranceContractAddress = insuranceReceipt.events[0].args[0]
    const addedReceipt = await handleChainlinkFunctions(signer, params.functionsFund, insuranceContractAddress, config);
    console.log(addedReceipt)
}