"use client"

import { Space, Flex, Button, Card } from "antd"
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';

export default function Insurance() {
    const router = useRouter();

    return (
            // <Button 
            //     onClick={() => {router.back()}}
            //     icon={<ArrowLeftOutlined />}
            //     style={{alignSelf: 'flex-start'}}
            // >
            //     Voltar
            // </Button>
            <Flex gap="small" style={{width: '100%'}}>
                <Flex
                    vertical={true}
                    align="flex-start"
                    gap="small"
                    style={{
                        background: '#fff',
                        width: '50vw'
                    }}
                >
                        <div style={{
                            border: 'solid',
                            borderRadius: 5,
                            borderColor: '#F0F0F0',
                            width: '100%',
                            height: '50%'
                        }}>
                            <Flex gap="large" align="flex-start" style={{
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
                            width: '100%',
                            height: '50%'
                        }}>
                            <Flex gap="large" align="flex-start" style={{
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
                        width: '50vw',
                        background: '#fff',
                        overflow: 'auto'
                    }}
                >
                    <div style={{
                            border: 'solid',
                            borderRadius: 5,
                            borderColor: '#F0F0F0',
                            width: '100%',
                            height: '100%',
                            overflow: 'auto'
                        }}>
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
    )
}