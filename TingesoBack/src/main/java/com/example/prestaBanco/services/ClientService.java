package com.example.prestaBanco.services;

import com.example.prestaBanco.entities.ClientEntity;
import com.example.prestaBanco.entities.CreditRequestEntity;
import com.example.prestaBanco.repositories.ClientRepository;
import com.example.prestaBanco.repositories.CreditRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CreditRequestRepository creditRequestRepository;



    /**
     * Saves a new client.
     * @param client the client entity to be saved
     * @return the saved client entity
     */
    public ClientEntity saveClient(ClientEntity client) {
        return clientRepository.save(client);
    }


    /**
     * Simulates a loan calculation.
     * @param amount the amount of the loan
     * @param interestRate the interest rate of the loan
     * @param term the term of the loan
     * @return the monthly payment of the loan
     */
    public int simulation(int amount, double interestRate, int term) {
        // Monto del préstamo
        double p = amount;

        // Tasa de interés mensual
        double r = interestRate / 12 / 100;

        // Plazo en meses
        double n = term * 12;

        // Fórmula para calcular la cuota mensual
        int result = (int) (p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

        return result;
    }


    /**
     * statusRequestClient method to get the status of a request
     * @param rut
     * @return the status of the request
     */
    public List<String> statusRequestClient(String rut) {
        Optional<ClientEntity> clientOpt = clientRepository.findByRut(rut);
        if (clientOpt.isPresent()) {
            ClientEntity client = clientOpt.get();
            String listRequestId = client.getListRequestId();
            if (listRequestId == null || listRequestId.isEmpty()) {
                return new ArrayList<>(); // Return an empty list if listRequestId is null or empty
            }
            String[] listRequestIdArray = listRequestId.split("-");
            List<String> statusList = new ArrayList<>();

            for (String id : listRequestIdArray) {
                Optional<CreditRequestEntity> creditRequest = creditRequestRepository.findById(Long.parseLong(id));
                creditRequest.ifPresent(creditRequestEntity -> statusList.add(creditRequestEntity.getStateRequest()));
                creditRequest.ifPresent(creditRequestEntity -> statusList.add(creditRequestEntity.getId().toString()));
            }

            return statusList;
        } else {
            return null;
        }
    }

    public boolean validateClient(String rut, String password) {
        ClientEntity client = clientRepository.findByRut(rut).orElse(null);
        if (client == null) {
            return true;
        } else {
            return false;
        }
    }
}
