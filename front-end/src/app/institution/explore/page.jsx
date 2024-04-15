"use client"

import { useRouter } from 'next/navigation'
import mountInstitution from "@/utils/Institution.sol/mountInstitution";
import { useSignerContext } from "@/context";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Divider, Space, Row, Col, Input, Typography, Tooltip } from 'antd';
import Link from 'next/link';
import styles from './page.module.css'
import Image from 'next/image'

const { Paragraph, Text } = Typography;

export default function Expore({ searchParams }) {
    const institutionAddress = searchParams.address
    const { signer } = useSignerContext();
    const [ institution, setInstitution ] = useState(null);
    const router = useRouter()

    useEffect(() => {
        setInstitution(mountInstitution(signer, institutionAddress));
    }, [])

    return (
        <>
            <Space direction="vertical" size={16} style={{width: '100vw'}} >
            <Flex gap="large" wrap="wrap" align="center" >
                <Button onClick={() => {router.back()}} icon={<ArrowLeftOutlined />}>Voltar</Button>
                <h1>{searchParams.name}</h1>
                <div style={{
                    marginLeft: "auto", 
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Space direction="horizontal" size={10} >
                    <Button type="primary">Iniciar novo Contrato de Seguro</Button>
                    <p style={{
                        border: 'solid', 
                        padding: 10, 
                        borderRadius: 5,
                        borderColor: '#F0F0F0',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        Balanço:
                        <Image
                            src="/ethereum.svg"
                            width={15}
                            height={15}
                        /> 
                        9.31 ETH
                    </p>

                    <p style={{
                        border: 'solid', 
                        padding: 10, 
                        borderRadius: 5,
                        borderColor: '#F0F0F0'
                    }}>
                    <span >Endereço: </span>
                    <Link 
                        id={styles.etherScan}
                        href={`https://etherscan.io/address/${institution ? institution.address : ''}`}
                        target='_blank'
                    >
                        {institution ? institution.address : ''}
                    </Link>
                    </p>
                    </Space>
                </div>
            </Flex>
            <Divider style={{margin: "0", color: "black"}} />
            <div style={{
                            border: 'solid',
                            borderRadius: 5,
                            borderColor: '#F0F0F0',
                        }}>
                    <h2 style={{
                        borderBottom: 'solid',
                        borderBottomColor: '#F0F0F0',
                        borderBottomStyle: 'dotted',
                        padding: 20
                    }}>
                        Painel de Controle
                    </h2>
                <Row style={{display: 'flex', justifyItems: 'center'}} >
                    <Col span={6} style={{ 
                        padding: 35, 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'}}
                    >
                        <Text keyboard style={{marginBottom: 8}}>
                            Adicionar balanço à Instituição
                        </Text>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input prefix="Ξ" placeholder="Ether" />
                            <Button type="primary">Adicionar</Button>
                        </Space.Compact>
                    </Col>
                    <Col span={6} style={{
                        padding: 35, 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'}}
                    >
                        <Text keyboard style={{marginBottom: 8}}>
                            Sacar balanço da Instituição
                        </Text>

                        <Space.Compact style={{ width: '100%' }}>
                            <Input prefix="Ξ" placeholder="Ether" />
                            <Button type="primary">Sacar</Button>
                        </Space.Compact>
                    </Col>
                    <Col span={6} style={{ 
                        padding: 35, 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'}}
                    >
                        <Text keyboard style={{marginBottom: 8}}>
                            Adicionar à Lista Branca <Tooltip title="O endereço da carteira do fazendeiro precisa estar na lista branca como pré-requisito para iniciar um Contrato de Seguro." color='cyan' key='branca'>
                            <QuestionCircleOutlined /></Tooltip>
                        </Text>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input placeholder="Endereço da carteira" />
                            <Button type="primary">Adicionar</Button>
                        </Space.Compact>
                    </Col>
                    <Col span={6} style={{ 
                        padding: 35, 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'}}
                    >
                        <Text keyboard style={{marginBottom: 8}}>
                            Adicionar à Lista Negra <Tooltip title="A carteira do fazendeiro" color='cyan' key='branca'>
                            <QuestionCircleOutlined /></Tooltip>
                        </Text>
                        <Space.Compact>
                            <Input placeholder="Endereço da carteira" />
                            <Button type="primary">Adicionar</Button>
                        </Space.Compact>
                    </Col>
                </Row>
            </div>
            <div style={{
                            border: 'solid',
                            borderRadius: 5,
                            borderColor: '#F0F0F0',
                        }}>
                    <h2 style={{
                        borderBottom: 'solid',
                        borderBottomColor: '#F0F0F0',
                        borderBottomStyle: 'dotted',
                        padding: 20
                    }}>
                        Contratos de Seguro Ativos
                    </h2>
                    <div>
                        Test
                    </div>
            </div>
            </Space>
        </>
    )
}