package com.example.prestaBanco.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "form_credit")
@NoArgsConstructor
@AllArgsConstructor
public class CreditRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // datos prestamo
    String typeLoan;
    int term;
    double interestRate;
    int maximumAmount;

    // Documentos requeridos
    @Lob
    private byte[] proofIncome;
    @Lob
    private byte[] appraisalCertificate;
    @Lob
    private byte[] creditHistory;
    @Lob
    private byte[] propertyWriting;
    @Lob
    private byte[] businessFinancialStatement;
    @Lob
    private byte[] businessPlan;
    @Lob
    private byte[] remodelingBudget;
    @Lob
    private byte[] bankAccountState;
    @Lob
    private byte[] workCertificate;

    private String StateRequest;
}
