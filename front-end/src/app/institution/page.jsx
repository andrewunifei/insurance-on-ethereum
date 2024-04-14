"use client"

import { useSignerContext } from "@/context";
import { useEffect, useState, createElement, createRef } from "react";
import mountInsuranceAPI from "@/utils/InsuranceAPI.sol/mountInsuranceAPI";
import mountInstitution from "@/utils/Institution.sol/mountInstitution";
import { ethers }  from "ethers";
import { Card, Button, Space, Flex } from 'antd';
import Link from 'next/link';

export default function Institution() {
    const { signer } = useSignerContext();
    const [ institutions, setInstitutions ] = useState(null);
    const [ cards, setCards ]  = useState(null);
    const container = createRef();
    const infoKeys = [
        'Code',
        'Full Name',
        'Short name',
        'Email'
    ];

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
                        const _institutions = await insuranceAPI.getAllInstitution();;
                        let _cards = [];
                        for (let institutionAddress of _institutions) {
                            const institution = mountInstitution(signer, institutionAddress);
                            let array = [];
                            for (let key of infoKeys) {
                                const info = await institution.info(key);
                                array.push({
                                    index: key,
                                    info
                                })
                            }
                            const _children = array.map((val) => (
                                <p
                                    key={val['info']}
                                    id={val['info']}
                                >
                                    <span 
                                        style={{fontWeight: 'bold'}}
                                    >
                                        {`${val['index']}: `}
                                    </span>
                                    {val['info']}
                                </p>
                            ));
                            _cards.push(
                                (
                                    <Card 
                                        key={institutionAddress}
                                        id={institutionAddress}
                                        loading={false}
                                        title={_children[1].props.id}
                                        extra={
                                            <Link 
                                                href={{
                                                    pathname: "/institution/explore",
                                                    query: {
                                                        address: institutionAddress
                                                    }
                                                }}
                                            >
                                                Explorar
                                            </Link>
                                        }
                                        style={{ width: 300 }}
                                    >
                                        {_children}
                                    </Card>
                                )
                            )
                        }
                        setCards(_cards)
                        setInstitutions(_institutions);
                    }
                }
                else {
                    console.log("Por favor, conecte-se");
                }
            }
        }
        fetchInstitutions();        
    }, [signer])

    useEffect(() => {
        const element = document.getElementById("remove-me");
        if(cards && element) element.remove();
    }, [cards])
    
    return (
        <Space direction="vertical" size={16} >
            <Button type="primary">
                Criar nova Instituição
            </Button>
            <Flex wrap="wrap" gap="large" justify="flex-start" align="center" ref={container} >
                <div id={"remove-me"}>
                    <Card 
                        title={"Carregando..."}
                        extra={<Link href="#">Explorar</Link>}
                        loading={true}
                        style={{
                            visibility: 'visible',
                            width: 300
                        }}
                    >
                    </Card>
                </div>
                {cards}
            </Flex>
        </Space>
    )
}