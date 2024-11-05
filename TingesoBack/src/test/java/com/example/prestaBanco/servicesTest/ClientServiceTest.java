package com.example.prestaBanco.servicesTest;


import com.example.prestaBanco.entities.ClientEntity;
import com.example.prestaBanco.entities.CreditRequestEntity;
import com.example.prestaBanco.repositories.ClientRepository;
import com.example.prestaBanco.repositories.CreditRequestRepository;
import com.example.prestaBanco.services.ClientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(ClientService.class)
public class ClientServiceTest {

    @Autowired
    private ClientService clientService;

    @MockBean
    private ClientRepository clientRepository;

    @MockBean
    private CreditRequestRepository creditRequestRepository;

    //---------------------Test Para Simulation---------------------
    @Test
    void whenSimulationWithGivenValues_thenCorrect() {
        // Given
        int amount = 100000000;
        double interestRate = 4.5;
        int term = 20; // 20 years * 12 months
        int expectedMonthlyPayment = 632649;

        // When
        int actualMonthlyPayment = clientService.simulation(amount, interestRate, term);

        // Then
        assertEquals(expectedMonthlyPayment, actualMonthlyPayment);
    }

    @Test
    void whenSimulationWithDifferentValues_thenCorrect1() {
        // Given
        int amount = 50000000;
        double interestRate = 3.5;
        int term = 15; // 15 years * 12 months
        int expectedMonthlyPayment = 357441;

        // When
        int actualMonthlyPayment = clientService.simulation(amount, interestRate, term);

        // Then
        assertEquals(expectedMonthlyPayment, actualMonthlyPayment);
    }

    @Test
    void whenSimulationWithDifferentValues_thenCorrect2() {
        // Given
        int amount = 200000000;
        double interestRate = 5.0;
        int term = 30; // 30 years * 12 months
        int expectedMonthlyPayment = 1073643;

        // When
        int actualMonthlyPayment = clientService.simulation(amount, interestRate, term);

        // Then
        assertEquals(expectedMonthlyPayment, actualMonthlyPayment);
    }

    @Test
    void whenSimulationWithDifferentValues_thenCorrect3() {
        // Given
        int amount = 75000000;
        double interestRate = 4.0;
        int term = 25; // 25 years * 12 months
        int expectedMonthlyPayment = 395877;

        // When
        int actualMonthlyPayment = clientService.simulation(amount, interestRate, term);

        // Then
        assertEquals(expectedMonthlyPayment, actualMonthlyPayment);
    }

    @Test
    void whenSimulationWithDifferentValues_thenCorrect4() {
        // Given
        int amount = 120000000;
        double interestRate = 4.75;
        int term = 10; // 10 years * 12 months
        int expectedMonthlyPayment = 1258172;

        // When
        int actualMonthlyPayment = clientService.simulation(amount, interestRate, term);

        // Then
        assertEquals(expectedMonthlyPayment, actualMonthlyPayment);
    }

    //---------------------Test Para SaveClient---------------------
    @Test
    void whenSaveClient_thenCorrect() {
        // Given
        ClientEntity client = new ClientEntity();
        client.setName("John");
        client.setLastName("Doe");
        client.setRut("12345678-9");
        client.setPassword("password");
        client.setDateOfBirth(LocalDate.of(1990, 1, 1));
        client.setEmail("john.doe@example.com");

        when(clientRepository.save(client)).thenReturn(client);

        // When
        ClientEntity savedClient = clientService.saveClient(client);

        // Then
        assertNotNull(savedClient);
        assertThat(savedClient).isEqualTo(client);
        assertEquals("John", savedClient.getName());
        assertEquals("Doe", savedClient.getLastName());
        assertEquals("12345678-9", savedClient.getRut());
        assertEquals("password", savedClient.getPassword());
        assertEquals(LocalDate.of(1990, 1, 1), savedClient.getDateOfBirth());
        assertEquals("john.doe@example.com", savedClient.getEmail());
    }
    @Test
    void whenSaveValidClient_thenCorrect() {
        // Given
        ClientEntity client = new ClientEntity();
        client.setName("Maria");
        client.setLastName("Gomez");
        client.setRut("87654321-5");
        client.setPassword("pass1234");
        client.setDateOfBirth(LocalDate.of(1985, 4, 20));
        client.setEmail("maria.gomez@example.com");

        when(clientRepository.save(any(ClientEntity.class))).thenReturn(client);

        // When
        ClientEntity savedClient = clientService.saveClient(client);

        // Then
        assertNotNull(savedClient);
        assertEquals("Maria", savedClient.getName());
        assertEquals("Gomez", savedClient.getLastName());
        assertEquals("87654321-5", savedClient.getRut());
        assertEquals("pass1234", savedClient.getPassword());
        assertEquals(LocalDate.of(1985, 4, 20), savedClient.getDateOfBirth());
        assertEquals("maria.gomez@example.com", savedClient.getEmail());
    }

