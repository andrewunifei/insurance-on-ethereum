import { ethers }  from "ethers";
import LINKArtifacts from '../artifacts/link.json' assert { type: 'json' };
import blockchain from '../blockchain.js'

export default function mountLINK(signer) {
    const LINKFactory = new ethers.ContractFactory(
        LINKArtifacts.abi,
        LINKArtifacts.bytecode,
        signer 
    );
    return LINKFactory.attach(blockchain.sepolia.chainlinkLinkTokenAddress);
}
