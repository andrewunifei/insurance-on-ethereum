const blockchain = require('../middleware/blockchain')
const APIManager = require('../middleware/APIManager')
const path = require('node:path')
const fs = require('fs').promises;

/**
 * Script para criar um contrato de API na blockchain Ethereum Sepolia.
 * Escreve o endereço da API em um arquivo de texto
 */

task("createAPI", "Custom task that creates a contract API on Ethereum Sepolia. The address of the contract is written to two files.")
    .addParam("comment", "A mnemonic comment about the API. The comment will be written to APIHistory file alongside the API address.")
    .setAction(async (args) => {
        try {
            const { signer } = await blockchain.interaction()
            const API = await APIManager.createAPI(signer)        
            const fileToWrite = path.resolve(__dirname, '..', 'APIAddress.txt')
            const fileToAppend = path.resolve(__dirname, '..', 'APIHistory.txt')
            await fs.writeFile(fileToWrite, API.address)
            console.log('API address written to \"APIAddress.txt\"')
            await fs.appendFile(fileToAppend, `${API.address} : ${args.comment}\n`)
            console.log('API address appended to \"APIHistory.txt\"')
        }
        catch(e) {
            throw new Error(e)
        }
    })

module.exports = {}