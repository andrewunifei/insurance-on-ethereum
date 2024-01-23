import * as ethers from 'ethers'
import * as blockchain from '../middleware/blockchain.js'
import * as institutionManager from '../middleware/institutionManager.js'
import * as helpers from './helpers.js'
import mockAPIArtifact from '../build/artifacts/contracts/mock/mockInsuranceAPI.sol/InsuranceAPI.json' assert { type: 'json' }

import insuranceContractParams from './InsuranceParamsMock.js'
import insuranceInfo from './institutionInfoMock.js'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APIPath = path.resolve(__dirname, '..', 'deployed', 'mock', 'mockAPIAddress.txt')
const institutionPath = path.resolve(__dirname, '..', 'deployed', 'mock', 'mockInstitutionAddress.txt')
const insuranceContractPath = path.resolve(__dirname, '..', 'deployed', 'mock', 'mockInsuranceContract.txt')

const { signer, provider } = await blockchain.interaction(
    process.env.HARDHAT_ACCOUNT_PRIVATE_KEY,
    process.env.HARDHAT_RPC_URL
)
const API = await helpers.fetchAPI(signer, APIPath, mockAPIArtifact)
const institution = await helpers.fetchInstitution(signer, API, insuranceInfo, institutionPath)
const signerAddress = signer.address
if(!await institution.isWhiteListed(signerAddress)) {
    await institutionManager.whitelistFarmer(institution, signerAddress)
}
const insuranceContract = await helpers.fetchInsuranceContract(signer, institution, insuranceContractParams, insuranceContractPath)
