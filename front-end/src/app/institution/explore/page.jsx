"use client"

// ** TODO ** Chainlink Functions Subscription ID no Front-end

import { useRouter } from 'next/navigation'
import { ethers }  from "ethers";
import mountInstitution from "@/utils/Institution.sol/mountInstitution";
import { useSignerContext } from "@/context";
import { useEffect, useState, useRef } from "react";
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { TinyColor } from '@ctrl/tinycolor';
import Link from 'next/link';
import styles from './page.module.css'
import Image from 'next/image'
import { fundInstitution, withdrawFromInstitution, whitelist } from '@/app/functions/controlPanel'
import InsuranceForm from '@/app/institution/explore/components/InsuranceForm'
import handleInsuranceForm from '@/utils/Institution.sol/handleInsuranceForm';
import CurrentInsuranceContract from './components/CurrentInsuranceContract';
import SignaturesList from './components/SignaturesList';
import { 
    Button, 
    Flex, 
    Divider, 
    Space, 
    Row, 
    Col, 
    Input, 
    Tooltip, 
    ConfigProvider, 
    Typography, 
    Spin, 
    Form,
    Anchor  } from 'antd';

const { Text } = Typography;
const colors1 = ['#6253E1', '#04BEFE'];
const colors2 = ['#001628', '#027ea8']
const getHoverColors = (colors) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors) =>
  colors.map((color) => new TinyColor(color).darken(5).toString());

