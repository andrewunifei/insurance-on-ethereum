import { ethers }  from "ethers";
import apiArtifacts from '../artifacts/api.json' assert { type: 'json' };

export default function mountApi(signer) {
    const APIAddress = '0xD75325093B86659A9F66C061bDA7779CCb2a4997';
    const APIFactory = new ethers.ContractFactory(
        apiArtifacts.abi,
        apiArtifacts.bytecode,
        signer
    );
    return APIFactory.attach(APIAddress);
}