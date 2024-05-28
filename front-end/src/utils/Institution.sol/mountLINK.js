import { ethers }  from "ethers";
import LINKArtifacts from './link.json' assert { type: 'json' };
import sepolia from '../blockchain.js'

export default function mountLINK(signer) {
    const LINKFactory = new ethers.ContractFactory(
        LINKArtifacts.abi,
        LINKArtifacts.bytecode,
        signer 
    );
    return LINKFactory.attach(sepolia.chainlinkLinkTokenAddress);
}
