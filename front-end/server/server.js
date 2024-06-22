import express from 'express';
import cors from 'cors';
import handleInsurance from './insuranceContract/handleInsurance.js';
import handleInstitution from './institution/handleInstitution.js';
import dotenv  from "dotenv"

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({'message': 'Data incoming from the server...'});
});

app.post('/insurance', async (req, res) => {
    const status = await handleInsurance(req.body);
    let result;
    status.status ? result = {message: 'ok', insuranceContractAddress: status.contractAddress } : result = {message: 'failed'};
    res.json(result);
    console.log('Insurance Contract registration completed. Status sent.');
})

app.post('/institution', async (req, res) => {
    const { status, payload } = await handleInstitution(req.body);
    let result;
    status ? result = {payload} : result = {payload};
    res.json(result);
    console.log('Institution registration completed. Status sent.')
})

app.listen(8080);