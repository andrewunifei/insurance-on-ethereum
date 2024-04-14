"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from 'antd';
const { Header, Content, Footer } = Layout;
import { SignerWrapper } from '@/context';
import CustomMenu from "./components/CustomMenu/CustomMenu";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SignerWrapper>
          <Layout>
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
                padding: '25px 0',
              }}
            >
              <div
                style={{
                  background: "#fff",
                  minHeight: 280,
                  padding: 24,
                  borderRadius: 20,
                }}
              >
                {children}
              </div>
            </Content>
            <Footer
              style={{
                textAlign: 'center',
              }}
            >
              Insurance on Ethereum • {new Date().getFullYear()}
            </Footer>
          </Layout>
        </SignerWrapper>
      </body>
    </html>
  );
}
