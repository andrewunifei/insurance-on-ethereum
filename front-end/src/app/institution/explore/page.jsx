"use client"

import mountInstitution from "@/utils/Institution.sol/mountInstitution";
import { useSignerContext } from "@/context";
import { useEffect, useState } from "react";

export default function Expore({ searchParams }) {
    const institutionAddress = searchParams.address
    const { signer } = useSignerContext();
    const [ institution, setInstitution ] = useState(null);

    useEffect(() => {
        setInstitution(mountInstitution(signer, institutionAddress));
    }, [])

    return (
        <p>
            <span style={{fontWeight: 'bold'}}>Endereço da Instituição </span>
            <a style={{
                fontStyle: 'italic',
                color: '#6089cc'
                }}
                href={`https://etherscan.io/address/${institution ? institution.address : ''}`}
                target='_blank'
            >
                {institution ? institution.address : ''}
            </a>
        </p>
    )
}