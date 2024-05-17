import { ethers } from 'ethers';

function getUpkeepParams(signer, insuranceContractAddress, juels) {
    return {
        name:           'automation-functions-consumer',
        encryptedEmail: ethers.utils.hexlify([]),
        upkeepContract: insuranceContractAddress,
        gasLimit:       1000000,
        adminAddress:   signer.address,
        triggerType:    0,
        checkData:      ethers.utils.hexlify([]),
        triggerConfig:  ethers.utils.hexlify([]),
        offchainConfig: ethers.utils.hexlify([]),
        amount:         juels
    };
}

export default getUpkeepParams;