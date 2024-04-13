"use client"

import { useSignerContext } from "@/context";
import { useEffect, useState } from "react";
import mountInsuranceAPI from "@/utils/InsuranceAPI.sol/mountInsuranceAPI";
import { ethers }  from "ethers";

export default function Institution() {
    const { signer } = useSignerContext();
    const [ institutions, setInstitutions ] = useState(null);

    useEffect(() => {
        async function fetchInstitutions() {
            let _provider;

            if (typeof window.ethereum !== "undefined") {
                if(window.ethereum.isMetaMask) {
                  _provider = new ethers.providers.Web3Provider(window.ethereum);
                }
                const _accounts = await _provider.send("eth_accounts", []); 
                if(_accounts.length ==! 0) {
                    if(signer) {
                        const insuranceAPI = mountInsuranceAPI(signer);
                        const _institutions = await insuranceAPI.getAllInstitution();
                        console.log(_institutions);
                        setInstitutions(_institutions);
                    }
                    else {
                        console.log("Loading...");
                    }
                }
                else {
                    console.log("Por favor, conecte-se");
                }
            }
        }
        fetchInstitutions();        
    }, [signer])
    
    return (<h1>Hello Institution</h1>)
}