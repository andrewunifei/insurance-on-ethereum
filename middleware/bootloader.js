const ethers = require("ethers")
const blockchain = require("./blockchain")
const APIManager = require("./APIManager")
const institutionManager = require("./institutionManager")
const chainlinkFunctions = require("./chainlinkFunctions")
const institutionArtifacts = require("../build/artifacts/contracts/Institution.sol/Institution.json")
const insuranceContractManager = require("./insuranceContractManager")

const upkeepArtifact = require('../build/artifacts/contracts/Upkeep.sol/Upkeep.json')
const abi = upkeepArtifact.abi
const bytecode = upkeepArtifact.bytecode

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

async function getInstitution(institutionAddress, deployer) {
    // ** TODO: Implementar uma busca da instituição de forma mais inteligente **
    // A instituição dentro do mapeamento na API deve ser buscada de uma maneira mais inteligente
    // Isto é, com index não está bom o suficiente
    // const institutionAddress = await API.getInstitution(index)
    // COM BUSCA POR ENDEREÇO TALVEZ FUNCIONE MELHOR

    const institutionFactory = new ethers.ContractFactory(
        institutionArtifacts.abi,
        institutionArtifacts.bytecode,
        deployer
    )
    const institutionContract = institutionFactory.attach(institutionAddress)

    return institutionContract
}

(async () => {
    if (require.main === module) {
        const result = await blockchain.interaction()
        const deployer = result.signer
        const provider = result.provider
        
        const APIAddress = '0x74Ce03A9655585754F50627F13359cc2F40D8FFB' // Novo
        const APIflag = 0
        const institutionFlag = 0
        const insuranceFlag = 0

        // Chainlink Functions
        const subscriptionFlag = 0
        const fundSubscriptionFlag = 0
        const addToSubFlag = 0

        // Chainlink Automation 
        const upkeepFlag = 1

        let API
        let institution
        let info = {
            name: 'Newest Inst'
            // ... Pesquisar na literatura informações relevantes para identificar uma instituição
        }
        let subscriptionId
        let juelsAmount = String(BigInt(10**18)) // 1 LINK
        let manager
        let institutionAddr
        let insuranceContractAddress
    
        try {
            if(APIflag) {
                API = await APIManager.createAPI(deployer)
                console.log(API)
            }
            else {
                API = await APIManager.getAPI(APIAddress, deployer)
            }
        }
        catch(e) {
            throw new Error(e)
        }

        try {
            if(institutionFlag) {
                const receipt = await APIManager.createInstitution(API, info)
                console.log(receipt.logs)

                return
                // ** TODO: Trata o receipt.logs para extrair o endereço da instituição
                // E popular a variável: institution = await getInstitution(institutionAddr) 
                // Isso é imprescindível para usar as funções da instituição depois da criação
            }
            else {
                const institutionAddr = '0x73d571dec95e9d52cd54e14267c74f51bf7f037b'
                institution = await getInstitution(institutionAddr, deployer)
                
            }
        }
        catch(e) {
            throw new Error(e)
        }

        try {
            manager = await chainlinkFunctions.createManager(
                deployer,
                blockchain.sepolia.chainlinkLinkTokenAddress,
                blockchain.sepolia.chainlinkRouterAddress
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
                // Enviar Ether para contrato através do Deployer 
                // const tx = await deployer.sendTransaction(
                //     {
                //         to: institution.address,
                //         value: ethers.utils.parseEther("0") // eth --> wei
                //     }
                // )

                // Coloca o endereço do fazendeiro na lista branca
                // const txWhiteList = await institution.whitelistAddr(deployer.address)
                // await txWhiteList.wait(1)
                // console.log('Farmer added to whitelist')

                const balance = await provider.getBalance(institution.address);
                console.log(balance)

                const args = {
                    deployer: institution.address,
                    farmer: deployer.address, // Para fins de teste
                    humidityLimit: 50,
                    sampleMaxSize: 1,
                    reparationValue: ethers.utils.parseEther("0"), // eth --> wei
                    interval: 1,
                    router: blockchain.sepolia.chainlinkRouterAddress,
                    subscriptionId,
                    registryAddress: blockchain.sepolia.chainlinkRegistryAddress,
                    linkTokenAddress: blockchain.sepolia.chainlinkLinkTokenAddress,
                    registrarAddress: blockchain.sepolia.chainlinkRegistrarAddress,
                    gaslimit: 300000
                }

                const receipt = await institutionManager.createInsuranceContract(institution, args)

                // ** TODO: Tratar o receipt.logs **
                console.log(receipt.events)

                return
            }
            else { 
                insuranceContractAddress = '0xb70eE5899c2Fe65256587686918879a4c030bbf9'

                console.log('Current Insurance Contract Address: 0xb70eE5899c2Fe65256587686918879a4c030bbf9')
                
                // Antigo insuraneContractAddress = 0x3dc8420f89f74997a1345a6f80627ea6e5b670ae
            }

            try {
                if(addToSubFlag) {
                    const tx = await manager.addConsumer(
                        {
                            subscriptionId,
                            consumerAddress: insuranceContractAddress
                        }
                    )

                    console.log('Consumer added to subscription')
                }
            }
            catch(e) {
                throw new Error(e)
            }

            try {
                if(upkeepFlag) {
                    const upkeepParams = {
                        name: 'upkeep-teste',
                        encryptedEmail: ethers.utils.hexlify([]),
                        upkeepContract: insuranceContractAddress,
                        gasLimit: 300000,
                        adminAddress: deployer.address, // Pode ser a instituição (talvez)
                        triggerType: 0,
                        checkData: ethers.utils.hexlify([]),
                        triggerConfig: ethers.utils.hexlify([]),
                        offchainConfig: ethers.utils.hexlify([]),
                        amount: ethers.utils.parseEther(String(5)) // LINK Token
                    }

                    let insuranceContract = await insuranceContractManager.getInsuranceContract(
                        insuranceContractAddress, deployer
                    )

                    const upkeepAddr = await insuranceContract.i_upkeep()

                    const upkeepFactory = new ethers.ContractFactory(
                        abi,
                        bytecode,
                        deployer 
                    )
                    const upkeep = upkeepFactory.attach(upkeepAddr)

                    const tx = await upkeep.register(upkeepParams)
                    
                    console.log(tx)

                    // const tx = await insuranceContract.registerUpkeep(upkeepParams)
                    // const receipt = tx.wait(1)

                    // console.log(receipt.logs)
                }
            }
            catch(e) {
                throw new Error(e)
            }
        }
        catch(e) {
            throw new Error(e)
        }
    }
})()