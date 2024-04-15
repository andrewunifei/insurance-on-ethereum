import { ethers }  from "ethers";
import insuranceAPIArtifacts from '@/utils/InsuranceAPI.sol/InsuranceAPI.json';

export default function mountInsuranceAPI(signer) {
    const APIAddress = '0xE2b97e351A292000D021d38B5EF4904f51264a76';
    const APIFactory = new ethers.ContractFactory(
        insuranceAPIArtifacts.abi,
        insuranceAPIArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}