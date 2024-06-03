import { ethers }  from "ethers";
import apiArtifacts from '../artifacts/api.json' assert { type: 'json' };

export default function mountApi(signer) {
    const APIAddress = '0x76213988cc810be92C4F1dc9be3A52c2686a6181';
    const APIFactory = new ethers.ContractFactory(
        apiArtifacts.abi,
        apiArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}