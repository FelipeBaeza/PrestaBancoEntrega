package com.example.prestaBanco.services;

import com.example.prestaBanco.entities.ClientEntity;
import com.example.prestaBanco.entities.CreditRequestEntity;
import com.example.prestaBanco.repositories.CreditRequestRepository;
import com.example.prestaBanco.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;


@Service
public class CreditRequestService {

    @Autowired
    private CreditRequestRepository creditRequestRepository;

    @Autowired
    private ClientRepository clientRepository;


    /**
     * Saves a new credit request for a first house.
     * @param rut
     * @param typeLoan
     * @param term
     * @param interestRate
     * @param maximumAmount
     * @param proofIncome
     * @param creditHistory
     * @param appraisalCertificate
     * @param bankAccountState
     * @param workCertificate
     * @return the saved credit request entity
     * @throws IOException
     */
    public CreditRequestEntity saveFirstHouse(String rut, String typeLoan, int term, double interestRate, int maximumAmount, MultipartFile proofIncome,
                                              MultipartFile creditHistory, MultipartFile appraisalCertificate, MultipartFile bankAccountState, MultipartFile workCertificate) throws IOException {

        if (term <= 0) {
            throw new IllegalArgumentException("Term must be greater than 0");
        }
        if (interestRate <= 0) {
            throw new IllegalArgumentException("Interest rate must be greater than 0");
        }
        if (maximumAmount <= 0) {
            throw new IllegalArgumentException("Maximum amount must be greater than 0");
        }
        if (proofIncome.isEmpty() || creditHistory.isEmpty() || appraisalCertificate.isEmpty() || bankAccountState.isEmpty() || workCertificate.isEmpty()) {
            throw new IllegalArgumentException("All documents must be provided");
        }

        CreditRequestEntity creditClient = new CreditRequestEntity();
        Optional<ClientEntity> clientOpt = clientRepository.findByRut(rut);
        if (clientOpt.isPresent()) {
            ClientEntity client = clientOpt.get();
            creditClient.setTypeLoan(typeLoan);
            creditClient.setTerm(term);
            creditClient.setInterestRate(interestRate);
            creditClient.setMaximumAmount(maximumAmount);
            creditClient.setProofIncome(proofIncome.getBytes());
            creditClient.setCreditHistory(creditHistory.getBytes());
            creditClient.setAppraisalCertificate(appraisalCertificate.getBytes());
            creditClient.setBankAccountState(bankAccountState.getBytes());
            creditClient.setWorkCertificate(workCertificate.getBytes());
            creditClient.setStateRequest("En Revisión Inicial.");
            creditRequestRepository.save(creditClient);

            // Obtiene el valor actual de listRequestId, agrega el nuevo ID y actualiza el campo
            String existingListRequestId = client.getListRequestId();
            String newId = String.valueOf(creditClient.getId());

            // Si ya hay IDs en la lista, añade el nuevo ID separado por un guion; si no, asigna solo el nuevo ID
            if (existingListRequestId == null || existingListRequestId.isEmpty()) {
                client.setListRequestId(newId);
            } else {
                client.setListRequestId(existingListRequestId + "-" + newId);
            }

            // Actualiza el cliente en la base de datos
            clientRepository.save(client);

            return creditClient;
        }
        return null;
    }


