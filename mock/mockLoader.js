import * as ethers from 'ethers'
import * as blockchain from '../middleware/blockchain.js'
import * as chainlinkFunctions from '../middleware/chainlinkFunctions.js'
import * as institutionManager from '../middleware/institutionManager.js'
import * as helpers from './helpers.js'
import upkeepArtifact from '../build/artifacts/contracts/Upkeep.sol/Upkeep.json' assert { type: 'json' }
import LINKArtifacts from '../build/artifacts/@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol/LinkTokenInterface.json' assert { type: 'json' }
import insuranceContractParams from './InsuranceParamsMock.js'
import insuranceInfo from './institutionInfoMock.js'

const { signer, provider } = await blockchain.interaction(
    process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
    process.env.HARDHAT_RPC_URL
)
const API = await helpers.fetchAPI(signer)
const institution = await helpers.fetchInstitution(signer, API, insuranceInfo)
const signerAddress = signer.address
if(!await institution.isWhiteListed(signerAddress)) {
    await institutionManager.whitelistFarmer(institution, signerAddress)
}
const insuranceContract = await helpers.fetchInsuranceContract(signer, institution, insuranceContractParams)
console.log(insuranceContract)