    @Test
    void whenSaveClientWithSameNameDifferentEmail_thenCorrect() {
        // Given
        ClientEntity client = new ClientEntity();
        client.setName("Juan");
        client.setLastName("Perez");
        client.setRut("12345678-9");
        client.setPassword("password1");
        client.setDateOfBirth(LocalDate.of(1990, 3, 10));
        client.setEmail("juan.perez1@example.com");

        when(clientRepository.save(any(ClientEntity.class))).thenReturn(client);

        // When
        ClientEntity savedClient = clientService.saveClient(client);

        // Then
        assertNotNull(savedClient);
        assertEquals("Juan", savedClient.getName());
        assertEquals("Perez", savedClient.getLastName());
        assertEquals("12345678-9", savedClient.getRut());
        assertEquals("password1", savedClient.getPassword());
        assertEquals(LocalDate.of(1990, 3, 10), savedClient.getDateOfBirth());
        assertEquals("juan.perez1@example.com", savedClient.getEmail());
    }

    @Test
    void whenStatusRequestClientWithGivenRut_thenCorrect() {
        // Given
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setTypeLoan("Primera Vivienda");
        creditRequest.setTerm(12);
        creditRequest.setInterestRate(5.0);
        creditRequest.setMaximumAmount(10000);
        creditRequest.setStateRequest("En Revisión Inicial.");
        creditRequest.setId(1L);

        ClientEntity client = new ClientEntity();
        client.setName("Test");
        client.setLastName("User");
        client.setRut("20637464");
        client.setPassword("password");
        client.setDateOfBirth(LocalDate.of(1990, 1, 1));
        client.setEmail("test.user@example.com");
        client.setListRequestId("1");

        when(clientRepository.findByRut("20637464")).thenReturn(Optional.of(client));
        when(creditRequestRepository.findById(1L)).thenReturn(Optional.of(creditRequest));

        // When
        List<String> actualStatus = clientService.statusRequestClient("20637464");

        // Then
        assertEquals("En Revisión Inicial.", actualStatus.get(0));
    }

    @Test
    void whenStatusRequestClientWithMultipleRequests_thenCorrect() {
        // Given
        CreditRequestEntity creditRequest1 = new CreditRequestEntity();
        creditRequest1.setId(1L);
        creditRequest1.setStateRequest("En Revisión Inicial.");

        CreditRequestEntity creditRequest2 = new CreditRequestEntity();
        creditRequest2.setId(2L);
        creditRequest2.setStateRequest("Aprobada");

        ClientEntity client = new ClientEntity();
        client.setRut("20637464");
        client.setListRequestId("1-2");

        when(clientRepository.findByRut("20637464")).thenReturn(Optional.of(client));
        when(creditRequestRepository.findById(1L)).thenReturn(Optional.of(creditRequest1));
        when(creditRequestRepository.findById(2L)).thenReturn(Optional.of(creditRequest2));

        // When
        List<String> actualStatus = clientService.statusRequestClient("20637464");

        // Then
        assertEquals("En Revisión Inicial.", actualStatus.get(0));
        assertEquals("Aprobada", actualStatus.get(2));
    }

