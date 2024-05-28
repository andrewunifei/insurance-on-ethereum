function mountDonParams(minutesUntilExpiration) {
    const donParams = {
        donId: 'fun-ethereum-sepolia-1',
        slotId: 0,
        minutesUntilExpiration,
        gatewayUrls: [
            "https://01.functions-gateway.testnet.chain.link/",
            "https://02.functions-gateway.testnet.chain.link/"
        ]
    };

    return donParams;
} 


export default mountDonParams;