import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'http://localhost:8090', // Asegúrate de incluir el protocolo
    headers: {
        "Content-type": "application/json"
    }
});

export default httpClient;