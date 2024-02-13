import { expect } from 'chai';
import ethers from 'ethers';
import blockchain from '../middleware/blockchain.js';
import { buildRequestParameters } from '../mock/mockController.js'
import cbor from 'cbor'

describe('Controller', async () => {
    const config = {
        computation: '../rules/computation.js',
        args: ["44.34", "10.99"],
        secrets: { apiKey: process.env.OPEN_WEATHER_API_KEY },
        donId: 'fun-ethereum-sepolia-1',
        subscriptionId: 0
    }

    describe('Should correctly encode Computation to CBOR', async () => {
        const requestParameters = buildRequestParameters(config)

        const uint8Arr = ethers.utils.arrayify(requestParameters.requestCBOR)

        console.log(requestParameters.requestCBOR)
        console.log(ethers.utils.arrayify(requestParameters.requestCBOR))
        const string = new TextDecoder().decode(uint8Arr);
        console.log(string)

        const encoded = cbor.encode(uint8Arr)
        const decoded = encoded.toString()
        console.log(decoded)
    });
});