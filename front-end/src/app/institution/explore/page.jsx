"use client"

import { useRouter } from 'next/navigation'
import mountInstitution from "@/utils/Institution.sol/mountInstitution";
import { useSignerContext } from "@/context";
import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Flex, Divider, Space } from 'antd';
import Link from 'next/link';
import styles from './page.module.css'
import Image from 'next/image'

export default function Expore({ searchParams }) {
    const institutionAddress = searchParams.address
    const { signer } = useSignerContext();
    const [ institution, setInstitution ] = useState(null);
    const router = useRouter()

    useEffect(() => {
        setInstitution(mountInstitution(signer, institutionAddress));
    }, [])

    return (
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
        </Space>
    )
}