export default function Expore({ searchParams }) {
    const { signer, openNotification } = useSignerContext();
    const [ institution, setInstitution ] = useState(null);
    const [ owner, setOwner ] = useState(null);
    const [ balance, setBalance ] = useState(null);
    const [ spinStatus, setSpinStatus ] = useState(false);
    const [ ready, setReady ] = useState(false);

    // Insurancecontract Signatures States
    const [ contractCreated, setContractCreated ] = useState('inactive');
    const [ subscriptionCreated, setSubscriptionCreated ] = useState('inactive');
    const [ subscriptionFunded, setSubscriptionFunded ] = useState('inactive');
    const [ consumerAdded, setConsumerAdded ] = useState('inactive');
    const [ subscriptionIdSetted, setSubscriptionIdSetted ] = useState('inactive');
    const [ cborSetted, setCborSetted ] = useState('inactive');
    const [ automationFunded, setAutomationFunded ] = useState('inactive');
    const [ upkeepCreation, setUpkeepCreation ] = useState('inactive');
    const [ upkeepRegistration, setUpkeepRegistration ] = useState('inactive');
    
    
    // ************************************

    const [ fundButtonLoading, setFundButtonLoading ] = useState(false);
    const [ withdrawButtonLoading, setWithdrawButtonLoading ] = useState(false);
    const [ whitelistBtnLoading, setWhitelistBtnLoading ] = useState(false);
    const [ registerButtonLoading, setRegisterButtonLoading ] = useState(false);

    const router = useRouter();
    const fundInput = useRef('');
    const withdrawInput = useRef('');
    const whitelistInput = useRef('');

    const [form] = Form.useForm();

    async function onFinish(params) {
        setRegisterButtonLoading(true);
        form.resetFields();
        await handleInsuranceForm(
            signer, 
            institution,
            params,
            {
                setContractCreated,
                setSubscriptionCreated,
                setSubscriptionFunded,
                setConsumerAdded,
                setSubscriptionIdSetted,
                setCborSetted,
                setAutomationFunded,
                setUpkeepCreation,
                setUpkeepRegistration
            }
        );
        setRegisterButtonLoading(false)
    };

    useEffect(() => {
        const _institution = mountInstitution(signer, searchParams.address);
        setInstitution(_institution);
        async function getOwner() {
            if(signer) {
                const _owner = await _institution.im_owner();
                const _balanceBigNumber = await _institution.contractBalance();
                const _balance = ethers.utils.formatEther(_balanceBigNumber);
                setOwner(_owner);
                setBalance(_balance);
            }
        };
        getOwner();
    }, [signer])

    return (
        <>
            <Space 
                direction="vertical" 
                size={16} 
                style={{
                    width: '100vw',
                    visibility: (balance) ? 'visible' : 'hidden',
                    backgroundColor:'#fff'
                }}
            >
                {/* HEADER */}
                <Flex gap="large" wrap="wrap" align="center" >
                    <h1 style={{backgroundColor: 'white'}}>
                        <span style={{
                            fontStyle: 'italic',
                            backgroundImage: `linear-gradient(135deg, ${colors2.join(', ')})`, 
                            backgroundClip: 'text',
                            color: 'transparent',
                            backgroundSize: '100%' 
                        }}>
                            {searchParams.name}
                        </span>
                    </h1>
                    <div style={{
                        marginLeft: "auto", 
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <Space direction="horizontal" size={12} >
                            <Spin spinning={spinStatus} />
                            <div style={{
                                border: 'solid', 
                                padding: 10, 
                                borderRadius: 5,
                                borderColor: '#F0F0F0',
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <Image src="/ethereum.svg" width={15} height={15} /> 
                                <Text>
                                    <span style={{color: 'grey'}}> Balanço </span>{balance ? balance : ''} ETH
                                </Text>
                            </div>
                            <div style={{
                                border: 'solid', 
                                padding: 10, 
                                borderRadius: 5,
                                borderColor: '#F0F0F0'
                            }}>
                                <span style={{color: 'grey'}}>Endereço </span>
                                <Link 
                                    href={`https://sepolia.etherscan.io/address/${institution ? institution.address : ''}`}
                                    target='_blank'
                                >
                                    <Text copyable id={styles.etherScan}>
                                        {searchParams.address}
                                    </Text>
                                </Link>
                            </div>
                        </Space>
                    </div>
                </Flex>

                <Divider style={{margin: "0", color: "black"}} />

                <Flex gap="small" wrap="wrap" align="center" >
                    <Button onClick={() => {router.back()}} icon={<ArrowLeftOutlined />}>Voltar</Button>
                    <ConfigProvider
                        theme={{
                            components: {
                                Button: {
                                    colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                                    colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
                                    colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
                                    lineWidth: 0,
                                },
                            }
                        }}
                    >
                        <Anchor affix={false}>
                            <Button type="primary" href='#insurance'>Iniciar novo Contrato de Seguro</Button>
                        </Anchor>
                    </ConfigProvider>
                </Flex>

                {/* PAINEL DE CONTROLE */}
                <div style={{
                    border: 'solid',
                    borderRadius: 5,
                    borderColor: '#F0F0F0'
                }}>
                    <Flex gap="large" align="center" style={{
                        borderBottom: 'solid',
                        borderBottomColor: '#F0F0F0',
                        borderBottomStyle: 'dotted',
                        padding: 20
                    }}>
                        <h2>
                            Painel de Controle
                        </h2>
                        <p>
                            <span style={{
                                color: 'grey'
                            }}>Carteira controladora </span>
                            <Link  
                                id={styles.etherScan}
                                href={`https://sepolia.etherscan.io/address/${owner ? owner : ''}`}
                                target='_blank'
                            >
                                <Text 
                                    copyable={(owner ? true : false)}
                                    id={styles.etherScan}
                                >
                                    {owner ? owner : ''}
                                </Text>
                            </Link>
                        </p>
                    </Flex>

                    <Row style={{display: 'flex', justifyItems: 'center'}} >
                        <Col span={6} style={{ 
                            padding: 35, 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}>
                            <span style={{marginBottom: 8, color: 'grey'}}>
                                Adicionar balanço à Instituição
                            </span>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input ref={fundInput} prefix="Ξ" placeholder="Ether" />
                                <Button 
                                    loading={fundButtonLoading}
                                    type="primary"
                                    onClick={() => {
                                        fundInstitution(
                                            fundInput.current.input.value,
                                            signer,
                                            institution,
                                            searchParams.address,
                                            setFundButtonLoading,
                                            setBalance,
                                            setSpinStatus,
                                            openNotification
                                        )
                                    }}
                                >
                                    Adicionar
                                </Button>
                            </Space.Compact>
                        </Col>
                        <Col span={6} style={{
                            padding: 35, 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}>
                            <span style={{marginBottom: 8, color: 'grey'}}>
                                Sacar balanço da Instituição
                            </span>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input ref={withdrawInput} id="withdraw" prefix="Ξ" placeholder="Ether" />
                                <Button 
                                    loading={withdrawButtonLoading}
                                    type="primary"
                                    onClick={() => withdrawFromInstitution(
                                        withdrawInput.current.input.value,
                                        institution,
                                        setWithdrawButtonLoading,
                                        setBalance,
                                        setSpinStatus,
                                        openNotification
                                    )} 
                                >
                                    Sacar
                                </Button>
                            </Space.Compact>
                        </Col>
                        <Col span={6} style={{ 
                            padding: 35, 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}>
                            <span style={{marginBottom: 8, color: 'grey'}}>
                                Adicionar à Lista Branca <Tooltip title="O endereço da carteira do fazendeiro precisa estar na lista branca como pré-requisito para iniciar um Contrato de Seguro." key='branca'>
                                <QuestionCircleOutlined /></Tooltip>
                            </span>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input ref={whitelistInput} placeholder="Endereço da carteira" />
                                <Button 
                                    loading={whitelistBtnLoading}
                                    type="primary"
                                    onClick={() => whitelist(
                                        whitelistInput.current.input.value,
                                        institution,
                                        setWhitelistBtnLoading,
                                        setSpinStatus,
                                        openNotification
                                    )}
                                >
                                        Adicionar
                                </Button>
                            </Space.Compact>
                        </Col>
                        <Col span={6} style={{ 
                            padding: 35, 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}>
                            <span style={{marginBottom: 8, color: 'grey'}}>
                                Adicionar à Lista Negra <Tooltip title="Endereços de carteira nesta lista são de usuários com comportamentos ruins." key='branca'>
                                <QuestionCircleOutlined /></Tooltip>
                            </span>
                            <Space.Compact>
                                <Input placeholder="Endereço da carteira" />
                                <Button type="primary">Adicionar</Button>
                            </Space.Compact>
                        </Col>
                    </Row>
                </div>

                {/* CONTRATO EM VIGOR */}
                <div style={{
                    border: 'solid',
                    borderRadius: 5,
                    borderColor: '#F0F0F0'
                }}>
                    <h2 style={{
                        borderBottom: 'solid',
                        borderBottomColor: '#F0F0F0',
                        borderBottomStyle: 'dotted',
                        padding: 20
                    }}>
                        Contratos de Seguro (Em vigor)
                    </h2>
                    <Space 
                        direction="vertical"
                        size={16}
                        style={{
                            width: '100%',
                            backgroundColor:'#fff',
                            padding: 20
                        }}
                    >
                        <Spin spinning={!ready} />
                        <CurrentInsuranceContract signer={signer} institution={institution} setReady={setReady} />
                    </Space>
                </div>
                
                {/* CONTRATO DE SEGURO */}
                <div style={{
                    borderRadius: 10,
                    background: '#f8f8f8'
                }}>
                    {/* light yellow #fcfaf5' */}
                    <Flex gap="large" align="center" style={{
                        borderBottom: 'solid',
                        borderBottomWidth: 1,
                        borderBottomStyle: 'dotted',
                        borderBottomColor: '#e4e4e4',
                        padding: 20
                    }}>
                        <h2 style={{color: '#000'}}>
                            Novo Contrato de Seguro
                        </h2>
                    </Flex>
                    {/* <Flex align="flex-start" justify="flex-start" style={{padding: 20}} id="insurance"> 
                            <InsuranceForm form={form} onFinish={onFinish} />
                            <div style={{border: 'solid'}}>
                                <p>
                                    Testing
                                </p>
                            </div>
                    </Flex> */}
                    <Row style={{padding: 20}}>
                        <Col span={12}>
                            <InsuranceForm form={form} onFinish={onFinish} registerButtonLoading={registerButtonLoading} />
                        </Col>
                        <Col span={12}>
                            <SignaturesList states={{
                                contractCreated,
                                subscriptionCreated,
                                subscriptionFunded,
                                consumerAdded,
                                subscriptionIdSetted,
                                cborSetted,
                                automationFunded,
                                upkeepCreation,
                                upkeepRegistration
                            }}/>
                        </Col>
                    </Row>
                </div>
            </Space>
        </>
    )
}