    /**
     * Saves a new credit request for a second house.
     * @param rut
     * @param typeLoan
     * @param term
     * @param interestRate
     * @param maximumAmount
     * @param proofIncome
     * @param creditHistory
     * @param appraisalCertificate
     * @param propertyWriting
     * @param bankAccountState
     * @param workCertificate
     * @return the saved credit request entity
     * @throws IOException
     */
    public CreditRequestEntity saveSecondHouse(String rut, String typeLoan, int term, double interestRate, int maximumAmount, MultipartFile proofIncome, MultipartFile creditHistory, MultipartFile appraisalCertificate, MultipartFile propertyWriting, MultipartFile bankAccountState, MultipartFile workCertificate) throws IOException {
        if (term <= 0) {
            throw new IllegalArgumentException("Term must be greater than 0");
        }
        if (interestRate <= 0) {
            throw new IllegalArgumentException("Interest rate must be greater than 0");
        }
        if (proofIncome.isEmpty() || creditHistory.isEmpty() || appraisalCertificate.isEmpty() || propertyWriting.isEmpty() || bankAccountState.isEmpty() || workCertificate.isEmpty()) {
            throw new IllegalArgumentException("All documents must be provided");
        }
        Optional<ClientEntity> clientOpt = clientRepository.findByRut(rut);
        if (clientOpt.isPresent()) {
            ClientEntity client = clientOpt.get();
            CreditRequestEntity creditClient = new CreditRequestEntity();
            creditClient.setTypeLoan(typeLoan);
            creditClient.setTerm(term);
            creditClient.setInterestRate(interestRate);
            creditClient.setMaximumAmount(maximumAmount);
            creditClient.setProofIncome(proofIncome.getBytes());
            creditClient.setCreditHistory(creditHistory.getBytes());
            creditClient.setAppraisalCertificate(appraisalCertificate.getBytes());
            creditClient.setPropertyWriting(propertyWriting.getBytes());
            creditClient.setBankAccountState(bankAccountState.getBytes());
            creditClient.setWorkCertificate(workCertificate.getBytes());
            creditClient.setStateRequest("En Revisión Inicial.");
            creditRequestRepository.save(creditClient);

            String existingListRequestId = client.getListRequestId();
            String newId = String.valueOf(creditClient.getId());

            if (existingListRequestId == null || existingListRequestId.isEmpty()) {
                client.setListRequestId(newId);
            } else {
                client.setListRequestId(existingListRequestId + "-" + newId);
            }

            clientRepository.save(client);

            return creditClient;
        }
        return null;
    }

    /**
     * Saves a new credit request for a commercial property.
     * @param rut
     * @param typeLoan
     * @param term
     * @param interestRate
     * @param maximumAmount
     * @param proofIncome
     * @param appraisalCertificate
     * @param businessFinancialStatement
     * @param businessPlan
     * @param bankAccountState
     * @param workCertificate
     * @return the saved credit request entity
     * @throws IOException
     */
    public CreditRequestEntity saveCommercialProperty(String rut, String typeLoan, int term, double interestRate, int maximumAmount, MultipartFile proofIncome, MultipartFile appraisalCertificate, MultipartFile businessFinancialStatement, MultipartFile businessPlan, MultipartFile bankAccountState, MultipartFile workCertificate) throws IOException {
        if (term <= 0) {
            throw new IllegalArgumentException("Term must be greater than 0");
        }
        if (interestRate <= 0) {
            throw new IllegalArgumentException("Interest rate must be greater than 0");
        }
        if (proofIncome.isEmpty() || appraisalCertificate.isEmpty() || businessFinancialStatement.isEmpty() || businessPlan.isEmpty() || bankAccountState.isEmpty() || workCertificate.isEmpty()) {
            throw new IllegalArgumentException("All documents must be provided");
        }
        Optional<ClientEntity> clientOpt = clientRepository.findByRut(rut);
        if (clientOpt.isPresent()) {
            ClientEntity client = clientOpt.get();
            CreditRequestEntity creditClient = new CreditRequestEntity();
            creditClient.setTypeLoan(typeLoan);
            creditClient.setTerm(term);
            creditClient.setInterestRate(interestRate);
            creditClient.setMaximumAmount(maximumAmount);
            creditClient.setProofIncome(proofIncome.getBytes());
            creditClient.setAppraisalCertificate(appraisalCertificate.getBytes());
            creditClient.setBusinessFinancialStatement(businessFinancialStatement.getBytes());
            creditClient.setBusinessPlan(businessPlan.getBytes());
            creditClient.setBankAccountState(bankAccountState.getBytes());
            creditClient.setWorkCertificate(workCertificate.getBytes());
            creditClient.setStateRequest("En Revisión Inicial.");
            creditRequestRepository.save(creditClient);

            String existingListRequestId = client.getListRequestId();
            String newId = String.valueOf(creditClient.getId());

            if (existingListRequestId == null || existingListRequestId.isEmpty()) {
                client.setListRequestId(newId);
            } else {
                client.setListRequestId(existingListRequestId + "-" + newId);
            }

            clientRepository.save(client);

            return creditClient;
        }
        return null;
    }


