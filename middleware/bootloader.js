const { ethers } = require("hardhat")
const { networks } = require("../networks")
// const { setAutoRequest } = require("../tasks/Functions-client/setAutoRequest")
const APIDeployment = require("./APIDeployment")
// const institutionAPI = require("./institution")
const insuranceContractAPI = require("./insuranceContract")
const upkeepAPI = require("./upkeep")

const farmerAddress = '0x1bE776c435Fb6243E3D8b22744f6e58f62A8B41E'
const sepoliaLINKAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'
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

async function createInsuranceContract(API, index, args){ // <--- Passar o parâmetro "args" para essa função
    let subid

    const institutionAddress = await API.getInstitution(index)
    const institution = await ethers.getContractAt("Institution", institutionAddress)

    console.log(`Endereço da instituição: ${institution.address}`)

    receipt = await institution.createInsuranceContract(
        args.deployer,
        args.farmer,
        args.humidityLimit,
        args.lat, // Passar pela lista args do Código Fonte da Requisição
        args.lon, // Passar pela lista args do Código Fonte da Requisição
        args.oracle,
        args.subid,
        args.gaslimit,
        args.interval,
        args.sampleMaxSize,
        args.reparationValue,
        args.registryAddress,
        args.sepoliaLINKAddress,
        args.sepoliaRegistrarAddress
    )
    await receipt.wait(1)
}

async function createInstitution(API) {
    infos = {
        name: 'Nome da Instituicao'
        // ... Pesquisar na literatura o que são informações relevantes para identificar uma instituição
    }

    const tx = await API.createInstitution(
        infos.name
    )

    console.log(`\nWaiting 1 block for transaction ${tx.hash} to be confirmed...`)
    receipt = await tx.wait(1)
    // receipt.logs --> Log do evento emitido pela API ao criar a instituição

    return receipt
}

async function getInstitution(API, index) {
    // ** TODO: Implementar uma busca da instituição de forma mais inteligente **
    // A instituição dentro do mapeamento na API deve ser buscada de uma maneira mais inteligente
    // Isto é, com index não está bom o suficiente
    const institutionAddress = await API.getInstitution(index)
    const institutionFactory = await ethers.getContractFactory("Institution")
    const institutionContract = await institutionFactory.attach(institutionAddress)

    return institutionContract
}

async function deployAPI() {
    const [ deployer ] = await ethers.getSigners()
    const API = await APIDeployment.createAPI(deployer)

    return API
}

async function getDeployedAPI(APIAddress) {
    const API = await APIDeployment.getAPI(APIAddress)
    
    return API
}

// ** TODO: Implementar a lógica de functions-sub-create em outro arquivo **
//
// async function subscribeInstitutionToFunctions(API, index){
//     const institutionAddress = await API.getInstitution(index)

//     subid = await run("functions-sub-create", {amount: String(1), contract: institutionAddress})
//     console.log(`ID da subscrição: ${subid}`)
// }

(async () => {
    if (require.main === module) {
        // flag = 1 --> Deploy
        // flag = 0 --> Attach
        APIflag = 0
        APIAddress = '0x8092e926a018bFabf87210906e26E051938f3DFf'
        institutionFlag = 0
        institutionIndex = 0
        
        try {
            if(APIflag) {
                API = await deployAPI()
            }
            else {
                API = await getDeployedAPI(APIAddress)
            }
        }
        catch(e) {
            throw new Error(e)
        }

        try {
            if(institutionFlag) {
                institution = await createInstitution(API)
            }
            else {
                institution = await getInstitution(API, institutionIndex)
            }
        }
        catch(e) {
            throw new Error(e)
        }
    }
})()


// Last institution deployed: 0x4a7c34fC0154192F88dd42275eF21b04f528A4F4

// Upkeep address atual no Sepolia: 0xD1D9a8E041e3A83dd8E2E7C3740D8EbfBA1027ec
// Insurance Contract para ser automatizado: 0x120993E01C33a1621AaF9ae79A7925Eb75492227
// Upkeep address com LINK: 0x0CbA96BB715DE4D0152EA69258F198433C4Eeefc
// insuranceAPI address: 0xDB7293E35E14FeaE30A4BAb8b360c9d2Db4e6c02

