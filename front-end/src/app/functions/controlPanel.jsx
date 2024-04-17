"use client"

import { ethers }  from "ethers";

export async function fundInstitution(
        amount,
        signer,
        institution,
        institutionAddress,
        setButtonLoading,
        setBalance,
        setSpinStatus,
        openNotification
    ) {
    setButtonLoading(true);
    const tx = await signer.sendTransaction(
        {
            to: institutionAddress,
            value: ethers.utils.parseEther(String(amount)) // eth --> wei
        }
    );
    setButtonLoading(false);
    setSpinStatus(true);
    const receipt = await tx.wait();
    const _balanceBigNumber = await institution.contractBalance();
    const _balance = ethers.utils.formatEther(_balanceBigNumber);
    setBalance(_balance);
    setSpinStatus(false);
    openNotification({
        message: 'Fundos adicionados com sucesso!',
        description: `${amount} ETH adicionado ao balanço da Instituição.`
    });
    console.log(receipt);
}

export async function withdrawFromInstitution(
        amount,
        institution,
        setButtonLoading,
        setBalance,
        setSpinStatus,
        openNotification 
    ){
    const parsedAmount = ethers.utils.parseEther(String(amount)); // eth --> wei
    setButtonLoading(true);
    const tx = await institution.withdraw(parsedAmount);
    setButtonLoading(false);
    setSpinStatus(true);
    const receipt = await tx.wait();
    const _balanceBigNumber = await institution.contractBalance();
    const _balance = ethers.utils.formatEther(_balanceBigNumber);
    setBalance(_balance);
    setSpinStatus(false);
    openNotification({
        message: 'Fundos retirados com sucesso!',
        description: `${amount} ETH foram retirados do balanço da Instituição.`
    });
    console.log(receipt);
}