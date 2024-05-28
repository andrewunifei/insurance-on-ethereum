import { ethers }  from "ethers";
import insuranceContractArtifacts from '../artifacts/insuranceContract.json' assert { type: 'json' };

export default function mountInsuranceContract(signer, insuranceContractAddress) {
    const insuranceContractFactory = new ethers.ContractFactory(
        insuranceContractArtifacts.abi,
        insuranceContractArtifacts.bytecode,
        signer
    );
    return insuranceContractFactory.attach(insuranceContractAddress);
}