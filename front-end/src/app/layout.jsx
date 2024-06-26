"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;
import { SignerWrapper } from '@/context';
import CustomMenu from "./components/CustomMenu/CustomMenu";
import { Suspense } from "react";
import Loading from './loading.jsx';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Suspense fallback={<Loading />}>
      <AntdRegistry>
        <SignerWrapper>
          <Layout style={{minHeight:"100vh", background: "#001628", maxWidth: '100vw'}}>
            <Header
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div className="demo-logo" />
              <CustomMenu />
            </Header>
            <Content
              style={{
                display: 'flex',
                borderBottom: 'solid',
                background: "#fff",
                height: '100%',
                width: '100%',
                padding: 40,
                borderRadius: "16px 16px 0 0",
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
            >
                {children}
            </Content>
            <Footer
              style={{
                textAlign: 'center',
                background: '#fff',
                color: "#001628",
                borderRadius: "0 0 10px 10px",
              }}
            >
              Insurance on Ethereum • {new Date().getFullYear()}
            </Footer>
          </Layout>
        </SignerWrapper>
        </AntdRegistry>
        </Suspense>
      </body>
    </html>
  );
}
