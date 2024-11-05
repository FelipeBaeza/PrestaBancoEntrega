package com.example.prestaBanco.servicesTest;

import com.example.prestaBanco.entities.ClientEntity;
import com.example.prestaBanco.entities.CreditRequestEntity;
import com.example.prestaBanco.repositories.ClientRepository;
import com.example.prestaBanco.repositories.CreditRequestRepository;
import com.example.prestaBanco.services.CreditRequestService;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@WebMvcTest(MockitoExtension.class)
public class CreditRequestServiceTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private CreditRequestRepository creditRequestRepository;

    @InjectMocks
    private CreditRequestService creditRequestService;

    public CreditRequestServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveFirstHouse_ValidInput() throws IOException {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        ClientEntity client = new ClientEntity();
        client.setRut(rut);
        when(clientRepository.findByRut(rut)).thenReturn(Optional.of(client));

        CreditRequestEntity savedCreditRequest = new CreditRequestEntity();
        when(creditRequestRepository.save(any(CreditRequestEntity.class))).thenReturn(savedCreditRequest);

        CreditRequestEntity result = creditRequestService.saveFirstHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, bankAccountState, workCertificate);

        assertNotNull(result);
        verify(clientRepository, times(1)).findByRut(rut);
        verify(creditRequestRepository, times(1)).save(any(CreditRequestEntity.class));
    }

    @Test
    public void testSaveFirstHouse_InvalidTerm() {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 0;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveFirstHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveFirstHouse_InvalidInterestRate() {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 20;
        double interestRate = 0;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveFirstHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveFirstHouse_InvalidMaximumAmount() {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 0;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveFirstHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveFirstHouse_MissingDocuments() {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", new byte[0]);
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveFirstHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveSecondHouse_ValidInput() throws IOException {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile propertyWriting = new MockMultipartFile("file", "propertyWriting.pdf", "application/pdf", "propertyWriting".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        ClientEntity client = new ClientEntity();
        client.setRut(rut);
        when(clientRepository.findByRut(rut)).thenReturn(Optional.of(client));

        CreditRequestEntity savedCreditRequest = new CreditRequestEntity();
        when(creditRequestRepository.save(any(CreditRequestEntity.class))).thenReturn(savedCreditRequest);

        CreditRequestEntity result = creditRequestService.saveSecondHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, propertyWriting, bankAccountState, workCertificate);

        assertNotNull(result);
        verify(clientRepository, times(1)).findByRut(rut);
        verify(creditRequestRepository, times(1)).save(any(CreditRequestEntity.class));
    }

    @Test
    public void testSaveSecondHouse_ClientNotFound() throws IOException {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile propertyWriting = new MockMultipartFile("file", "propertyWriting.pdf", "application/pdf", "propertyWriting".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        when(clientRepository.findByRut(rut)).thenReturn(Optional.empty());

        CreditRequestEntity result = creditRequestService.saveSecondHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, propertyWriting, bankAccountState, workCertificate);

        assertNull(result);
        verify(clientRepository, times(1)).findByRut(rut);
        verify(creditRequestRepository, times(0)).save(any(CreditRequestEntity.class));
    }

    @Test
    public void testSaveSecondHouse_EmptyDocuments() {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", new byte[0]);
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", new byte[0]);
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", new byte[0]);
        MultipartFile propertyWriting = new MockMultipartFile("file", "propertyWriting.pdf", "application/pdf", new byte[0]);
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", new byte[0]);
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveSecondHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, propertyWriting, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveSecondHouse_InvalidTerm() {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 0;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile propertyWriting = new MockMultipartFile("file", "propertyWriting.pdf", "application/pdf", "propertyWriting".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveSecondHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, propertyWriting, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveSecondHouse_InvalidInterestRate() {
        String rut = "12345678-9";
        String typeLoan = "Mortgage";
        int term = 20;
        double interestRate = 0;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile creditHistory = new MockMultipartFile("file", "creditHistory.pdf", "application/pdf", "creditHistory".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile propertyWriting = new MockMultipartFile("file", "propertyWriting.pdf", "application/pdf", "propertyWriting".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveSecondHouse(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, creditHistory, appraisalCertificate, propertyWriting, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveCommercialProperty_ValidInput() throws IOException {
        String rut = "12345678-9";
        String typeLoan = "Commercial";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile businessFinancialStatement = new MockMultipartFile("file", "businessFinancialStatement.pdf", "application/pdf", "businessFinancialStatement".getBytes());
        MultipartFile businessPlan = new MockMultipartFile("file", "businessPlan.pdf", "application/pdf", "businessPlan".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        ClientEntity client = new ClientEntity();
        client.setRut(rut);
        when(clientRepository.findByRut(rut)).thenReturn(Optional.of(client));

        CreditRequestEntity savedCreditRequest = new CreditRequestEntity();
        when(creditRequestRepository.save(any(CreditRequestEntity.class))).thenReturn(savedCreditRequest);

        CreditRequestEntity result = creditRequestService.saveCommercialProperty(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, businessFinancialStatement, businessPlan, bankAccountState, workCertificate);

        assertNotNull(result);
        verify(clientRepository, times(1)).findByRut(rut);
        verify(creditRequestRepository, times(1)).save(any(CreditRequestEntity.class));
    }

    @Test
    public void testSaveCommercialProperty_ClientNotFound() throws IOException {
        String rut = "12345678-9";
        String typeLoan = "Commercial";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile businessFinancialStatement = new MockMultipartFile("file", "businessFinancialStatement.pdf", "application/pdf", "businessFinancialStatement".getBytes());
        MultipartFile businessPlan = new MockMultipartFile("file", "businessPlan.pdf", "application/pdf", "businessPlan".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        when(clientRepository.findByRut(rut)).thenReturn(Optional.empty());

        CreditRequestEntity result = creditRequestService.saveCommercialProperty(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, businessFinancialStatement, businessPlan, bankAccountState, workCertificate);

        assertNull(result);
        verify(clientRepository, times(1)).findByRut(rut);
        verify(creditRequestRepository, times(0)).save(any(CreditRequestEntity.class));
    }

    @Test
    public void testSaveCommercialProperty_EmptyDocuments() {
        String rut = "12345678-9";
        String typeLoan = "Commercial";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", new byte[0]);
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", new byte[0]);
        MultipartFile businessFinancialStatement = new MockMultipartFile("file", "businessFinancialStatement.pdf", "application/pdf", new byte[0]);
        MultipartFile businessPlan = new MockMultipartFile("file", "businessPlan.pdf", "application/pdf", new byte[0]);
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", new byte[0]);
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveCommercialProperty(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, businessFinancialStatement, businessPlan, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveCommercialProperty_InvalidTerm() {
        String rut = "12345678-9";
        String typeLoan = "Commercial";
        int term = 0;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile businessFinancialStatement = new MockMultipartFile("file", "businessFinancialStatement.pdf", "application/pdf", "businessFinancialStatement".getBytes());
        MultipartFile businessPlan = new MockMultipartFile("file", "businessPlan.pdf", "application/pdf", "businessPlan".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveCommercialProperty(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, businessFinancialStatement, businessPlan, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveCommercialProperty_InvalidInterestRate() {
        String rut = "12345678-9";
        String typeLoan = "Commercial";
        int term = 20;
        double interestRate = 0;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile businessFinancialStatement = new MockMultipartFile("file", "businessFinancialStatement.pdf", "application/pdf", "businessFinancialStatement".getBytes());
        MultipartFile businessPlan = new MockMultipartFile("file", "businessPlan.pdf", "application/pdf", "businessPlan".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveCommercialProperty(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, businessFinancialStatement, businessPlan, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveRemodeling_ValidInput() throws IOException {
        String rut = "12345678-9";
        String typeLoan = "Remodeling";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile remodelingBudget = new MockMultipartFile("file", "remodelingBudget.pdf", "application/pdf", "remodelingBudget".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        ClientEntity client = new ClientEntity();
        client.setRut(rut);
        when(clientRepository.findByRut(rut)).thenReturn(Optional.of(client));

        CreditRequestEntity savedCreditRequest = new CreditRequestEntity();
        when(creditRequestRepository.save(any(CreditRequestEntity.class))).thenReturn(savedCreditRequest);

        CreditRequestEntity result = creditRequestService.saveRemodeling(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, remodelingBudget, bankAccountState, workCertificate);

        assertNotNull(result);
        verify(clientRepository, times(1)).findByRut(rut);
        verify(creditRequestRepository, times(1)).save(any(CreditRequestEntity.class));
    }

    @Test
    public void testSaveRemodeling_ClientNotFound() throws IOException {
        String rut = "12345678-9";
        String typeLoan = "Remodeling";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile remodelingBudget = new MockMultipartFile("file", "remodelingBudget.pdf", "application/pdf", "remodelingBudget".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        when(clientRepository.findByRut(rut)).thenReturn(Optional.empty());

        CreditRequestEntity result = creditRequestService.saveRemodeling(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, remodelingBudget, bankAccountState, workCertificate);

        assertNull(result);
        verify(clientRepository, times(1)).findByRut(rut);
        verify(creditRequestRepository, times(0)).save(any(CreditRequestEntity.class));
    }

    @Test
    public void testSaveRemodeling_EmptyDocuments() {
        String rut = "12345678-9";
        String typeLoan = "Remodeling";
        int term = 20;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", new byte[0]);
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", new byte[0]);
        MultipartFile remodelingBudget = new MockMultipartFile("file", "remodelingBudget.pdf", "application/pdf", new byte[0]);
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", new byte[0]);
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", new byte[0]);

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveRemodeling(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, remodelingBudget, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveRemodeling_InvalidTerm() {
        String rut = "12345678-9";
        String typeLoan = "Remodeling";
        int term = 0;
        double interestRate = 4.5;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile remodelingBudget = new MockMultipartFile("file", "remodelingBudget.pdf", "application/pdf", "remodelingBudget".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveRemodeling(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, remodelingBudget, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testSaveRemodeling_InvalidInterestRate() {
        String rut = "12345678-9";
        String typeLoan = "Remodeling";
        int term = 20;
        double interestRate = 0;
        int maximumAmount = 100000000;
        MultipartFile proofIncome = new MockMultipartFile("file", "proofIncome.pdf", "application/pdf", "proofIncome".getBytes());
        MultipartFile appraisalCertificate = new MockMultipartFile("file", "appraisalCertificate.pdf", "application/pdf", "appraisalCertificate".getBytes());
        MultipartFile remodelingBudget = new MockMultipartFile("file", "remodelingBudget.pdf", "application/pdf", "remodelingBudget".getBytes());
        MultipartFile bankAccountState = new MockMultipartFile("file", "bankAccountState.pdf", "application/pdf", "bankAccountState".getBytes());
        MultipartFile workCertificate = new MockMultipartFile("file", "workCertificate.pdf", "application/pdf", "workCertificate".getBytes());

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.saveRemodeling(rut, typeLoan, term, interestRate, maximumAmount, proofIncome, appraisalCertificate, remodelingBudget, bankAccountState, workCertificate);
        });
    }

    @Test
    public void testGetClientsWithCreditStatus_ValidClientWithRequests() {
        ClientEntity client = new ClientEntity();
        client.setRut("12345678-9");
        client.setName("John");
        client.setLastName("Doe");
        client.setListRequestId("1-2");

        CreditRequestEntity creditRequest1 = new CreditRequestEntity();
        creditRequest1.setId(1L);
        creditRequest1.setStateRequest("Approved");

        CreditRequestEntity creditRequest2 = new CreditRequestEntity();
        creditRequest2.setId(2L);
        creditRequest2.setStateRequest("Pending");

        when(clientRepository.findAll()).thenReturn(Collections.singletonList(client));
        when(creditRequestRepository.findById(1L)).thenReturn(Optional.of(creditRequest1));
        when(creditRequestRepository.findById(2L)).thenReturn(Optional.of(creditRequest2));

        List<Map<String, Object>> result = creditRequestService.getClientsWithCreditStatus();

        assertEquals(2, result.size());
        assertEquals("12345678-9", result.get(0).get("rut"));
        assertEquals("John", result.get(0).get("name"));
        assertEquals("Doe", result.get(0).get("lastName"));
        assertEquals("Approved", result.get(0).get("status"));
        assertEquals(1L, result.get(0).get("id"));
        assertEquals("Pending", result.get(1).get("status"));
        assertEquals(2L, result.get(1).get("id"));
    }

    @Test
    public void testGetClientsWithCreditStatus_ClientWithoutRequests() {
        ClientEntity client = new ClientEntity();
        client.setRut("12345678-9");
        client.setName("John");
        client.setLastName("Doe");
        client.setListRequestId("");

        when(clientRepository.findAll()).thenReturn(Collections.singletonList(client));

        List<Map<String, Object>> result = creditRequestService.getClientsWithCreditStatus();

        assertTrue(result.isEmpty());
    }


    @Test
    public void testGetClientsWithCreditStatus_MultipleClients() {
        ClientEntity client1 = new ClientEntity();
        client1.setRut("12345678-9");
        client1.setName("John");
        client1.setLastName("Doe");
        client1.setListRequestId("1");

        ClientEntity client2 = new ClientEntity();
        client2.setRut("98765432-1");
        client2.setName("Jane");
        client2.setLastName("Smith");
        client2.setListRequestId("2");

        CreditRequestEntity creditRequest1 = new CreditRequestEntity();
        creditRequest1.setId(1L);
        creditRequest1.setStateRequest("Approved");

        CreditRequestEntity creditRequest2 = new CreditRequestEntity();
        creditRequest2.setId(2L);
        creditRequest2.setStateRequest("Pending");

        when(clientRepository.findAll()).thenReturn(Arrays.asList(client1, client2));
        when(creditRequestRepository.findById(1L)).thenReturn(Optional.of(creditRequest1));
        when(creditRequestRepository.findById(2L)).thenReturn(Optional.of(creditRequest2));

        List<Map<String, Object>> result = creditRequestService.getClientsWithCreditStatus();

        assertEquals(2, result.size());
        assertEquals("12345678-9", result.get(0).get("rut"));
        assertEquals("John", result.get(0).get("name"));
        assertEquals("Doe", result.get(0).get("lastName"));
        assertEquals("Approved", result.get(0).get("status"));
        assertEquals(1L, result.get(0).get("id"));
        assertEquals("98765432-1", result.get(1).get("rut"));
        assertEquals("Jane", result.get(1).get("name"));
        assertEquals("Smith", result.get(1).get("lastName"));
        assertEquals("Pending", result.get(1).get("status"));
        assertEquals(2L, result.get(1).get("id"));
    }

    @Test
    public void testGetClientsWithCreditStatus_NoClients() {
        when(clientRepository.findAll()).thenReturn(Collections.emptyList());

        List<Map<String, Object>> result = creditRequestService.getClientsWithCreditStatus();

        assertTrue(result.isEmpty());
    }

    @Test
    public void testGetCreditDocumentByType_ValidIdAndDocumentType() {
        Long id = 1L;
        String documentType = "proofIncome";
        byte[] document = "proofIncomeDocument".getBytes();

        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setProofIncome(document);

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        Optional<byte[]> result = creditRequestService.getCreditDocumentByType(id, documentType);

        assertTrue(result.isPresent());
        assertArrayEquals(document, result.get());
    }

    @Test
    public void testGetCreditDocumentByType_ValidIdAndInvalidDocumentType() {
        Long id = 1L;
        String documentType = "invalidType";

        CreditRequestEntity creditRequest = new CreditRequestEntity();

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        Optional<byte[]> result = creditRequestService.getCreditDocumentByType(id, documentType);

        assertFalse(result.isPresent());
    }

    @Test
    public void testGetCreditDocumentByType_InvalidId() {
        Long id = 1L;
        String documentType = "proofIncome";

        when(creditRequestRepository.findById(id)).thenReturn(Optional.empty());

        Optional<byte[]> result = creditRequestService.getCreditDocumentByType(id, documentType);

        assertFalse(result.isPresent());
    }

    @Test
    public void testGetCreditDocumentByType_ValidIdAndEmptyDocument() {
        Long id = 1L;
        String documentType = "proofIncome";
        byte[] document = new byte[0];

        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setProofIncome(document);

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        Optional<byte[]> result = creditRequestService.getCreditDocumentByType(id, documentType);

        assertFalse(result.isPresent());
    }

    @Test
    public void testGetCreditDocumentByType_ValidIdAndNullDocument() {
        Long id = 1L;
        String documentType = "proofIncome";

        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setProofIncome(null);

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        Optional<byte[]> result = creditRequestService.getCreditDocumentByType(id, documentType);

        assertFalse(result.isPresent());
    }

    @Test
    public void testGetRequest_ValidId() {
        Long id = 1L;
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setId(id);
        creditRequest.setTypeLoan("Mortgage");
        creditRequest.setTerm(20);
        creditRequest.setInterestRate(4.5);
        creditRequest.setMaximumAmount(100000000);
        creditRequest.setStateRequest("Approved");

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        List<Map<String, Object>> result = creditRequestService.getRequest(id);

        assertEquals(1, result.size());
        assertEquals(id, result.get(0).get("id"));
        assertEquals("Mortgage", result.get(0).get("typeLoan"));
        assertEquals(20, result.get(0).get("term"));
        assertEquals(4.5, result.get(0).get("interestRate"));
        assertEquals(100000000, result.get(0).get("maximumAmount"));
        assertEquals("Approved", result.get(0).get("stateRequest"));
    }

    @Test
    public void testGetRequest_NullId() {
        List<Map<String, Object>> result = creditRequestService.getRequest(null);

        assertTrue(result.isEmpty());
    }

    @Test
    public void testGetRequest_RequestNotFound() {
        Long id = 1L;

        when(creditRequestRepository.findById(id)).thenReturn(Optional.empty());

        List<Map<String, Object>> result = creditRequestService.getRequest(id);

        assertTrue(result.isEmpty());
    }

    @Test
    public void testGetRequest_EmptyFields() {
        Long id = 1L;
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setId(id);
        creditRequest.setTypeLoan(null);
        creditRequest.setTerm(0);
        creditRequest.setInterestRate(0.0);
        creditRequest.setMaximumAmount(0);
        creditRequest.setStateRequest(null);

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        List<Map<String, Object>> result = creditRequestService.getRequest(id);

        assertEquals(1, result.size());
        assertEquals(id, result.get(0).get("id"));
        assertNull(result.get(0).get("typeLoan"));
        assertEquals(0, result.get(0).get("term"));
        assertEquals(0.0, result.get(0).get("interestRate"));
        assertEquals(0, result.get(0).get("maximumAmount"));
        assertNull(result.get(0).get("stateRequest"));
    }

    @Test
    public void testGetRequest_InvalidId() {
        Long id = -1L;

        when(creditRequestRepository.findById(id)).thenReturn(Optional.empty());

        List<Map<String, Object>> result = creditRequestService.getRequest(id);

        assertTrue(result.isEmpty());
    }

    @Test
    public void testEditStatus_ValidStateE2() {
        Long id = 1L;
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        String result = creditRequestService.editStatus("E2", id);

        assertEquals("Estado actualizado correctamente", result);
        assertEquals("Pendiente de Documentación", creditRequest.getStateRequest());
        verify(creditRequestRepository, times(1)).save(creditRequest);
    }

    @Test
    public void testEditStatus_ValidStateE6() {
        Long id = 1L;
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        String result = creditRequestService.editStatus("E6", id);

        assertEquals("Estado actualizado correctamente", result);
        assertEquals("Aprobada", creditRequest.getStateRequest());
        verify(creditRequestRepository, times(1)).save(creditRequest);
    }

    @Test
    public void testEditStatus_InvalidState2() {
        Long id = 1L;
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.editStatus("InvalidState", id);
        });
        verify(creditRequestRepository, times(0)).save(creditRequest);
    }

    @Test
    public void testEditStatus_RequestNotFound() {
        Long id = 1L;
        when(creditRequestRepository.findById(id)).thenReturn(Optional.empty());

        String result = creditRequestService.editStatus("E2", id);

        assertEquals("Solicitud de crédito no encontrada", result);
        verify(creditRequestRepository, times(0)).save(any(CreditRequestEntity.class));
    }

    @Test
    public void testEditStatus_ValidStateE9() {
        Long id = 1L;
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        String result = creditRequestService.editStatus("E9", id);

        assertEquals("Estado actualizado correctamente", result);
        assertEquals("En Desembolso", creditRequest.getStateRequest());
        verify(creditRequestRepository, times(1)).save(creditRequest);
    }

    @Test
    public void testFindById_ValidId() {
        Long id = 1L;
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setId(id);

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        CreditRequestEntity result = creditRequestService.findById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    public void testFindById_NullId() {
        CreditRequestEntity result = creditRequestService.findById(null);

        assertNull(result);
    }

    @Test
    public void testFindById_RequestNotFound() {
        Long id = 1L;

        when(creditRequestRepository.findById(id)).thenReturn(Optional.empty());

        CreditRequestEntity result = creditRequestService.findById(id);

        assertNull(result);
    }

    @Test
    public void testFindById_InvalidId() {
        Long id = -1L;

        when(creditRequestRepository.findById(id)).thenReturn(Optional.empty());

        CreditRequestEntity result = creditRequestService.findById(id);

        assertNull(result);
    }

    @Test
    public void testFindById_RepositoryThrowsException() {
        Long id = 1L;

        when(creditRequestRepository.findById(id)).thenThrow(new RuntimeException("Database error"));

        assertThrows(RuntimeException.class, () -> {
            creditRequestService.findById(id);
        });
    }

    @Test
    public void testEditStatus_ValidState() {
        Long id = 1L;
        String state = "E2";
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setId(id);

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        String result = creditRequestService.editStatus(state, id);

        assertEquals("Estado actualizado correctamente", result);
        verify(creditRequestRepository, times(1)).save(creditRequest);
    }

    @Test
    public void testEditStatus_InvalidState() {
        Long id = 1L;
        String state = "InvalidState";
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setId(id);

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        assertThrows(IllegalArgumentException.class, () -> {
            creditRequestService.editStatus(state, id);
        });
    }

    @Test
    public void testEditStatus_RequestNotFound2() {
        Long id = 1L;
        String state = "E2";

        when(creditRequestRepository.findById(id)).thenReturn(Optional.empty());

        String result = creditRequestService.editStatus(state, id);

        assertEquals("Solicitud de crédito no encontrada", result);
    }

    @Test
    public void testFindById_ValidId2() {
        Long id = 1L;
        CreditRequestEntity creditRequest = new CreditRequestEntity();
        creditRequest.setId(id);

        when(creditRequestRepository.findById(id)).thenReturn(Optional.of(creditRequest));

        CreditRequestEntity result = creditRequestService.findById(id);

        assertNotNull(result);
        assertEquals(id, result.getId());
    }

    @Test
    public void testFindById_NullId2() {
        CreditRequestEntity result = creditRequestService.findById(null);

        assertNull(result);
    }

    @Test
    public void testDeleteRequest_ValidId() {
        Long id = 1L;

        boolean result = creditRequestService.deleteRequest(id);

        assertTrue(result);
        verify(creditRequestRepository, times(1)).deleteById(id);
    }

    @Test
    public void testDeleteRequest_NullId() {
        boolean result = creditRequestService.deleteRequest(null);

        assertFalse(result);
        verify(creditRequestRepository, times(0)).deleteById(any());
    }
}