"use client"

import { useSignerContext } from "@/context";
import { useEffect, useState, createElement, createRef } from "react";
import mountInsuranceAPI from "@/utils/InsuranceAPI.sol/mountInsuranceAPI";
import mountInstitution from "@/utils/Institution.sol/mountInstitution";
import { ethers }  from "ethers";
import { Card, Button, Space, Flex } from 'antd';

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
                                createElement(
                                    "p",
                                    {
                                        key: val['info'],
                                        id: val['info']
                                    },
                                    createElement(
                                        'span',
                                        {style: {fontWeight: 'bold'}}, 
                                        `${val['index']}:`
                                    ),
                                    ` ${val['info']}`
                                )
                            ));
                            _cards.push(
                                (
                                    <Card 
                                        key={1}  
                                        loading={false}
                                        title={_children[1].props.id}
                                        extra={<a href="#">Explorar</a>}
                                        style={{ width: 300 }}
                                    >
                                        {_children}
                                    </Card>
                                )
                            )
                            if(container.current) container.current.removeChild(container.current.children[0]);
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
    
    return (
        <Space direction="vertical" size={16}>
            <Button type="primary">
                Criar nova Instituição
            </Button>
            <Flex wrap="wrap" gap="large" justify="flex-start" align="center" ref={container}>
                <Card 
                    title={"Carregando..."}
                    extra={<a href="#">Explorar</a>}
                    loading={true}
                    style={{
                        visibility: 'visible',
                        width: 300
                    }}
                >
                </Card>
                {cards}
            </Flex>
        </Space>
    )
}