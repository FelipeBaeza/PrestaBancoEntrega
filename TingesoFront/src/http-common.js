import axios from 'axios';

export default axios.create({
    baseURL: `http://191.235.93.182`, // Asegúrate de incluir el protocolo
    headers: {
        "Content-type": "application/json"
    }
});