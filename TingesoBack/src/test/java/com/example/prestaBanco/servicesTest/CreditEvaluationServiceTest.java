package com.example.prestaBanco.servicesTest;

import com.example.prestaBanco.entities.CreditEvaluationEntity;
import com.example.prestaBanco.entities.CreditRequestEntity;
import com.example.prestaBanco.repositories.CreditEvaluationRepository;
import com.example.prestaBanco.services.ClientService;
import com.example.prestaBanco.services.CreditEvaluationService;
import com.example.prestaBanco.services.CreditRequestService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@WebMvcTest(MockitoExtension.class)
public class CreditEvaluationServiceTest {

    @Mock
    private CreditEvaluationRepository creditEvaluationRepository;

    @Mock
    private CreditRequestService creditRequestService;

    @Mock
    private ClientService clientService;

    @InjectMocks
    private CreditEvaluationService creditEvaluationService;

    public CreditEvaluationServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testEvaluateCredit_AllTrue() {
        CreditEvaluationEntity evaluation = new CreditEvaluationEntity();
        evaluation.setIncomeQuota(true);
        evaluation.setCreditHistory(true);
        evaluation.setEmploymentSeniority(true);
        evaluation.setIncomeDebtRelation(true);
        evaluation.setFinancingLimit(true);
        evaluation.setApplicantAge(true);
        evaluation.setSavingsCapacity(true);
        evaluation.setIdRquest(1L);

        when(creditEvaluationRepository.save(any(CreditEvaluationEntity.class))).thenReturn(evaluation);

        CreditEvaluationEntity result = creditEvaluationService.evaluateCredit(evaluation);

        assertEquals(evaluation, result);
        verify(creditRequestService, times(1)).editStatus("E4", 1L);
        verify(creditEvaluationRepository, times(1)).save(evaluation);
    }

    @Test
    public void testEvaluateCredit_NotAllTrue() {
        CreditEvaluationEntity evaluation = new CreditEvaluationEntity();
        evaluation.setIncomeQuota(false);
        evaluation.setCreditHistory(true);
        evaluation.setEmploymentSeniority(true);
        evaluation.setIncomeDebtRelation(true);
        evaluation.setFinancingLimit(true);
        evaluation.setApplicantAge(true);
        evaluation.setSavingsCapacity(true);
        evaluation.setIdRquest(1L);

        when(creditEvaluationRepository.save(any(CreditEvaluationEntity.class))).thenReturn(evaluation);

        CreditEvaluationEntity result = creditEvaluationService.evaluateCredit(evaluation);

        assertEquals(evaluation, result);
        verify(creditRequestService, times(1)).editStatus("E7", 1L);
        verify(creditEvaluationRepository, times(1)).save(evaluation);
    }

    @Test
    public void testEvaluateCredit_NullEvaluation() {
        CreditEvaluationEntity result = creditEvaluationService.evaluateCredit(null);

        assertEquals(null, result);
        verify(creditRequestService, times(0)).editStatus(anyString(), anyLong());
        verify(creditEvaluationRepository, times(0)).save(any(CreditEvaluationEntity.class));
    }

    @Test
    public void testEvaluateCredit_SomeTrueSomeFalse() {
        CreditEvaluationEntity evaluation = new CreditEvaluationEntity();
        evaluation.setIncomeQuota(true);
        evaluation.setCreditHistory(false);
        evaluation.setEmploymentSeniority(true);
        evaluation.setIncomeDebtRelation(false);
        evaluation.setFinancingLimit(true);
        evaluation.setApplicantAge(false);
        evaluation.setSavingsCapacity(true);
        evaluation.setIdRquest(1L);

        when(creditEvaluationRepository.save(any(CreditEvaluationEntity.class))).thenReturn(evaluation);

        CreditEvaluationEntity result = creditEvaluationService.evaluateCredit(evaluation);

        assertEquals(evaluation, result);
        verify(creditRequestService, times(1)).editStatus("E7", 1L);
        verify(creditEvaluationRepository, times(1)).save(evaluation);

    }
        @Test
        public void testEvaluateCredit_AllFalse() {
            CreditEvaluationEntity evaluation = new CreditEvaluationEntity();
            evaluation.setIncomeQuota(false);
            evaluation.setCreditHistory(false);
            evaluation.setEmploymentSeniority(false);
            evaluation.setIncomeDebtRelation(false);
            evaluation.setFinancingLimit(false);
            evaluation.setApplicantAge(false);
            evaluation.setSavingsCapacity(false);
            evaluation.setIdRquest(1L);

            when(creditEvaluationRepository.save(any(CreditEvaluationEntity.class))).thenReturn(evaluation);

            CreditEvaluationEntity result = creditEvaluationService.evaluateCredit(evaluation);

            assertEquals(evaluation, result);
            verify(creditRequestService, times(1)).editStatus("E7", 1L);
            verify(creditEvaluationRepository, times(1)).save(evaluation);
        }

