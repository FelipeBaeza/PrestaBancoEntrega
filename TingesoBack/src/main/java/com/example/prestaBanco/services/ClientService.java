package com.example.prestaBanco.services;

import com.example.prestaBanco.entities.ClientEntity;
import com.example.prestaBanco.entities.CreditRequestEntity;
import com.example.prestaBanco.repositories.ClientRepository;
import com.example.prestaBanco.repositories.CreditRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CreditRequestRepository creditRequestRepository;


    private String validateClientFields(ClientEntity client) {
        // Validar campos obligatorios
        if (client.getName() == null || client.getName().trim().isEmpty()) {
            return "El nombre es obligatorio";
        }
        if (client.getLastName() == null || client.getLastName().trim().isEmpty()) {
            return "El apellido es obligatorio";
        }
        if (client.getRut() == null || client.getRut().trim().isEmpty()) {
            return "El RUT es obligatorio";
        }
        if (client.getPassword() == null || client.getPassword().trim().isEmpty()) {
            return "La contraseña es obligatoria";
        }
        if (client.getEmail() == null || client.getEmail().trim().isEmpty()) {
            return "El email es obligatorio";
        }

        // Validar longitud de campos
        if (client.getName().length() < 2 || client.getName().length() > 50) {
            return "El nombre debe tener entre 2 y 50 caracteres";
        }
        if (client.getLastName().length() < 2 || client.getLastName().length() > 50) {
            return "El apellido debe tener entre 2 y 50 caracteres";
        }

        // Validar formato de RUT (formato chileno: 12345678-9)
        if (!client.getRut().matches("^[0-9]{7,8}-[0-9kK]{1}$")) {
            return "Formato de RUT inválido";
        }

        // Validar formato de email
        if (!client.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            return "Formato de email inválido";
        }

        // Validar contraseña (mínimo 8 caracteres, al menos una mayúscula y un número)
        if (!client.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9]).{8,}$")) {
            return "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número";
        }

        // Validar edad (mayor de 18 años)
        if (client.getDateOfBirth() != null) {
            LocalDate today = LocalDate.now();
            int age = Period.between(client.getDateOfBirth(), today).getYears();
            if (age < 18) {
                return "El cliente debe ser mayor de 18 años";
            }
        }

        // Validar unicidad de RUT
        Optional<ClientEntity> existingClientByRut = clientRepository.findByRut(client.getRut());
        if (existingClientByRut.isPresent()) {
            return "El RUT ya está registrado";
        }
        return null;
    }

    /**
     * Saves a new client after validating all fields.
     * @param client the client entity to be saved
     * @return the saved client entity
     * @throws IllegalArgumentException if any validation fails
     */
    public String saveClient(ClientEntity client) {
        String answer = validateClientFields(client);

        if(answer != null){
            return answer;
        } else {
            clientRepository.save(client);
            return "Cliente guardado";
        }
    }

    /**
     * Validates if a RUT and password combination is available
     * @return true if the combination is available, false otherwise
     */
    public boolean validateClient(String rut, String password) {
        // Validar formato de RUT
        if (!rut.matches("^[0-9]{7,8}-[0-9kK]{1}$")) {
            return false;
        }

        // Validar formato de contraseña
        if (!password.matches("^(?=.*[A-Z])(?=.*[0-9]).{8,}$")) {
           return false;
        }

        Optional<ClientEntity> client = clientRepository.findByRutAndPassword(rut, password);
        if(client.isPresent()){
            return false;
        } else {
            return true;
        }
    }

    // Los demás métodos permanecen igual
    public int simulation(int amount, double interestRate, int term) {
        double p = amount;
        double r = interestRate / 12 / 100;
        double n = term * 12;
        return (int) (p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    }

    public List<String> statusRequestClient(String rut) {
        Optional<ClientEntity> clientOpt = clientRepository.findByRut(rut);
        if (clientOpt.isPresent()) {
            ClientEntity client = clientOpt.get();
            String listRequestId = client.getListRequestId();
            if (listRequestId == null || listRequestId.isEmpty()) {
                return new ArrayList<>();
            }
            String[] listRequestIdArray = listRequestId.split("-");
            List<String> statusList = new ArrayList<>();

            for (String id : listRequestIdArray) {
                Optional<CreditRequestEntity> creditRequest = creditRequestRepository.findById(Long.parseLong(id));
                creditRequest.ifPresent(creditRequestEntity -> statusList.add(creditRequestEntity.getStateRequest()));
                creditRequest.ifPresent(creditRequestEntity -> statusList.add(creditRequestEntity.getId().toString()));
            }
            return statusList;
        }
        return null;
    }

    public List<ClientEntity> allClients() {
        return clientRepository.findAll();
    }

    public boolean validateRut(String rut) {
        ClientEntity client = clientRepository.findByRut(rut).orElse(null);
        return client != null;
    }
}