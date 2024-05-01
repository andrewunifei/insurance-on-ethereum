import { Space, Flex } from "antd"

export default function Insurance() {
    return (
        <Flex gap="small" style={{width: '100%'}}>
            <Flex
                vertical={true}
                align="flex-start"
                gap="small"
                style={{
                    background: '#fff',
                    width: '50vw'
                }}
            >
                    <div style={{
                        border: 'solid',
                        borderRadius: 5,
                        borderColor: '#F0F0F0',
                        width: '100%',
                        height: '50%'
                    }}>
                        <Flex gap="large" align="flex-start" style={{
                            borderBottom: 'solid',
                            borderBottomColor: '#F0F0F0',
                            borderBottomStyle: 'dotted',
                            padding: 20
                        }}>
                        <h1>Testing bread 1</h1>
                        </Flex>
                    </div>
                    <div style={{
                        border: 'solid',
                        borderRadius: 5,
                        borderColor: '#F0F0F0',
                        width: '100%',
                        height: '50%'
                    }}>
                        <Flex gap="large" align="flex-start" style={{
                            borderBottom: 'solid',
                            borderBottomColor: '#F0F0F0',
                            borderBottomStyle: 'dotted',
                            padding: 20
                        }}>
                        <h1>Testing bread 2</h1>
                        </Flex>
                    </div>
            </Flex>
            <Flex
                vertical={true}
                gap="large"
                style={{
                    width: '50vw',
                    background: '#fff'
                }}
            >
                  <div style={{
                        border: 'solid',
                        borderRadius: 5,
                        borderColor: '#F0F0F0',
                        width: '100%',
                        height: '100%'
                    }}>
                        <Flex gap="large" align="flex-start" style={{
                            borderBottom: 'solid',
                            borderBottomColor: '#F0F0F0',
                            borderBottomStyle: 'dotted',
                            padding: 20
                        }}>
                        <h1>Testing bread 3</h1>
                        </Flex>
                    </div>
            </Flex>
        </Flex>
    )
}