import { ethers }  from "ethers";
import institutionArtifacts from '../artifacts/institution.json' assert { type: 'json' };

export default function mountInstitution(signer, institutionAddress) {
    const institutionFactory = new ethers.ContractFactory(
        institutionArtifacts.abi,
        institutionArtifacts.bytecode,
        signer
    );
    return institutionFactory.attach(institutionAddress);
}