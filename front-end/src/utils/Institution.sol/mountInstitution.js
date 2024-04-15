import { ethers }  from "ethers";
import institutionArtifacts from '@/utils/Institution.sol/Institution.json';

export default function mountInstitution(signer, institutionAddress) {
    console.log(institutionAddress)
    const institutionFactory = new ethers.ContractFactory(
        institutionArtifacts.abi,
        institutionArtifacts.bytecode,
        signer
    );
    return institutionFactory.attach(institutionAddress);
}