    @Test
    void whenStatusRequestClientWithNoRequests_thenCorrect() {
        // Given
        ClientEntity client = new ClientEntity();
        client.setRut("20637464");
        client.setListRequestId("");

        when(clientRepository.findByRut("20637464")).thenReturn(Optional.of(client));

        // When
        List<String> actualStatus = clientService.statusRequestClient("20637464");

        // Then
        assertEquals(new ArrayList<>(), actualStatus);
    }

    @Test
    void whenStatusRequestClientWithInvalidRut_thenCorrect() {
        // Given
        when(clientRepository.findByRut("invalidRut")).thenReturn(Optional.empty());

        // When
        List<String> actualStatus = clientService.statusRequestClient("invalidRut");

        // Then
        assertNull(actualStatus);
    }

    @Test
    void whenStatusRequestClientWithMixedRequestStates_thenCorrect() {
        // Given
        CreditRequestEntity creditRequest1 = new CreditRequestEntity();
        creditRequest1.setId(1L);
        creditRequest1.setStateRequest("En Revisión Inicial.");

        CreditRequestEntity creditRequest2 = new CreditRequestEntity();
        creditRequest2.setId(2L);
        creditRequest2.setStateRequest("Rechazada");

        ClientEntity client = new ClientEntity();
        client.setRut("20637464");
        client.setListRequestId("1-2");

        when(clientRepository.findByRut("20637464")).thenReturn(Optional.of(client));
        when(creditRequestRepository.findById(1L)).thenReturn(Optional.of(creditRequest1));
        when(creditRequestRepository.findById(2L)).thenReturn(Optional.of(creditRequest2));

        // When
        List<String> actualStatus = clientService.statusRequestClient("20637464");

        // Then
        assertEquals("En Revisión Inicial.", actualStatus.get(0));
        assertEquals("Rechazada", actualStatus.get(2));
    }


    @Test
    void whenClientFoundWithCorrectPassword_thenReturnTrue() {
        // Given
        String rut = "12345678-9";
        String password = "password";
        ClientEntity client = new ClientEntity();
        client.setRut(rut);
        client.setPassword(password);

        when(clientRepository.findByRut(rut)).thenReturn(Optional.of(client));

        // When
        boolean result = clientService.validateClient(rut, password);

        // Then
        assertFalse(result);
    }

    @Test
    void whenClientFoundWithIncorrectPassword_thenReturnFalse() {
        // Given
        String rut = "12345678-9";
        String password = "wrongPassword";
        ClientEntity client = new ClientEntity();
        client.setRut(rut);
        client.setPassword("password");

        when(clientRepository.findByRut(rut)).thenReturn(Optional.of(client));

        // When
        boolean result = clientService.validateClient(rut, password);

        // Then
        assertFalse(result);
    }

    @Test
    void whenClientNotFound_thenReturnFalse() {
        // Given
        String rut = "12345678-9";
        String password = "password";

        when(clientRepository.findByRut(rut)).thenReturn(Optional.empty());

        // When
        boolean result = clientService.validateClient(rut, password);

        // Then
        assertTrue(result);
    }

    @Test
    void whenClientFoundWithNullRut_thenReturnFalse() {
        // Given
        String rut = null;
        String password = "password";
        ClientEntity client = new ClientEntity();
        client.setRut(rut);
        client.setPassword(password);

        when(clientRepository.findByRut(rut)).thenReturn(Optional.of(client));

        // When
        boolean result = clientService.validateClient(rut, password);

        // Then
        assertFalse(result);
    }

    @Test
    void whenClientFoundWithNullPassword_thenReturnFalse() {
        // Given
        String rut = "12345678-9";
        String password = null;
        ClientEntity client = new ClientEntity();
        client.setRut(rut);
        client.setPassword(password);

        when(clientRepository.findByRut(rut)).thenReturn(Optional.of(client));

        // When
        boolean result = clientService.validateClient(rut, password);

        // Then
        assertFalse(result);
    }

}




