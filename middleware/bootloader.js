const ethers = require("ethers")
const { networks } = require("../networks")
const APIDeployment = require("./APIDeployment")
const chainlinkFunctions = require("./chainlinkFunctions")
const institutionArtifacts = require("../build/artifacts/contracts/Institution.sol/Institution.json")

const sepoliaRegistrarAddress = '0x9a811502d843E5a03913d5A2cfb646c11463467A'
const sepoliaRegistryAddress = '0x86EFBD0b6736Bed994962f9797049422A3A8E8Ad'
const sepoliaLinkTokenAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'
const sepoliaRouterAddress = '0xb83E47C2bC239B3bf370bc41e1459A34b41238D0'

// Caso tenha problmeas com sepoliaRouterAddress, antes nós tínhamos:
// oracle: networks["ethereumSepolia"]["functionsOracleProxy"],

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

/**
 * Cria um contrato de seguro a partir do contrato Institution
 * O endereço do contrato de seguro na rede Ethereum é armazenado na em uma lista na Institution
 * @param {BaseContract} institution 
 * @param {Object} args 
 * @returns {Object}
 */
async function createInsuranceContract(institution, args){

    // // Relacionados com regras de negócio
    // args.deployer,
    // args.farmer,
    // args.humidityLimit,
    // // args.lat, // Passar pela lista args do Código Fonte da Requisição
    // // args.lon, // Passar pela lista args do Código Fonte da Requisição
    // args.sampleMaxSize,
    // args.reparationValue,
    // args.interval, // Também tem relação com Chainlink Automation

    // // Relacionados com Chainlink Functions
    // args.router, // sepoliaRouterAddress
    // args.subscriptionId,

    // // Relacionados com Chainlink Automation e Upkeep
    // args.registryAddress,
    // args.LinkTokenAddress,
    // args.RegistrarAddress,

    // // Relacionado com a rede Ethereum 
    // args.gaslimit

    console.log(args)

    /*
    'createInsuranceContract(
        address,
        address,
        uint256,
        uint256,
        uint256,
        uint256,
        address,
        uint64,
        address,
        address,
        address,
        uint32
    )': [Function (anonymous)],
    */

    const tx = await institution.createInsuranceContract(
        args.deployer,
        args.farmer,
        args.humidityLimit,
        args.sampleMaxSize,
        args.reparationValue,
        args.interval,
        args.router,
        args.subscriptionId,
        args.registryAddress,
        args.LinkTokenAddress,
        args.RegistrarAddress,
        args.gaslimit
    )

    console.log('out')

    return tx
}