    /**
     * Saves a new credit request for a remodeling.
     * @param rut
     * @param typeLoan
     * @param term
     * @param interestRate
     * @param maximumAmount
     * @param proofIncome
     * @param appraisalCertificate
     * @param remodelingBudget
     * @param bankAccountState
     * @param workCertificate
     * @return the saved credit request entity
     * @throws IOException
     */
    public CreditRequestEntity saveRemodeling(String rut, String typeLoan, int term, double interestRate, int maximumAmount, MultipartFile proofIncome, MultipartFile appraisalCertificate, MultipartFile remodelingBudget, MultipartFile bankAccountState, MultipartFile workCertificate) throws IOException {
        if (term <= 0) {
            throw new IllegalArgumentException("Term must be greater than 0");
        }
        if (interestRate <= 0) {
            throw new IllegalArgumentException("Interest rate must be greater than 0");
        }
        if (proofIncome.isEmpty() || appraisalCertificate.isEmpty() || remodelingBudget.isEmpty() || bankAccountState.isEmpty() || workCertificate.isEmpty()) {
            throw new IllegalArgumentException("All documents must be provided");
        }
        Optional<ClientEntity> clientOpt = clientRepository.findByRut(rut);
        if (clientOpt.isPresent()) {
            ClientEntity client = clientOpt.get();
            CreditRequestEntity creditClient = new CreditRequestEntity();
            creditClient.setTypeLoan(typeLoan);
            creditClient.setTerm(term);
            creditClient.setInterestRate(interestRate);
            creditClient.setMaximumAmount(maximumAmount);
            creditClient.setProofIncome(proofIncome.getBytes());
            creditClient.setAppraisalCertificate(appraisalCertificate.getBytes());
            creditClient.setRemodelingBudget(remodelingBudget.getBytes());
            creditClient.setBankAccountState(bankAccountState.getBytes());
            creditClient.setWorkCertificate(workCertificate.getBytes());
            creditClient.setStateRequest("En Revisión Inicial.");
            creditRequestRepository.save(creditClient);

            String existingListRequestId = client.getListRequestId();
            String newId = String.valueOf(creditClient.getId());

            if (existingListRequestId == null || existingListRequestId.isEmpty()) {
                client.setListRequestId(newId);
            } else {
                client.setListRequestId(existingListRequestId + "-" + newId);
            }

            clientRepository.save(client);

            return creditClient;
        }
        return null;
    }


    /**
     * Save a new list whit the rut, name, lastName, the state of the request and the id of the request
     * @return a list with the information of the clients
     */
    public List<Map<String, Object>> getClientsWithCreditStatus() {
        List<ClientEntity> clients = clientRepository.findAll();
        List<Map<String, Object>> clientsWithCreditStatus = new ArrayList<>();

        for (ClientEntity client : clients) {
            String listRequestId = client.getListRequestId();
            if (listRequestId == null || listRequestId.isEmpty()) {
                continue; // Skip clients with no credit requests
            }
            String[] listRequestIdArray = listRequestId.split("-");
            for (String id : listRequestIdArray) {
                Optional<CreditRequestEntity> creditRequest = creditRequestRepository.findById(Long.parseLong(id));
                if (creditRequest.isPresent()) {
                    Map<String, Object> clientStatus = new HashMap<>();
                    clientStatus.put("rut", client.getRut());
                    clientStatus.put(("typeLoan"), creditRequest.get().getTypeLoan());
                    clientStatus.put("name", client.getName());
                    clientStatus.put("lastName", client.getLastName());
                    clientStatus.put("status", creditRequest.get().getStateRequest());
                    clientStatus.put("id", creditRequest.get().getId());
                    clientsWithCreditStatus.add(clientStatus);
                }
            }
        }

        return clientsWithCreditStatus;
    }



    /**
     * Get a specific document by type for the credit request
     * @param id
     * @param documentType
     * @return the specified document
     */
    public Optional<byte[]> getCreditDocumentByType(Long id, String documentType) {
        Optional<CreditRequestEntity> creditRequestOpt = creditRequestRepository.findById(id);

        if (creditRequestOpt.isPresent()) {
            CreditRequestEntity creditRequest = creditRequestOpt.get();

            byte[] document = switch (documentType) {
                case "proofIncome" -> creditRequest.getProofIncome();
                case "creditHistory" -> creditRequest.getCreditHistory();
                case "appraisalCertificate" -> creditRequest.getAppraisalCertificate();
                case "bankAccountState" -> creditRequest.getBankAccountState();
                case "workCertificate" -> creditRequest.getWorkCertificate();
                case "propertyWriting" -> creditRequest.getPropertyWriting();
                case "businessFinancialStatement" -> creditRequest.getBusinessFinancialStatement();
                case "businessPlan" -> creditRequest.getBusinessPlan();
                case "remodelingBudget" -> creditRequest.getRemodelingBudget();
                default -> null;
            };

            if (document != null && document.length > 0) {
                return Optional.of(document);
            }
        }

        return Optional.empty();
    }


