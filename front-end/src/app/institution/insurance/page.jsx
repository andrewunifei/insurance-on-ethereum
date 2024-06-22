"use client"

import mountinsuranceContract from "@/utils/InsuranceContract.sol/mountInsuranceContract";
import { useSignerContext } from "@/context";
import { Space, Flex, Button, Card } from "antd"
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from "react";
import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';

export default function Insurance({ searchParams }) {
    const router = useRouter();
    const { signer } = useSignerContext();
    const [ sampleCards, setSampleCards ] = useState([]);

    // Estado
    const [ paid, setPaid ] = useState('');
    const [ collectedSamples, setCollectedSamples ] = useState(''); 
    const [ average, setAverage ] = useState('');

    // Termos
    const [ farmer, setFarmer ] = useState('');
    const [ farmName, setFarmName ] = useState('');
    const [ farmLocation, setFarmLocation ] = useState('');
    const [ reparationValue, setReparationValue ] = useState('');
    const [ humidityLimit, setHumidityLimit ] = useState('');
    const [ totalSamples, setTotalSamples ] = useState('');
    const [ intervalNumber, setIntervalNumber ] = useState('');

    useEffect(() => {
        async function load() {
            const contractAddress = searchParams.address;
            const insuranceContract = mountinsuranceContract(signer, contractAddress);
            const samples = await insuranceContract.getAllSamples();
            const sampleTimestamps = await insuranceContract.getAllSamplesTimestamps(); 
            const _sampleCards = [];
            let sampleSum = 0;

            console.log(samples)

            for(let [index, sample] of samples.entries()) {
                sampleSum = sampleSum + Number(sample);
                const formatedData = new Date(sampleTimestamps[index] * 1000).toLocaleString();
                _sampleCards.push(
                    (
                        <Card 
                            key={sample+index}
                            title={`Amostra ${index + 1}`}
                            style={{
                                visibility: 'visible',
                                width: '100%'
                            }}
                        >
                            <p>Valor da umidade coletada: {sample}%</p>
                            <p>{formatedData}</p>
                        </Card>
                    )
                )
            }
            setSampleCards(_sampleCards);

            const addressPaidHex = await insuranceContract.addressPaid();
            const addressPaid = ethers.utils.formatUnits(addressPaidHex, 0);
            if(addressPaid == 0) {
                setPaid('Em processo de coleta.');
            }
            else if(addressPaid == 1) {
                setPaid('Fazendeiro agraciado com o benefício.')
            }
            else {
                setPaid('Fundos retornados para Instituição.');
            }

            const sampleMaxSizeHex = await insuranceContract.sampleMaxSize();
            const sampleMaxSize = ethers.utils.formatUnits(sampleMaxSizeHex, 0);
            setTotalSamples(sampleMaxSize);
            setCollectedSamples(samples.length);

            const calculatedAverage = sampleSum / Number(sampleMaxSize);
            setAverage(calculatedAverage);

            setFarmer(await insuranceContract.farmer());
            setFarmName(await insuranceContract.farmName());
            const reparationValueHex = await insuranceContract.reparationValue();
            const reparationValue = ethers.utils.formatUnits(reparationValueHex, 18);
            setReparationValue(reparationValue);
            const humidityLimitHex = await insuranceContract.humidityLimit();
            const humidityLimit = ethers.utils.formatUnits(humidityLimitHex, 0);
            setHumidityLimit(humidityLimit);
            const updateIntervalHex = await insuranceContract.updateInterval();
            const updateInterval = ethers.utils.formatUnits(updateIntervalHex, 0);
            setIntervalNumber(updateInterval);
        };
        load();
    }, [signer])

    return (
        <>
            <Flex gap="small" style={{width: '100%'}} vertical={true}>
                <Flex>
                    <Button 
                        onClick={() => {router.back()}}
                        icon={<ArrowLeftOutlined />}
                        style={{alignSelf: 'flex-start'}}
                    >
                        Voltar
                    </Button>
                </Flex>
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
                                <h1>Termos do contrato</h1>
                            </Flex>
                            <Flex gap="large" align="center" style={{
                                padding: 20
                            }}>
                                <Space direction='vertical' size='large'>
                                <Space direction='vertical'>
                                    <span><span style={{fontWeight: 'bold'}}>Endereço do Fazendeiro: </span>{farmer}</span> 
                                    <span><span style={{fontWeight: 'bold'}}>Nome da Fazenda: </span>{farmName}</span> 
                                    {/* <span><span style={{fontWeight: 'bold'}}>Localização da Fazenda: </span>{}</span>  */}
                                    <span><span style={{fontWeight: 'bold'}}>Valor da Indenização: </span>{reparationValue} ETH</span> 
                                    <span><span style={{fontWeight: 'bold'}}>Limite do Índice: </span>{humidityLimit}%</span> 
                                    <span><span style={{fontWeight: 'bold'}}>Número de Amostras: </span>{totalSamples}</span> 
                                    <span><span style={{fontWeight: 'bold'}}>Coletar a cada: </span>{intervalNumber}s</span> 
                                </Space>
                                    <p>Regra: se a Média das Amostras for menor que o Limite do Índice, então o Fazendeiro é agraciado com o Valor da Indenização. Caso contrário, o valor retorna para a Instituição</p>
                                </Space>
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
                                <h1>Estado</h1>
                            </Flex>
                            <Flex gap="large" align="center" style={{
                                padding: 20
                            }}>
                                <Space direction='vertical'>
                                    <span><span style={{fontWeight: 'bold'}}>Agraciado: </span>{paid}</span>
                                    <span><span style={{fontWeight: 'bold'}}>Amostras coletadas: </span>{(collectedSamples && totalSamples) ? `${collectedSamples} de ${totalSamples}.` : ''}</span>
                                    <span><span style={{fontWeight: 'bold'}}>Média das Amostras: </span>{average}%</span>
                                </Space>
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
                                {sampleCards}
                            </Flex>
                        </div>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}