/**
 * Cria uma instituição a partir do contrato InsuranceAPI
 * O endereço da instituição na rede Ethereum é armazenado em uma lista no InsuranceAPI
 * @param {BaseContract} API 
 * @param {Object} info Informações para identificar a instituição
 * @returns {ContractTransactionReceipt}
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

async function getInstitution(institutionAddress, deployer) {
    // ** TODO: Implementar uma busca da instituição de forma mais inteligente **
    // A instituição dentro do mapeamento na API deve ser buscada de uma maneira mais inteligente
    // Isto é, com index não está bom o suficiente
    //const institutionAddress = await API.getInstitution(index)

    const institutionFactory = new ethers.ContractFactory(
        institutionArtifacts.abi,
        institutionArtifacts.bytecode,
        deployer
    )
    const institutionContract = institutionFactory.attach(institutionAddress)

    return institutionContract
}

async function generateSigner() {
    // Initialize ethers signer and provider to interact with the contracts onchain
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey) {
        throw new Error("private key not provided - check your environment variables");
    }

    const rpcUrl = process.env.ETHEREUM_SEPOLIA_RPC_URL;

    if(!rpcUrl) {
        throw new Error(`rpcUrl not provided  - check your environment variables`);
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const signer = new ethers.Wallet(privateKey, provider);

    return signer;
}

(async () => {
    if (require.main === module) {
        //const [ deployer ] = await ethers.getSigners()
        const deployer = await generateSigner()

        //const APIAddress = '0x65a702A8b59Df0ED47388567B93FF71322F25BE4' // Antigo
        const APIAddress = '0xB88b56107d445857c3029157053dE0f7F8f32aF0' // Novo
        const APIflag = 0
        const institutionFlag = 0
        const insuranceFlag = 1

        // Chainlink Functions
        const subscriptionFlag = 0
        const fundSubscriptionFlag = 0

        let API
        let institution
        let info = {
            name: 'Newest Inst'
            // ... Pesquisar na literatura informações relevantes para identificar uma instituição
        }
        let subscriptionId
        let juelsAmount = String(BigInt(10**18)) // 1 LINK
        let manager
        let args
        let institutionAddr
    
        try {
            if(APIflag) {
                API = await APIDeployment.createAPI(deployer)
                console.log(`API: ${API}`)
            }
            else {
                API = await APIDeployment.getAPI(APIAddress, deployer)
            }
        }
        catch(e) {
            throw new Error(e)
        }

        try {
            if(institutionFlag) {
                const receipt = await createInstitution(API, info)
                console.log('Institution receipt.logs:')
                console.log(receipt.logs)
                return
                // ** TODO: Trata o receipt.logs para extrair o endereço da instituição
                // E popular a variável: institution = await getInstitution(institutionAddr) 
                // Isso é imprescindível para usar as funções da instituição depois da criação
            }
            else {
                const institutionAddr = '0x2ea9e1c5035e7689abb8cfdf1ab771175cec8462'
                institution = await getInstitution(institutionAddr, deployer)
                // Artigo: '0xd7404c521f66fb7e0944ebfd9fbd87e1b62d490a'
            }
        }
        catch(e) {
            throw new Error(e)
        }

        try {
            manager = await chainlinkFunctions.createManager(
                deployer,
                sepoliaLinkTokenAddress,
                sepoliaRouterAddress
            )
        }
        catch(e) {
            throw new Error(e)
        }

        try {
            if(subscriptionFlag) {
                subscriptionId = await manager.createSubscription(institutionAddr)
                
                console.log(`Chainlink Functions subscription ID: ${subscriptionId}`)
            }
            else {
                subscriptionId = 1895
                // Antigo: 1894 
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

                console.log(`Chainlink Subscription ${subscriptionId} funded.`)
            }
        }
        catch(e) {
            throw new Error(e)
        }

        try {
            if(insuranceFlag) {
                // TODO: Debugar comentários abaixo

                const name = await institution.institutionName()

                console.log(name)
                console.log(institution.address)

                // const txWhiteList = await institution.whitelistAddr(deployer.address)
                // await txWhiteList.wait(1)
                // console.log('Farmer added to whitelist')

                args = {
                    deployer: institution.address,
                    farmer: deployer.address, // Para fins de teste
                    humidityLimit: ethers.utils.hexZeroPad(ethers.utils.hexlify(50), 256),
                    sampleMaxSize: ethers.utils.hexZeroPad(ethers.utils.hexlify(1), 256),
                    reparationValue: ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 256),
                    interval: ethers.utils.hexZeroPad(ethers.utils.hexlify(10), 256),
                    router: sepoliaRouterAddress,
                    subscriptionId: ethers.utils.hexZeroPad(ethers.utils.hexlify(subscriptionId), 64),
                    registryAddress: sepoliaRegistryAddress,
                    linkTokenAddress: sepoliaLinkTokenAddress,
                    registrarAddress: sepoliaRegistrarAddress,
                    gaslimit: ethers.utils.hexZeroPad(ethers.utils.hexlify(300000), 32)
                }

                const txInsuranceCreation = await createInsuranceContract(institution, args)
                const receiptInsuranceCreation = txInsuranceCreation.wait(1)

                console.log(`Insurance Contract address: ${receiptInsuranceCreation.logs}`)
            
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

// const farmerAddress = '0x1bE776c435Fb6243E3D8b22744f6e58f62A8B41E'