import { ethers }  from "ethers";
import InsuranceAPIArtifacts from '@/utils/InsuranceAPI.sol/InsuranceAPI.json';

export default function mountInsuranceAPI(signer) {
    const APIAddress = '0x9772f671c1a2747B963A7500F309e25abc90C319';
    const APIFactory = new ethers.ContractFactory(
        InsuranceAPIArtifacts.abi,
        InsuranceAPIArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}