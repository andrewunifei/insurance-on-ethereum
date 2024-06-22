import { ethers }  from "ethers";
import insuranceAPIArtifacts from '@/utils/InsuranceAPI.sol/InsuranceAPI.json';

export default function mountInsuranceAPI(signer) {
    const APIAddress = '0xdB362fC26F41Ea5ce630F98f974ab64B9FC53b02';
    const APIFactory = new ethers.ContractFactory(
        insuranceAPIArtifacts.abi,
        insuranceAPIArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}

// old: 0x33E728e2C7Daa2F30e4fC7921614246cb37c914D

// 