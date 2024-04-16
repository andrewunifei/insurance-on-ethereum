"use client"

import { createContext, useContext, useState, useEffect } from "react";
import mountInsuranceAPI from "@/utils/InsuranceAPI.sol/mountInsuranceAPI";
import { Modal, notification} from 'antd';
import styles from "./context.module.css";
import { ethers }  from "ethers";
import Image from 'next/image'

const SignerContext = createContext(null);

export function SignerWrapper({children}) {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [insuranceAPI, setInsuranceAPI] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [api, contextHolder] = notification.useNotification();

    function openNotification(payload) {
      api.info({
        message: payload.message,
        description: payload.description,
        placement: 'topRight'
      });
    };

    useEffect(() => {
        async function handleModal() {
          let _provider;
    
          if (typeof window.ethereum !== "undefined") {
            if(window.ethereum.isMetaMask) {
              _provider = new ethers.providers.Web3Provider(window.ethereum);
              setProvider(_provider)
            }
            const _accounts = await _provider.send("eth_accounts", []); 
            if(_accounts.length ==! 0) {
              const _signer = _provider.getSigner();
              setSigner(_signer);
              setIsModalOpen(false);
              setInsuranceAPI(mountInsuranceAPI(_signer));
            }
            else {
              setIsModalOpen(true);
              setSigner(null);
            }
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

    useEffect(() => {
      if(provider){
        window.ethereum.on("accountsChanged", (accounts) => {
          if(accounts.length === 0) setSigner(null);
        });
      }
    }, [provider])

    return (
        <SignerContext.Provider value={{
            signer,
            setSigner,
            setIsModalOpen,
            insuranceAPI,
            openNotification
        }}>
          {contextHolder}
          < Modal 
              title="Carteira MetaMask"
              open={isModalOpen} 
              okText={'Conectar'}
              onOk={handleConnection}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
              closable={false}
          >
            <div style={{display: 'flex',justifyContent: 'center'}}>
              <Image
                src="/metamask.svg"
                width={100}
                height={100}
              /> 
              </div>
              <p>É necessário a extensão carteira MetaMask para interagir com essa aplicação.</p>
              <br />
              <p><span id={styles.conn}>Conecte-se</span> ou instale a carteira no link <a id={styles.link} href="https://metamask.io" target="_blank">https://metamask.io</a></p>
          </ Modal>
              {children}
        </SignerContext.Provider>
    )
}

export function useSignerContext() {
    return useContext(SignerContext);
}