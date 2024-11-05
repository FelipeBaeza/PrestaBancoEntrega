import httpClient from '../http-common';

const dataEvaluation = (data) => {
    return httpClient.post('/api/v1/creditEvaluation/dataEvaluation', data);
}

const totalCosts = (id) => {
    return httpClient.get(`/api/v1/creditEvaluation/totalCosts/${id}`);
}

export default { dataEvaluation, totalCosts};