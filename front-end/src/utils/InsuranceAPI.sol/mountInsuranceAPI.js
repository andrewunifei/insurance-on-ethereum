import { ethers }  from "ethers";
import insuranceAPIArtifacts from '@/utils/InsuranceAPI.sol/InsuranceAPI.json';

export default function mountInsuranceAPI(signer) {
    const APIAddress = '0x27526e0D26d5f8f728E181A44c3CEF0D8e99Dae9';
    const APIFactory = new ethers.ContractFactory(
        insuranceAPIArtifacts.abi,
        insuranceAPIArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}