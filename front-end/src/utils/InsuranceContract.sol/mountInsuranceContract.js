import { ethers }  from "ethers";
import insuranceContractArtifacts from '@/utils/insuranceContract.sol/insuranceContract.json';

export default function mountinsuranceContract(signer, insuranceContractAddress) {
    const insuranceContractFactory = new ethers.ContractFactory(
        insuranceContractArtifacts.abi,
        insuranceContractArtifacts.bytecode,
        signer
    );
    return insuranceContractFactory.attach(insuranceContractAddress);
}