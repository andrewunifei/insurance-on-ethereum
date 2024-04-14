"use client"

import { useSignerContext } from "@/context";
import { useEffect, useState, createElement } from "react";
import mountInsuranceAPI from "@/utils/InsuranceAPI.sol/mountInsuranceAPI";
import mountInstitution from "@/utils/Institution.sol/mountInstitution";
import { ethers }  from "ethers";
import { Card, Button, Space, Flex } from 'antd';

export default function Institution() {
    const { signer } = useSignerContext();
    const [ institutions, setInstitutions ] = useState(null);
    const [ cardLoading, setCardLoading] = useState(true);
    const [ instiutionInfo, setInstitutionInfo ]  = useState([]);
    const [ children, setChildren ]  = useState(null);
    const [ cards, setCards ]  = useState(null);
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
                        setCardLoading(true);
                        const insuranceAPI = mountInsuranceAPI(signer);
                        const _institutions = await insuranceAPI.getAllInstitution();
                        let _cards = [];
                        for (let institutionAddress of _institutions) {
                            const institution = mountInstitution(signer, institutionAddress);
                            let array = [];
                            for (let key of infoKeys) {
                                const info = await institution.info(key);
                                // setInstitutionInfo([...instiutionInfo, info])
                                array.push({
                                    index: key,
                                    info
                                })
                            }
                            const _children = array.map((val) => (
                                createElement(
                                    "p",
                                    {id: val['info']},
                                    createElement(
                                        'span',
                                        {style: {fontWeight: 'bold'}}, 
                                        `${val['index']}:`
                                    ),
                                    ` ${val['info']}`
                                )
                            ));
                            _cards.push(createElement(
                                Card,
                                {
                                    loading: cardLoading,
                                    title: _children ? _children[1].props.id : 'Carregando...',
                                    style: { width: 300 }
                                },
                                _children[0]
                            ))
                            //console.log(intitutionInfo)
                            setChildren(_children);
                        }
                        setCards(_cards)
                        setInstitutions(_institutions);
                        setCardLoading(false);
                    }
                    else {
                        setCardLoading(true);
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
        <>
        <div justify="center" style={{display: 'flex', width: '100vw'}}>
        <Space direction="vertical" size={16}>
        <Button type="primary">
            Criar nova Instituição
        </Button>
        <Flex wrap="wrap" gap="large" justify="flex-start" align="center">
            <Card 
                loading={cardLoading}
                title={children ? children[1].props.id : 'Carregando...'}
                extra={<a href="#">Explorar</a>}
                style={{ width: 300 }}
            >
                {children}
            </Card>
            <Card 
                loading={cardLoading}
                title={children ? children[1].props.id : 'Carregando...'}
                extra={<a href="#">Explorar</a>}
                style={{ width: 300 }}
            >
                {children}
            </Card>
            <Card 
                loading={cardLoading}
                title={children ? children[1].props.id : 'Carregando...'}
                extra={<a href="#">Explorar</a>}
                style={{ width: 300 }}
            >
                {children}
            </Card>
            <Card 
                loading={cardLoading}
                title={children ? children[1].props.id : 'Carregando...'}
                extra={<a href="#">Explorar</a>}
                style={{ width: 300 }}
            >
                {children}
            </Card>


            <Card 
                loading={cardLoading}
                title={children ? children[1].props.id : 'Carregando...'}
                extra={<a href="#">Explorar</a>}
                style={{ width: 300 }}
            >
                {children}
            </Card>
            <Card 
                loading={cardLoading}
                title={children ? children[1].props.id : 'Carregando...'}
                extra={<a href="#">Explorar</a>}
                style={{ width: 300 }}
            >
                {children}
            </Card>
            <Card 
                loading={cardLoading}
                title={children ? children[1].props.id : 'Carregando...'}
                extra={<a href="#">Explorar</a>}
                style={{ width: 300 }}
            >
                {children}
            </Card>
        </Flex>
        </Space>
        </div>

        </>
    )
}