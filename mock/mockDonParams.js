const donParams = {
    secrets: { apiKey: process.env.OPEN_WEATHER_API_KEY },
    donId: 'fun-ethereum-sepolia-1',
    slotId: 0,
    minutesUntilExpiration: 60,
    gatewayUrls: [
        "https://01.functions-gateway.testnet.chain.link/",
        "https://02.functions-gateway.testnet.chain.link/"
    ]
};

export { donParams };