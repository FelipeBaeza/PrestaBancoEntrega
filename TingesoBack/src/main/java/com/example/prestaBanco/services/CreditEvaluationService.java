package com.example.prestaBanco.services;

import com.example.prestaBanco.entities.CreditEvaluationEntity;
import com.example.prestaBanco.entities.CreditRequestEntity;
import com.example.prestaBanco.repositories.CreditEvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class CreditEvaluationService {

    @Autowired
    private CreditEvaluationRepository creditEvaluationRepository;

    @Autowired
    private CreditRequestService creditRequestService;

    @Autowired
    private ClientService clientService;

    /**
     * Evaluates the credit request.
     *
     * @param evaluation the credit evaluation entity
     * @return the credit evaluation entity
     */
    public CreditEvaluationEntity evaluateCredit(CreditEvaluationEntity evaluation) {
        if (evaluation != null) {
            boolean allTrue = evaluation.isIncomeQuota() && evaluation.isCreditHistory() && evaluation.isEmploymentSeniority() &&
                    evaluation.isIncomeDebtRelation() && evaluation.isFinancingLimit() && evaluation.isApplicantAge() &&
                    evaluation.isSavingsCapacity();

            String state = allTrue ? "E4" : "E7";
            creditRequestService.editStatus(state, evaluation.getIdRquest());
        }
        if(evaluation != null){
            return creditEvaluationRepository.save(evaluation);
        }
        return null;
    }


    /**
     * Evaluates the age of the applicant.
     *
     * @param dateofbirth the date of birth of the applicant
     * @param term the term of the loan
     * @return true if the applicant is less than 70 years old, false otherwise
     */
    public boolean AgeApplicant(LocalDate dateofbirth, int term) {
        LocalDate date = LocalDate.now();
        int year = date.getYear() - dateofbirth.getYear() + term;

        if (year > 70 ) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * calculateTotalCosts method to calculate the total costs of a loan.
     * @param id
     * @return the total costs of the loan
     */
    public int calculateTotalCosts(Long id) {
        // Step 1: Calculate Monthly Payment
        CreditRequestEntity request = creditRequestService.findById(id);
        if (request == null) {
            return 0; // Return 0 if the request is not found
        }
        int loanAmount = request.getMaximumAmount(); // 100,000,000
        int termInYears = request.getTerm(); // 20 years
        double annualInterestRate = request.getInterestRate(); // 4.5%
        double monthlyInterestRate = annualInterestRate / 12 / 100; // 0.375%

        double monthlyPayment = clientService.simulation(loanAmount, annualInterestRate, termInYears);

        // Step 2: Calculate Insurance Costs
        double monthlyLifeInsurance = loanAmount * 0.0003; // 0.03% of loan amount
        double monthlyFireInsurance = 20000; // Fixed at 20,000 per month

        // Step 3: Calculate Administration Commission
        double administrationCommission = loanAmount * 0.01; // 1% of loan amount

        // Step 4: Calculate Monthly Total Cost
        double monthlyCost = monthlyPayment + monthlyLifeInsurance + monthlyFireInsurance;

        // Step 5: Calculate Total Cost for the Entire Loan Term
        double totalCost = (monthlyCost * termInYears * 12) + administrationCommission;

        return (int) totalCost;
    }
}
