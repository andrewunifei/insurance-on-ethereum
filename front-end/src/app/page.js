'use client'

import styles from "./page.module.css";
import React from "react";
import { Modal, Button } from "antd";
import { ethers}  from "ethers";

export default function Home() {
  const [provider, setProvider] = React.useState(null);
  const [signer, setSigner] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  React.useEffect(() => {
    async function handleModal() {
      let _provider;

      if (typeof window.ethereum !== "undefined") {
        if(window.ethereum.isMetaMask) {
          _provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(_provider);
        }
        const accounts = await _provider.send("eth_accounts", []); 
        const modal = (accounts.length == 0) ? true : false; 
        setIsModalOpen(modal);
      }
    }
    handleModal();
  }, [])

  async function handleConnection() {
    setConfirmLoading(true);
    try {
      const status = await provider.send("eth_requestAccounts", []);
      if(!status["code"]) {
        setSigner(provider.getSigner());
        setIsModalOpen(false);
      }
    }
    catch(e) {
      console.log(e);
    }
    setConfirmLoading(false);
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  function handleButton() {
    console.log(signer._isSigner)
  }

  return (
      <div>
        < Modal 
          title="Carteira MetaMask"
          open={isModalOpen} 
          okText={'Conectar'}
          onOk={handleConnection}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          closable={false}
        >
          <p>É necessário a extensão carteira MetaMask para interagir com essa aplicação.</p>
          <br />
          <p><span id={styles.conn}>Conecte-se</span> ou instale a carteira no link <a id={styles.link} href="https://metamask.io" target="_blank">https://metamask.io</a></p>
        </ Modal>
        <Button type="primary" onClick={handleButton}>click</Button>
      </div>
  );
}
