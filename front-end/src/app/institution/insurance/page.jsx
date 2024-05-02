"use client"

import { Space, Flex, Button, Card } from "antd"
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';

export default function Insurance() {
    const router = useRouter();

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