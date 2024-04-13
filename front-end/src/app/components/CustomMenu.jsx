"use client"

import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { Menu, Button, ConfigProvider } from 'antd';
import { useSignerContext } from "@/context";

export default function CustomMenu() {
    const { signer, setIsModalOpen, accounts } = useSignerContext(); 
    const [buttonState, setButtonState] = React.useState(false);
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
                    components: {
                    Button: {
                        borderColorDisabled: '#001628'
                    },
                    },
                }}
                >
                    <Button type="primary" onClick={handleButton} disabled={buttonState}  >Conectar MetaMask</Button>
                </ConfigProvider>
            )
        }
    ];

    React.useEffect(() => {
        console.log(signer);
        signer ? setButtonState(true) : setButtonState(false);
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