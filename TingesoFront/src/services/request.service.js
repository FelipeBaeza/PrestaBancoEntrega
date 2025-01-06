import httpClient from '../http-common';

const firstHouse = (data) => {
    return httpClient.post('/api/v1/creditRequest/firstHouse', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const secondHouse = (data) => {
    return httpClient.post('/api/v1/creditRequest/secondHouse', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const commercialProperty = (data) => {
    return httpClient.post('/api/v1/creditRequest/commercialProperty', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const remodeling = (data) => {
    return httpClient.post('/api/v1/creditRequest/remodeling', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const getAllRequests = () => {
    return httpClient.get('/api/v1/creditRequest/allRquestStatus/');
}

const getDocument = (id, documentType) => {
    return httpClient.get(`/api/v1/creditRequest/${id}/documents/${documentType}`);
}

const getRequest = (id) => {
    return httpClient.get(`/api/v1/creditRequest/getRequest/${id}`);
}

const editStates = ({id, status}) => {
    return httpClient.put(`/api/v1/creditRequest/EditStatus/${id}/${status}`);
}

const deleteRequest = (id) => {
    return httpClient.delete(`/api/v1/creditRequest/delete/${id}`);
}

const getLoanTypeInfo = (loanType) => {
    return httpClient.get(`/api/v1/creditRequest/loanTypes/${loanType}`);
};

export default { firstHouse, secondHouse, commercialProperty, remodeling, getAllRequests, getDocument, getRequest, editStates, deleteRequest, getLoanTypeInfo };