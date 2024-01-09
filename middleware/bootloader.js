const { ethers } = require("hardhat")
const { networks } = require("../networks")
const APIDeployment = require("./APIDeployment")
const chainlinkFunctions = require("./ChainlinkFunctions")

const farmerAddress = '0x1bE776c435Fb6243E3D8b22744f6e58f62A8B41E'
const sepoliaRegistrarAddress = '0x9a811502d843E5a03913d5A2cfb646c11463467A'

// ** TODO: Implementar a lógica de setAutoRequest em controller.js **
//
// async function setAuto(subid, insuranceContractAddr, gaslimit, interval){
//     const subid = 741

//     params = {
//         simulate: false,
//         configpath: `${__dirname}/../Functions-request-config.js`,
//         contract: insuranceContractAddr,
//         subid,
//         gaslimit,
//         interval
//     }

//     await setAutoRequest(insuranceContractAddr, params)
// }

function setUpkeepParams(params){
    return {
        name: params.name,
        encryptedEmail: ethers.utils.hexlify([]),
        upkeepContract: params.contractToBeAutomated,
        gasLimit: params.gaslimit,
        adminAddress: params.deployerAddress,
        checkData: ethers.utils.hexlify([]),
        offchainConfig: ethers.utils.hexlify([]),
        amount: ethers.utils.parseEther(String(params.amount))
    }
}

function setInsuranceContractParms(params){
    return {
        deployer: params.deployerAddress,
        farmer: params.farmerAddress,
        humidityLimit: params.humidityLimit,
        lat: params.lat, //"44.34", // Passar pela lista args do Código Fonte da Requisição
        lon: params.lon,//"10.99", // Passar pela lista args do Código Fonte da Requisição
        //oracle: networks[network.name]["functionsOracleProxy"],
        oracle: networks["ethereumSepolia"]["functionsOracleProxy"],
        subid: params.subid,
        gaslimit: params.gatlimit,
        interval: params.interval,
        sampleMaxSize: params.sampleMaxSize,
        reparationValue: params.reparationValue,
        registryAddress: params.registryAddress
    }
}

/**
 * Cria um contrato de seguro a partir do contrato Institution
 * O endereço do contrato de seguro na rede Ethereum é armazenado na em uma lista na Institution
 * @param {BaseContract} institution 
 * @param {Object} args 
 * @returns 
 */
async function createInsuranceContract(institution, args){
    const tx = await institution.createInsuranceContract(
        // Relacionados com regras de negócio
        args.deployer,
        args.farmer,
        args.humidityLimit,
        // args.lat, // Passar pela lista args do Código Fonte da Requisição
        // args.lon, // Passar pela lista args do Código Fonte da Requisição
        args.sampleMaxSize,
        args.reparationValue,
        args.interval, // Também tem relação com Chainlink Automation

        // Relacionados com Chainlink Functions
        args.router, // sepoliaRouterAddress
        args.subscriptionId,

        // Relacionados com Chainlink Automation e Upkeep
        args.registryAddress,
        args.sepoliaLINKAddress,
        args.sepoliaRegistrarAddress,

        // Relacionado com a rede Ethereum 
        args.gaslimit
    )

    const receipt = tx.await(1)
    
    return receipt
}

/**
 * Cria uma instituição a partir do contrato InsuranceAPI
 * O endereço da instituição na rede Ethereum é armazenado em uma lista no InsuranceAPI
 * @param {BaseContract} API 
 * @param {Object} info Informações para identificar a instituição
 * @returns {Object}
 */
async function createInstitution(API, info) {
    const tx = await API.createInstitution(
        info.name
    )

    console.log(`\nWaiting 1 block for transaction ${tx.hash} to be confirmed...`)
    const receipt = await tx.wait(1)
    // receipt.logs --> Log do evento emitido pela API ao criar a instituição

    return receipt
}

async function getInstitution(API, index) {
    // ** TODO: Implementar uma busca da instituição de forma mais inteligente **
    // A instituição dentro do mapeamento na API deve ser buscada de uma maneira mais inteligente
    // Isto é, com index não está bom o suficiente
    const institutionAddress = await API.getInstitution(index)
    const institutionFactory = await ethers.getContractFactory("Institution")
    const institutionContract = institutionFactory.attach(institutionAddress)

    return institutionContract
}

(async () => {
    if (require.main === module) {
        const [ deployer ] = await ethers.getSigners()
        const sepoliaLinkTokenAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'
        const sepoliaRouterAddress = '0xb83E47C2bC239B3bf370bc41e1459A34b41238D0'

        // flag = 1 --> Deploy
        // flag = 0 --> Attach
        const APIflag = 0
        const APIAddress = '0x8092e926a018bFabf87210906e26E051938f3DFf' // Atual

        const institutionFlag = 0
        const institutionIndex = 0
        const managerFlag = 0
        const subscriptionFlag = 0
        const fundSubscriptionFlag = 0

        let info = {
            name: 'Nome da Instituicao'
            // ... Pesquisar na literatura informações relevantes para identificar uma instituição
        }
        let institution
        let subscriptionId
        let juelsAmount
        let manager
        
        try {
            if(APIflag) {
                API = await APIDeployment.createAPI(deployer)
            }
            else {
                API = await APIDeployment.getAPI(APIAddress)
            }

            if(institutionFlag) {
                receipt = await createInstitution(API, info)
                console.log(receipt)
            }
            else {
                institution = await getInstitution(API, institutionIndex)
            }

            if(managerFlag) {
                manager = await chainlinkFunctions.createManager(
                    deployer,
                    sepoliaLinkTokenAddress,
                    sepoliaRouterAddress
                )
            }

            if(subscriptionFlag) {
                subscriptionId = await manager.createSubscription(consumerAddress)
            }
 
            if(fundSubscriptionFlag) { 
                /*
                    Typescript --> const juelsAmount:  BigInt | string = BigInt(2) * BigInt(10**18)

                    Note that all values are denominated in Juels.
                    1,000,000,000,000,000,000 (1e18) Juels are equal to 1 LINK.
                    Do not use the JavaScript 'number' type for calculations with Juels
                    as the maximum safe JavaScript integer is only 2^54 - 1.
                */
                receipt = await manager.fundSubscription({
                    subscriptionId, 
                    juelsAmount
                })
            }
        }
        catch(e) {
            throw new Error(e)
        }
    }
})()

// Last institution deployed: 0x4a7c34fC0154192F88dd42275eF21b04f528A4F4

// --------------------------------------------------------------------------------------

// Upkeep address atual no Sepolia: 0xD1D9a8E041e3A83dd8E2E7C3740D8EbfBA1027ec
// Insurance Contract para ser automatizado: 0x120993E01C33a1621AaF9ae79A7925Eb75492227
// Upkeep address com LINK: 0x0CbA96BB715DE4D0152EA69258F198433C4Eeefc
// insuranceAPI address: 0xDB7293E35E14FeaE30A4BAb8b360c9d2Db4e6c02
