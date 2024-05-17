import { Form, Space, Select, Input, Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function InsuranceForm({form, onFinish, registerButtonLoading}) {
    const formItemLayout = {
        labelCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 8,
          },
        },
        wrapperCol: {
          xs: {
            span: 24,
          },
          sm: {
            span: 16,
          },
        },
    };

    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
            span: 24,
            offset: 0,
            },
            sm: {
            span: 16,
            offset: 8,
            },
        },
    };

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '86',
            }}
            scrollToFirstError
            style={{width: 600}}
            requiredMark={false}
            >
            <Form.Item
                name="farmer"
                label="Endereço do fazendeiro"
                rules={[
                    {
                        required: true,
                        message: 'Informe o endereço do fazendeiro.',
                    },
                ]}
            >
                <Input placeholder='Endereço na rede Ethereum'/>
            </Form.Item>

            <Form.Item
                name="farmName"
                label="Nome da fazenda"
                rules={[
                    {
                        required: true,
                        message: 'Informe o nome da fazenda.',
                    },
                ]}
            >
                <Input/>
            </Form.Item>

            
            <Form.Item 
                label="Localização da fazenda"
                rules={[
                    {
                        required: true,
                        message: 'Informe a localização da fazenda.',
                    }
                ]}
                style={{
                    width: '100%'
                }}
            >
                <Space.Compact style={{width: '100%'}}>
                    <Form.Item
                        name="latitude"
                        noStyle
                        // rules={[{ required: true, message: 'Informe a latitude.' }]}
                    >
                        <Input style={{ width: '50%' }} placeholder="Latitude" />
                    </Form.Item>
                    <Form.Item
                        name="longitude"
                        noStyle
                        // rules={[{ required: true, message: 'Informe a longitude.' }]}
                    >
                        <Input style={{ width: '50%' }} placeholder="Longitude" />
                    </Form.Item>
                </Space.Compact>
            </Form.Item>

            <Form.Item
                name="reparationValue"
                label="Valor da indenização"
                rules={[
                {
                    required: true,
                    message: 'Informa o valor da indenização.',
                },
                ]}
            >
                <Input prefix="Ξ" placeholder="Ether" />
            </Form.Item>

            <Form.Item
                name="humidityLimit"
                label="Limite do índice"
                tooltip={{title: 'O valor de comparação da métrica para o pagamento da indenização.', icon: <QuestionCircleOutlined />}}
                rules={[
                {
                    required: true,
                    message: 'Informe o limite do índice.',
                },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="sampleMaxSize"
                label="Número de amostras"
                rules={[
                {
                    required: true,
                    message: 'Informe o número de amostras.',
                },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item 
                label="Coletar a cada"
                rules={[
                {
                    required: true,
                    message: 'Informe o intervalo.',
                }
                ]}
                style={{
                    width: '100%'
                }}
            >
                <Space.Compact style={{width: '100%'}}>
                    <Form.Item
                        name='intervalNumber'
                        noStyle
                        // rules={[{ required: true, message: 'Informe o valor numérico.' }]}
                    >
                        <Input placeholder="Numérico inteiro" />
                    </Form.Item>
                    
                    <Form.Item
                        name='intervalScale'
                        noStyle
                        // rules={[{ required: true, message: 'Informe a escala temporal.' }]}
                    >
                        <Select placeholder="Escala temporal">
                            <Select.Option value="minutes">Minutos</Select.Option>
                            <Select.Option value="hours">Horas  </Select.Option>
                            <Select.Option value="days">Dias   </Select.Option>
                        </Select>
                    </Form.Item>
                </Space.Compact>
            </Form.Item>

            <Form.Item
                name="functionsFund"
                label="Chainlink Functions"
                tooltip={{ title: 'https://chain.link/functions', icon: <QuestionCircleOutlined />}}
                rules={[
                {
                    required: true,
                    message: 'É necessário informar o valor do financiamento.',
                },
                ]}
            >
                <Input prefix="⬡" placeholder='Financiar em Chainlink Token'/>
            </Form.Item>

            <Form.Item
                name="automationFund"
                label="Chainlink Automation"
                tooltip={{ title: 'https://chain.link/automation', icon: <QuestionCircleOutlined /> }}
                rules={[
                {
                    required: true,
                    message: 'É necessário informar o valor do financiamento.',
                },
                ]}
            >
                <Input prefix="⬡" placeholder='Financiar em Chainlink Token'/>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={registerButtonLoading}>
                    Registrar
                </Button>
            </Form.Item>
        </Form>
    )
}