import axios from 'axios';

export default axios.create({
    baseURL: `191.235.93.182`,
    headers: {
        "Content-type": "application/json"
    }
});
