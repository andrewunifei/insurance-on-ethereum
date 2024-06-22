import { ethers }  from "ethers";
import apiArtifacts from '../artifacts/api.json' assert { type: 'json' };

export default function mountApi(signer) {
    const APIAddress = '0xdB362fC26F41Ea5ce630F98f974ab64B9FC53b02';
    const APIFactory = new ethers.ContractFactory(
        apiArtifacts.abi,
        apiArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}