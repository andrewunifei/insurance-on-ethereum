import { ethers }  from "ethers";
import insuranceAPIArtifacts from '@/utils/InsuranceAPI.sol/InsuranceAPI.json';

export default function mountInsuranceAPI(signer) {
    const APIAddress = '0xD75325093B86659A9F66C061bDA7779CCb2a4997';
    const APIFactory = new ethers.ContractFactory(
        insuranceAPIArtifacts.abi,
        insuranceAPIArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}