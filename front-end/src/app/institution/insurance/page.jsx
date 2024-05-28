"use client"

import mountinsuranceContract from "@/utils/InsuranceContract.sol/mountInsuranceContract";
import { useSignerContext } from "@/context";
import { Space, Flex, Button, Card } from "antd"
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from "react";
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';

export default function Insurance({ searchParams }) {
    const router = useRouter();
    const { signer } = useSignerContext();

    const [ insuranceContract, setInsuranceContract ] = useState(null);

    useEffect(() => {
        const contractAddress = searchParams.address;
        const _insuranceContract = mountinsuranceContract(signer, contractAddress);
        setInsuranceContract(_insuranceContract);
        async function load() {
            const sampleMaxSize = await _insuranceContract.sampleMaxSize();
            const samples = await _insuranceContract.getAllSamples();
            const sampleTimestamps = await _insuranceContract.getAllSamplesTimestamps(); 
            const myDate1 = new Date(sampleTimestamps[0] * 1000);
            const myDate2 = new Date(sampleTimestamps[1] * 1000);

            console.log(sampleMaxSize);
            console.log(samples);
            console.log(myDate1.toLocaleString());
            console.log(myDate2.toLocaleString());
            console.log(sampleTimestamps);
        };
        load();
    }, [signer])

    return (
        <>
            {/* <Flex>
                <Button 
                    onClick={() => {router.back()}}
                    icon={<ArrowLeftOutlined />}
                    style={{alignSelf: 'flex-start'}}
                >
                    Voltar
                </Button>
            </Flex> */}
            <Flex gap="small" style={{width: '100%'}} vertical={true}>
                <Flex
                    vertical={false}
                    align="flex-start"
                    gap="small"
                    style={{
                        background: '#fff',
                        width: '100%'
                    }}
                >
                    <div style={{
                        border: 'solid',
                        borderRadius: 5,
                        borderColor: '#F0F0F0',
                        width: '100%'
                    }}>
                        <Flex gap="large" align="center" style={{
                            borderBottom: 'solid',
                            borderBottomColor: '#F0F0F0',
                            borderBottomStyle: 'dotted',
                            padding: 20
                        }}>
                            <h1>Testing bread 1</h1>
                        </Flex>
                    </div>
                    <div style={{
                        border: 'solid',
                        borderRadius: 5,
                        borderColor: '#F0F0F0',
                        width: '100%'
                    }}>
                        <Flex gap="large" align="center" style={{
                            borderBottom: 'solid',
                            borderBottomColor: '#F0F0F0',
                            borderBottomStyle: 'dotted',
                            padding: 20
                        }}>
                            <h1>Testing bread 2</h1>
                        </Flex>
                    </div>
                </Flex>
                <Flex
                    vertical={true}
                    gap="large"
                    style={{
                        width: '100%',
                        background: '#fff'
                    }}
                >
                    <div style={{
                            border: 'solid',
                            borderRadius: 5,
                            borderColor: '#F0F0F0',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <Flex gap="large" align="flex-start" style={{
                            borderBottom: 'solid',
                            borderBottomColor: '#F0F0F0',
                            borderBottomStyle: 'dotted',
                            padding: 20
                        }}>
                            <h1>Dados coletados</h1>
                        </Flex>
                        <Flex 
                            wrap="wrap" 
                            gap="large" 
                            justify="flex-start" 
                            align="center" 
                            style={{
                                padding: 20,
                                minHeight: 0,
                                overflowY: 'scroll',
                                flexBasis: '0%',
                                flexShrink: 0
                            }}
                        >
                            <Card 
                                title={"Amostra 1"}
                                style={{
                                    visibility: 'visible',
                                    width: '100%'
                                }}
                            >
                                <p>Métrica coletada: 50</p>
                                <p>Thu, 24 Mar 2022 01:06:03 GMT</p>
                            </Card>
                            <Card 
                                title={"Amostra 1"}
                                style={{
                                    visibility: 'visible',
                                    width: '100%'
                                }}
                            >
                                <p>Métrica coletada: 50</p>
                                <p>Thu, 24 Mar 2022 01:06:03 GMT</p>
                            </Card>
                            <Card 
                                title={"Amostra 1"}
                                style={{
                                    visibility: 'visible',
                                    width: '100%'
                                }}
                            >
                                <p>Métrica coletada: 50</p>
                                <p>Thu, 24 Mar 2022 01:06:03 GMT</p>
                            </Card>
                            <Card 
                                title={"Amostra 1"}
                                style={{
                                    visibility: 'visible',
                                    width: '100%'
                                }}
                            >
                                <p>Métrica coletada: 50</p>
                                <p>Thu, 24 Mar 2022 01:06:03 GMT</p>
                            </Card>
                        </Flex>
                    </div>
                </Flex>
            </Flex>
        </>
    )
}