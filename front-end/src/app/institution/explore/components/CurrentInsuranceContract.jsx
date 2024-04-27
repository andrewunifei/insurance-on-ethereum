"use client"

import mountinsuranceContract from "@/utils/InsuranceContract.sol/mountInsuranceContract";
import Link from 'next/link';
import { Card, Divider, Flex, Typography, Space } from 'antd';
const { Text } = Typography;
import { useEffect, useState } from "react";
import { ethers }  from "ethers";
import styles from '../page.module.css'

export default function CurrentInsuranceContract({ institution, signer }) {
        const [ flexSections, setFlexSections ] = useState(null);

        useEffect(() => {
            if(institution && signer) {
                async function mountContracts() {
                    try {
                        const farmers = await institution.getAllFarmers();
                        let cards;
                        const _flexSections = [];
                        const displayKeys = [
                            'Contrato',
                            'Limite',
                            'Valor de reparação'
                        ];
                        let keyGenerated;
                        let count1 = 0;
                        let count2 = 0;
                        for (let farmer of farmers) {
                            cards = [];
                            const insuranceContractAddresses = await institution.getAllInsuranceContracts(farmer);
                            count1++;
                
                            for (let address of insuranceContractAddresses) {
                                count2++;
                                keyGenerated = String(count1) + String(count2);
                                console.log(keyGenerated);
                                const array = [];
                                const insuranceContract = mountinsuranceContract(signer, address)
                                const bigNumberHumidityLimit = await insuranceContract.humidityLimit();
                                const bigNumberReparationValue = await insuranceContract.reparationValue();
                                const humidityLimit = bigNumberHumidityLimit.toNumber();
                                const reparationValue = ethers.utils.formatEther(bigNumberReparationValue);
                                array.push(address.slice(0, 12) + '...');
                                array.push(humidityLimit);
                                array.push(reparationValue);
                                const cardChildren = array.map((val, index) => (
                                    <p
                                        key={keyGenerated + val}
                                        id={val}
                                    >
                                        <span 
                                            style={{fontWeight: 'bold'}} 
                                        >
                                            {`${displayKeys[index]}: `}
                                        </span>
                                        {val}
                                    </p>
                                ));
                                cards.push(
                                    (
                                        <Card 
                                            key={keyGenerated}
                                            id={address}
                                            loading={false}
                                            title={address}
                                            extra={
                                                <Link 
                                                    href={{
                                                        pathname: "/institution/explore",
                                                        query: {
                                                            address: address
                                                        }
                                                    }}
                                                >
                                                    Explorar
                                                </Link>
                                            }
                                            style={{
                                                width: 300,
                                                boxShadow: "5px 8px 24px 5px rgba(208, 216, 243, 0.6)"
                                            }}
                                        >
                                            {cardChildren}
                                        </Card>
                                    )
                                )
                            }

                            _flexSections.push(
                                <> 
                                    <Space
                                        direction="vertical"
                                        size={18}
                                        style={{
                                            width: '100%'
                                        }}
                                    >
                                        <p>
                                            <span style={{
                                                color: 'grey'
                                            }}>{'Contratos referentes ao fazendeiro '}</span>
                                            <Link 
                                                id={styles.etherScan}
                                                href={`https://sepolia.etherscan.io/address/${farmer}`}
                                                target='_blank'
                                            >
                                                <Text 
                                                    copyable={true}
                                                    id={styles.etherScan}
                                                >
                                                    {farmer}
                                                </Text>
                                            </Link>
                                        </p>
                                        <Flex 
                                            wrap="wrap" 
                                            gap="large" 
                                            justify="flex-start" 
                                            align="center"
                                            key={count1}
                                        >
                                            {cards}
                                        </Flex>
                                        <Divider />
                                    </Space>
                                </>
                            )
                        }
                        setFlexSections(_flexSections);
                    }
                    catch(e) {
                        console.log(e);
                    }
                }
                mountContracts();
            }
        }, [institution, signer])
        
    return (<>{flexSections}</>)
}
                    