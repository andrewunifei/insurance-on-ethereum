/**
 * >>> Esse mock NÃO faz uso de secrets <<<
 * Porque secrets necessita uma conexão com uma network externa para comunicar com o DON
 */

import * as ethers from 'ethers'
import {
    buildRequestCBOR,
    Location,
    CodeLanguage,
} from '@chainlink/functions-toolkit'

function buildRequestParameters(config) {
    const requestCBOR = buildRequestCBOR(
        {
            codeLocation: Location.Inline,
            codeLanguage: CodeLanguage.JavaScript,
            source: config.computation,
            args: config.args
        }
    )

    return { 
        requestCBOR,    
        subscriptionId: config.subscriptionId,
        bytes32DonId: ethers.utils.formatBytes32String(config.donId)
     }
}

export { buildRequestParameters }