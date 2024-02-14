import { expect } from 'chai';
import ethers from 'ethers';
import blockchain from '../middleware/blockchain.js';
import { buildRequestParameters } from '../mock/mockController.js'
import cbor from 'cbor'
import {
    buildRequestCBOR,
    Location,
    CodeLanguage,
} from '@chainlink/functions-toolkit'

async function decodeEthereumHex(str) {
    const formatedStr = str.slice(2);
    const decodedCBOR = await cbor.decodeAll(formatedStr);

    return decodedCBOR;
}

describe('Controller', async () => {
    const config = {
        computation: '../rules/computation.js',
        args: ["44.34", "10.99"],
        secrets: { apiKey: process.env.OPEN_WEATHER_API_KEY },
        donId: 'fun-ethereum-sepolia-1',
        subscriptionId: 0
    }

    describe('buildRequestParameters', async () => {
        let expectedObjToStr;

        before(async () => {
            const expected = buildRequestCBOR(
                {
                    codeLocation: Location.Inline,
                    codeLanguage: CodeLanguage.JavaScript,
                    source: config.computation,
                    args: config.args
                }
            );
            const CBORExpected = await decodeEthereumHex(expected);
            expectedObjToStr = JSON.stringify(CBORExpected);
        });

        it('Should correctly encode configuration to CBOR', async () => {
            const requestParameters = buildRequestParameters(config);
            const CBORObj = await decodeEthereumHex(requestParameters.requestCBOR);
            const objToStr = JSON.stringify(CBORObj);
    
            expect(objToStr).to.equal(expectedObjToStr);   
        });
    })
});