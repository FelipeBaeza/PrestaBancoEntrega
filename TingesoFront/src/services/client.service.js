import httpClient from '../http-common';

const simulation = ({ amount, interestRate, term }) => {
  return httpClient.get(`/api/v1/clients/simulation/${amount}/${interestRate}/${term}`);
};

const saveClient = (data) => {
  return httpClient.post('/api/v1/clients/save', data);
};

const login = ({ rut, password }) => {
  return httpClient.get(`/api/v1/clients/login/${rut}/${password}`);
};

const getAllStatus = (rut) => {
  return httpClient.get(`/api/v1/clients/statusRequest/${rut}`);
};

const validateRutAndPassword = ({ rut, password }) => {
  return httpClient.get(`/api/v1/clients/validateRutAndPassword/${rut}/${password}`);
}

const validateRut = (rut) => {
  return httpClient.get(`/api/v1/clients/validateRut/${rut}`);
};

export default { simulation, saveClient, login, getAllStatus, validateRutAndPassword, validateRut };