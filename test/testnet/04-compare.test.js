import ethers from 'ethers'
import blockchain from '../../middleware/blockchain.js';
import insuranceContractArtifacts from '../../build/artifacts/contracts/AutomatedFunctionsConsumer.sol/AutomatedFunctionsConsumer.json' assert { type: 'json' };

const payload = await blockchain.interaction(
    process.env.SEPOLIA_ACCOUNT_PRIVATE_KEY,
    process.env.ETHEREUM_SEPOLIA_RPC_URL
);

const signer = payload.signer;

const insuranceContrac_back = new ethers.Contract(
    '0xC969f2e90289f121d5358AE6Db467f12f2461990',
    insuranceContractArtifacts.abi,
    signer
)
const cbor_back = await insuranceContrac_back.requestCBOR();
const donID_back = await insuranceContrac_back.donID();
const subId_back = await insuranceContrac_back.subscriptionId();

console.log('');
console.log(`cbor_back: ${cbor_back}`);
console.log('');
console.log(`donID_back: ${donID_back}`);
console.log('');
console.log(`subId_back: ${subId_back}`);
console.log('');
console.log('');


const insuranceContrac_front = new ethers.Contract(
    '0x81Eb83F023C968BbCe647df9431878Aac2E959Cc',
    insuranceContractArtifacts.abi,
    signer
)
const cbor_front = await insuranceContrac_front.requestCBOR();
const donID_front = await insuranceContrac_front.donID();
const subId_front = await insuranceContrac_front.subscriptionId();

console.log(`cbor_front: ${cbor_front}`);
console.log('');
console.log(`donID_front: ${donID_front}`);
console.log('');
console.log(`subId_front: ${subId_front}`);
console.log('');