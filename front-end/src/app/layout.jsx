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
          <Layout style={{height:"100vh"}}>
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
                padding: '25px 0 0 0',
              }}
            >
              <div
                style={{
                  background: "#fff",
                  height: '100vh',
                  padding: 40,
                  borderRadius: 20,
                }}
              >
                {children}
              </div>
            </Content>
            <Footer
              style={{
                textAlign: 'center',
                background: '#fff'
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
