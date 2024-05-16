import { ethers }  from "ethers";
import LINKArtifacts from '@/utils/Chainlink/link.json';
import sepolia from '@/utils/blockchain'

export default function mountLINK(signer) {
    const LINKFactory = new ethers.ContractFactory(
        LINKArtifacts.abi,
        LINKArtifacts.bytecode,
        signer 
    );
    return LINKFactory.attach(sepolia.chainlinkLinkTokenAddress);
}
