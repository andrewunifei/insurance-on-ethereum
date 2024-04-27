"use client"

import mountinsuranceContract from "@/utils/InsuranceContract.sol/mountInsuranceContract";
import Link from 'next/link';
import { Card, Divider, Flex } from 'antd';
import { useEffect, useState } from "react";
import { ethers }  from "ethers";

export default function CurrentInsuranceContract({ institution, signer }) {
        const [ flexSections, setFlexSections ] = useState(null);

        useEffect(() => {
            if(institution && signer) {
                async function mountContracts() {
                    try {
                        // O erro ocorre porque não nada na lista
                        const farmers = await institution.getAllFarmers(); // ERRO AQUI
                        let cards;
                        const _flexSections = [];
                        const displayKeys = ['Limite', 'Valor de reparação'];
                        for (let farmer of farmers) {
                            cards = [];
                            const insuranceContractAddresses = await institution.getAllInsuranceContracts(farmer);
                
                            for (let address of insuranceContractAddresses) {
                                const array = [];
                                const insuranceContract = mountinsuranceContract(signer, address)
                                const bigNumberHumidityLimit = await insuranceContract.humidityLimit();
                                const bigNumberReparationValue = await insuranceContract.reparationValue();
                                const humidityLimit = ethers.utils.formatEther(bigNumberHumidityLimit);
                                const reparationValue = ethers.utils.formatEther(bigNumberReparationValue);
                                array.push(humidityLimit);
                                array.push(reparationValue);
                                const cardChildren = array.map((val, index) => (
                                    <p
                                        key={val}
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
                                            key={address}
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
                                    <Flex wrap="wrap" gap="large" justify="flex-start" align="center">
                                        {cards}
                                    </Flex>
                                    <Divider />
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
                    