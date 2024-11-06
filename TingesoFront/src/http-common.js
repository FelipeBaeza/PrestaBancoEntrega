import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'http://191.235.93.182', // Asegúrate de incluir el protocolo
    headers: {
        "Content-type": "application/json"
    }
});

export default httpClient;