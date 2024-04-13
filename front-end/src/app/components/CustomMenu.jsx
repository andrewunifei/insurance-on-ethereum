"use client"

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Menu, Button, ConfigProvider } from 'antd';
import { useSignerContext } from "@/context";

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
        {
            key: 4,
            label: (
                <ConfigProvider
                theme={{
                    token: {
                        colorTextDisabled:'rgba(255 , 255, 255, 1)'
                    },
                    components: {
                        Button: {
                            borderColorDisabled: '#fff',
                        },
                    },
                }}
                >
                    <Button type="primary" onClick={handleButton} disabled={buttonState}>{buttonInnerText}</Button>
                </ConfigProvider>
            )
        }
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
        <Menu 
            theme="dark"
            mode="horizontal"
            items={items}
            selectedKeys={[pathname]}
            style={{
            flex: 1,
            minWidth: 0,
            }}
        />
    )
}