    /**
     * get the request of the credit whit the id, type of loan, term, interest rate, maximum amount and state of the request
     * @param id
     * @return the request of the credit
     */
    public List<Map<String, Object>> getRequest(Long id) {
        if (id == null) {
            return new ArrayList<>();
        }
        Optional<CreditRequestEntity> creditRequestOpt = creditRequestRepository.findById(id);
        if (creditRequestOpt.isPresent()) {
            CreditRequestEntity creditRequest = creditRequestOpt.get();
            Map<String, Object> requestInfo = new HashMap<>();
            requestInfo.put("id", creditRequest.getId());
            requestInfo.put("typeLoan", creditRequest.getTypeLoan());
            requestInfo.put("term", creditRequest.getTerm());
            requestInfo.put("interestRate", creditRequest.getInterestRate());
            requestInfo.put("maximumAmount", creditRequest.getMaximumAmount());
            requestInfo.put("stateRequest", creditRequest.getStateRequest());
            return Collections.singletonList(requestInfo);
        } else {
            return new ArrayList<>();
        }
    }

    /**
     * Edit the status of the request
     * @param state
     * @param id
     * @return the status of the request
     */
    public String editStatus(String state, Long id) {
        Optional<CreditRequestEntity> creditRequestOpt = creditRequestRepository.findById(id);
        if (creditRequestOpt.isPresent()) {
            CreditRequestEntity creditRequest = creditRequestOpt.get();
            switch (state) {
                case "E2":
                    creditRequest.setStateRequest("Pendiente de Documentación");
                    break;
                case "E3":
                    creditRequest.setStateRequest("En Evaluación");
                    break;
                case "E4":
                    creditRequest.setStateRequest("Pre-Aprobada");
                    break;
                case "E5":
                    creditRequest.setStateRequest("En Aprobación Final");
                    break;
                case "E6":
                    creditRequest.setStateRequest("Aprobada");
                    break;
                case "E7":
                    creditRequest.setStateRequest("Rechazada");
                    break;
                case "E8":
                    creditRequest.setStateRequest("Cancelada por el Cliente");
                    break;
                case "E9":
                    creditRequest.setStateRequest("En Desembolso");
                    break;
                default:
                    throw new IllegalArgumentException("Estado no reconocido");
            }
            creditRequestRepository.save(creditRequest);
            return "Estado actualizado correctamente";
        } else {
            return "Solicitud de crédito no encontrada";
        }
    }

    /**
     * Find the credit request by the id
     * @param id
     * @return the credit request
     */
    public CreditRequestEntity findById(Long id) {
        if (id == null) {
            return null;
        }
        return creditRequestRepository.findById(id).orElse(null);
    }

    public boolean deleteRequest(Long id) {
        if (id == null) {
            return false;
        }
        creditRequestRepository.deleteById(id);
        return true;
    }

    public Map<String, String> getLoanTypeInfo(String loanType) {
        Map<String, Map<String, String>> loanTypes = new HashMap<>();

        // Primera Vivienda
        Map<String, String> firstHouse = new HashMap<>();
        firstHouse.put("Plazo", "30 años");
        firstHouse.put("Tasa Interés (Anual)", "3.5% - 5.0%");
        loanTypes.put("Primera Vivienda", firstHouse);

        // Segunda Vivienda
        Map<String, String> secondHouse = new HashMap<>();
        secondHouse.put("Plazo", "20 años");
        secondHouse.put("Tasa Interés (Anual)", "4.0% - 6.0%");
        loanTypes.put("Segunda Vivienda", secondHouse);

        // Propiedades Comerciales
        Map<String, String> commercialProperty = new HashMap<>();
        commercialProperty.put("Plazo", "25 años");
        commercialProperty.put("Tasa Interés (Anual)", "5.0% - 7.0%");
        loanTypes.put("Propiedades Comerciales", commercialProperty);

        // Remodelación
        Map<String, String> remodeling = new HashMap<>();
        remodeling.put("Plazo", "15 años");
        remodeling.put("Tasa Interés (Anual)", "4.5% - 6.0%");
        loanTypes.put("Remodelación", remodeling);

        return loanTypes.getOrDefault(loanType, new HashMap<>());
    }
}
