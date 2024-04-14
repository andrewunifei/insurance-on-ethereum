"use client"

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Menu, Button, ConfigProvider } from 'antd';
import { useSignerContext } from "@/context";
import styles from './CustomMenu.module.css'
import { WalletOutlined } from '@ant-design/icons'

export default function CustomMenu() {
    const { signer, setIsModalOpen } = useSignerContext(); 
    const [buttonState, setButtonState] = React.useState(false);
    const [buttonInnerText, setButtonInnerText] = React.useState("Conectar MetaMask");
    const pathname = usePathname()
    const items = [
        {
            key: '/',
            label: <Link href='/'>Início</Link>,
        },
        {
            key: '/institution',
            label: <Link href='/institution'>Área da Instituição</Link>
        },
        {
            key: '/farmer',
            label: <Link href='/farmer'>Área do Fazendeiro</Link>,
        },
    ];

    React.useEffect(() => {
        if(signer) {
            setButtonState(true)
            setButtonInnerText("Você está conectado!")
        } 
        else {
            setButtonState(false);
            setButtonInnerText("Conectar MetaMask")
        }
    }, [signer])

    function handleButton() {
        setIsModalOpen(true);
    }

    return (
        <div
            style={{
                display: "flex",
                width: "100vw",
            }}
        >
            <Menu 
                theme="dark"
                mode="horizontal"
                items={items}
                selectedKeys={[pathname]}
                style={{ flex: 1, minWidth: 0 }}
            />
            <div style={{marginLeft: "auto"}}>
                <ConfigProvider
                theme={{
                    token: {
                        colorTextDisabled: 'rgba(255 , 255, 255, 1)',
                    },
                    components: {
                        Button: {
                            borderColorDisabled: '#fff',
                        },
                    },
                }}
                >
                    <Button 
                        type="primary"
                        onClick={handleButton}
                        disabled={buttonState}
                        id={buttonState ? styles.connectButtonDisabled : styles.connectButton}
                        icon={<WalletOutlined />}
                    >
                        {buttonInnerText}
                    </Button>
                </ConfigProvider>
            </div>
        </div>
    )
}