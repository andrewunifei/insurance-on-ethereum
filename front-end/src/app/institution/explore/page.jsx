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
        <h1>{institution ? institution.address : 'Haro'}</h1>
    )
}