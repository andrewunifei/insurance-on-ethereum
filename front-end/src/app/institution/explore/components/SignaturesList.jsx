import { Space } from 'antd';
import { MinusCircleTwoTone, ExclamationCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

export default function SignaturesList({states}) {
    return (
        <Space direction='vertical' size='large'>
            <p>
                A criação do Contrato de Seguro Agrícola exigem 9 assinaturas na Blockchain:
            </p>
            <Space direction='vertical'>
                <span style={{fontWeight: 'bold'}}>Criação de contrato</span>
                <span>{states.contractCreated === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.contractCreated === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 1: Criação de um novo Contrato de Seguro Agrícola na blockchain.</span>
            </Space>
            <Space direction='vertical'>    
                <span style={{fontWeight: 'bold'}}>Chainlink Functions</span>
                <span>{states.subscriptionCreated === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.subscriptionCreated === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 2: Inscrição em Chainlink Functions.</span>
                <span>{states.subscriptionFunded === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.subscriptionFunded === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 3: Financiamento de Chainlink Functions.</span>
                <span>{states.consumerAdded === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.consumerAdded === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 4: Adicionar o Contrato de Seguro Agrícola a inscrição Chainlink Functions.</span>
                <span>{states.subscriptionIdSetted === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.subscriptionIdSetted === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 5: Armazenar no Contrato de Seguro Agrícola o ID da inscrição.</span>
                <span>{states.cborSetted === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.cborSetted === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 6: Configuração do Índice Temporal no Contrato de Seguro Agrícola.</span>
            </Space>
            <Space direction='vertical'>
                <span style={{fontWeight: 'bold'}}>Chainlink Automation</span>
                <span>{states.automationFunded === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.automationFunded === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 7: Financiamento de Chainlink Automation.</span>
                <span>{states.upkeepCreation === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.upkeepCreation === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 8: Configuração de Chainlink Automation 1 de 2.</span>
                <span>{states.upkeepRegistration === 'inactive' ? <MinusCircleTwoTone twoToneColor="#a1a1a1"/> : (states.upkeepRegistration === 'pending' ? <ExclamationCircleTwoTone twoToneColor="#ff861c"/> : <CheckCircleTwoTone twoToneColor="#52c41a" />)} Assinatura 9: Configuração de Chainlink Automation 2 de 2.</span>
                <span>{states.incomingData.message}</span>
            </Space>
        </Space>
    )
} 