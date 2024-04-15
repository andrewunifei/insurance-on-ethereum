import React, { useState } from 'react';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Tag, Drawer, Form, Input, Row, Select, Space } from 'antd';

const { Option } = Select;

const customizeRequiredMark = (label, { required }) => (
  <>
    {required ? <Tag color="magenta">Obrigatório</Tag> : <Tag color="warning">Opcional</Tag>}
    {label}
  </>
);

export default function RegisterInstitution({open, setOpen}) {
  function onClose() {
    setOpen(false)
  };

  function register() {

  };

  return (
    <>
      <Drawer
        title="Criar nova Institutição na rede Ethereum"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={register} type="primary">
              Registrar
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" requiredMark={customizeRequiredMark}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id"
                label="ID"
                rules={[{ required: true, message: 'ID é um campo obrigatório' }]}
              >
                <Input placeholder="Identifica uma instituição" />
              </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                  name="name"
                  label="Nome"
                  rules={[{ required: true, message: 'Nome é um campo obrigatório' }]}
                >
                <Input placeholder="Nome da instituição" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[{ required: true, message: 'E-mail é um campo obrigatório' }]}
                >
                <Input placeholder="E-mail oficial para contato" />
              </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                  name="site"
                  label="Site"
                  rules={[{ required: false }]}
                >
                <Input placeholder="Site oficial da instituição" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="capital"
                label="Capital"
                rules={[{ required: true, message: 'Capital é um campo obrigatório' }]}
              >
                <Select placeholder="Selecione o tipo de capital">
                  <Option value="privado">Privado</Option>
                  <Option value="publico">Público</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="origem"
                label="Espaço de existência"
                rules={[{ required: true, message: 'Espaço é um campo obrigatório' }]}
              >
                <Select placeholder="Espaço de existência da instituição">
                  <Option value="fisicao">Físico</Option>
                  <Option value="virtual">Virtual</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
                <Form.Item
                  name="endereco"
                  label="Endereço físico"
                  rules={[{ required: false }]}
                >
                <Input placeholder="Endereço físico da instituiçãoo" />
              </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                  name="estado"
                  label="Estado nacional"
                  rules={[{ required: false }]}
                >
                <Input placeholder="Estado nacional que reside" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.List name="users">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div>
                      <Button danger onClick={() => remove(name)} style={{marginBottom: 5}}>Remover</Button>
                      <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                              name="atributo"
                              label=""
                              rules={[{ required: true, message: "Atributo é um campo obrigatório" }]}
                            >
                            <Input placeholder="Artibuto" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                              name="valor"
                              label=""
                              rules={[{ required: true, message: "Valor é um campo obrigatório" }]}
                            >
                            <Input placeholder="Valor" />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Adicionar informações extra
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};