import { ethers }  from "ethers";
import insuranceAPIArtifacts from '@/utils/InsuranceAPI.sol/InsuranceAPI.json';

export default function mountInsuranceAPI(signer) {
    const APIAddress = '0xC6EbD2def56185882e6C5a8d6D9Ad9032966CDB5';
    const APIFactory = new ethers.ContractFactory(
        insuranceAPIArtifacts.abi,
        insuranceAPIArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}