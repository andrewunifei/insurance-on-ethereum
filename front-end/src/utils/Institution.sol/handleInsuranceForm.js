// import createManager from '@/utils/Chainlink/functionsManager'
// import sepolia from '@/utils/Chainlink/blockchain'
// import metricJS from '../Rules/metric';
// import { ethers } from 'ethers'

// async function handleChainlinkFunctions(signer, functionsFund, insuranceContractAddress) {
//         // Inscrição no Chainlink Functions
//         const manager = await createManager(
//             signer, 
//             sepolia.chainlinkLinkTokenAddress,
//             sepolia.chainlinkRouterAddress
//         );
//         const subscriptionId = await manager.createSubscription();
    
//         // Financiamento de Chainlink Functions
//         const juelsAmount = String(ethers.utils.parseEther(String(functionsFund))); // LINK --> Juels (Ether --> wei)
//         const fundingReceipt = await manager.fundSubscription({
//             subscriptionId,
//             juelsAmount
//         });
        
//         // Adicionando o Contrato de Seguro a inscrição
//         const addReceipt = await manager.addConsumer({
//             subscriptionId,
//             insuranceContractAddress
//         })
// }

// export default async function handleInsuranceForm(signer, institution, params) {
//     const donId = 'fun-ethereum-sepolia-1';

//     const tx = await institution.createInsuranceContract(
//         String(signer.address),
//         String(params.farmer),
//         Number(params.humidityLimit),
//         Number(params.sampleMaxSize),
//         ethers.utils.parseEther(String(params.reparationValue)),
//         Number(params.intervalNumber) * 60, // ** TODO ** Tratar esse parâmetro para outros casos
//         sepolia.chainlinkRouterAddress,
//         sepolia.chainlinkRegistryAddress,
//         sepolia.chainlinkLinkTokenAddress,
//         sepolia.chainlinkRegistrarAddress,
//         1000000,
//         ethers.utils.formatBytes32String(donId),
//         metricJS
//     )
//     const insuranceReceipt = await tx.wait();

//     const subscriptionReceipt = await handleChainlinkFunctions(signer, values.functionsFund, insuranceContractAddress);
// }