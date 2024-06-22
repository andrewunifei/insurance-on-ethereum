"use client"

import { useSignerContext } from "@/context";
import mountInstitution from "@/utils/Institution.sol/mountInstitution";
import mountInsuranceContract from "@/utils/InsuranceContract.sol/mountInsuranceContract";
import Link from 'next/link';
import { Card, Divider, Flex, Typography, Space } from 'antd';
const { Text } = Typography;
import { useEffect, useState } from "react";
import { ethers }  from "ethers";
import styles from '../page.module.css'

export default function Farmer() {
    const [ flexSections, setFlexSections ] = useState(null);
    const { signer, insuranceAPI } = useSignerContext();

    useEffect(() => {
        async function mountContracts() {
            try {
                const farmerAddress = await signer.getAddress();
                const bigNumberInstitutionCount = await insuranceAPI.institution_count();
                const institutionCount = bigNumberInstitutionCount.toNumber();
                console.log(institutionCount);
                const nullAddress = '0x0000000000000000000000000000000000000000';
                let institutionMapping = {};

                let cards = new Array();
                const _flexSections = [];
                const displayKeys = [
                    'Contrato',
                    'Limite',
                    'Valor de reparação'
                ];
                let keyGenerated;
                let count1 = 0;
                let count2 = 0;
                for (let i = 0; i < institutionCount; i++) {
                    const institutionAddress = await insuranceAPI.institutions(nullAddress, i);
                    const institution = mountInstitution(signer, institutionAddress);
                    const institutionName = await institution.info('name');
                    const insuranceContracts = await institution.getAllInsuranceContracts(farmerAddress);
                    if(insuranceContracts.length == 0) {
                        throw Error;
                    }
                    institutionMapping[institutionName] = insuranceContracts;
                    console.log(institutionMapping);
            
                    count1++;
        
                    for (let insuranceContractAddress of insuranceContracts) {
                        count2++;
                        keyGenerated = String(count1) + String(count2);
                        const array = [];
                        const insuranceContract = mountInsuranceContract(signer, insuranceContractAddress)
                        const bigNumberHumidityLimit = await insuranceContract.humidityLimit();
                        const bigNumberReparationValue = await insuranceContract.reparationValue();
                        const humidityLimit = bigNumberHumidityLimit.toNumber();
                        const reparationValue = ethers.utils.formatEther(bigNumberReparationValue);
                        array.push(insuranceContractAddress.slice(0, 12) + '...');
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
                                    id={insuranceContractAddress}
                                    loading={false}
                                    title={insuranceContractAddress}
                                    extra={
                                        <Link 
                                            href={{
                                                pathname: "/institution/insurance",
                                                query: {
                                                    address: insuranceContractAddress
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
                                    }}>{'Contratos referentes a instituição '}</span>
                                    <Link 
                                        id={styles.etherScan}
                                        href={`https://sepolia.etherscan.io/address/${institutionAddress}`}
                                        target='_blank'
                                    >
                                        <Text 
                                            id={styles.etherScan}
                                        >
                                            {institutionName}
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
                // setReady(true);
            }
            catch(e) {
                // setReady(true);
                console.log(e);
                setFlexSections(
                    <>
                        <Space>
                            <p>Nenhum Contrato de Seguro Agrícola criado até o momento para esse fazendeiro.</p>
                        </Space>
                    </>
                );
            }
        }

        if(signer != null) {
            mountContracts();
        }

    }, [signer])
    
    return (<>{flexSections}</>)
}