    @Test
    public void testAgeApplicant_ApplicantYoungerThan70() {
        LocalDate dateOfBirth = LocalDate.of(1990, 1, 1);
        int term = 20;
        boolean result = creditEvaluationService.AgeApplicant(dateOfBirth, term);
        assertTrue(result);
    }

    @Test
    public void testAgeApplicant_ApplicantExactly70() {
        LocalDate dateOfBirth = LocalDate.of(1953, 1, 1);
        int term = 0;
        boolean result = creditEvaluationService.AgeApplicant(dateOfBirth, term);
        assertFalse(result);
    }

    @Test
    public void testAgeApplicant_ApplicantOlderThan70() {
        LocalDate dateOfBirth = LocalDate.of(1950, 1, 1);
        int term = 21;
        boolean result = creditEvaluationService.AgeApplicant(dateOfBirth, term);
        assertFalse(result);
    }

    @Test
    public void testAgeApplicant_ApplicantJustTurned70() {
        LocalDate dateOfBirth = LocalDate.of(1953, LocalDate.now().getMonth(), LocalDate.now().getDayOfMonth());
        int term = 0;
        boolean result = creditEvaluationService.AgeApplicant(dateOfBirth, term);
        assertFalse(result);
    }

    @Test
    public void testAgeApplicant_ApplicantWillBe70DuringTerm() {
        LocalDate dateOfBirth = LocalDate.of(1960, 1, 1);
        int term = 10;
        boolean result = creditEvaluationService.AgeApplicant(dateOfBirth, term);
        assertFalse(result);
    }

    @Test
    public void testCalculateTotalCosts_RequestNotFound() {
        when(creditRequestService.findById(anyLong())).thenReturn(null);

        int result = creditEvaluationService.calculateTotalCosts(1L);

        assertEquals(0, result);
    }

    @Test
    public void testCalculateTotalCosts_ValidRequest() {
        CreditRequestEntity request = new CreditRequestEntity();
        request.setMaximumAmount(100000000);
        request.setTerm(20);
        request.setInterestRate(4.5);

        when(creditRequestService.findById(anyLong())).thenReturn(request);
        when(clientService.simulation(100000000, 4.5, 20)).thenReturn(572000);

        int result = creditEvaluationService.calculateTotalCosts(1L);

        assertEquals(150280000, result);
    }

    @Test
    public void testCalculateTotalCosts_ShortTerm() {
        CreditRequestEntity request = new CreditRequestEntity();
        request.setMaximumAmount(50000000);
        request.setTerm(5);
        request.setInterestRate(3.0);

        when(creditRequestService.findById(anyLong())).thenReturn(request);
        when(clientService.simulation(50000000, 3.0, 5)).thenReturn(898202);

        int result = creditEvaluationService.calculateTotalCosts(1L);

        assertEquals(56492120, result);
    }

    @Test
    public void testCalculateTotalCosts_HighInterestRate() {
        CreditRequestEntity request = new CreditRequestEntity();
        request.setMaximumAmount(200000000);
        request.setTerm(15);
        request.setInterestRate(10.0);

        when(creditRequestService.findById(anyLong())).thenReturn(request);
        when(clientService.simulation(200000000, 10.0, 15)).thenReturn(2145500);

        int result = creditEvaluationService.calculateTotalCosts(1L);

        assertEquals(402590000, result);
    }

    @Test
    public void testCalculateTotalCosts_LowLoanAmount() {
        CreditRequestEntity request = new CreditRequestEntity();
        request.setMaximumAmount(10000000);
        request.setTerm(10);
        request.setInterestRate(5.0);

        when(creditRequestService.findById(anyLong())).thenReturn(request);
        when(clientService.simulation(10000000, 5.0, 10)).thenReturn(106065);

        int result = creditEvaluationService.calculateTotalCosts(1L);

        assertEquals(15587800, result);
    }
}