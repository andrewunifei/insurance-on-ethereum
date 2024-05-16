import { Space } from 'antd';
import { MinusCircleTwoTone, ExclamationCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

export default function SignaturesList({states}) {
    return (
        <>
            <p>
                As configurações do Contrato de Seguro exigem n assinaturas na Blockchain:
            </p>
            <br/>
            <Space direction='vertical' size='large'>
                <Space direction='vertical'>
                    <span style={{fontWeight: 'bold'}}>Criação de contrato</span>
                    <span>{states.contractCreated === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.contractCreated === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 1: Criação de um novo Contrato de Seguro Agrícola na blockchain.</span>
                </Space>
                <Space direction='vertical'>    
                    <span style={{fontWeight: 'bold'}}>Chainlink Functions</span>
                    <span>{states.subscriptionCreated ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.subscriptionCreated ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 2: Inscrição em Chainlink Functions.</span>
                    <span>{states.subscriptionFunded ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.subscriptionFunded ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 3: Financiamento de Chainlink Functions.</span>
                    <span>{states.consumerAdded ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.consumerAdded ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 4: Adicionar o Contrato de Seguro Agrícola a inscrição Chainlink Functions.</span>
                    <span>{states.subscriptionIdSetted ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.subscriptionIdSetted ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 5: Armazenar no Contrato de Seguro Agrícola o ID da inscrição.</span>
                </Space>
            </Space>

        </>

    )
} 