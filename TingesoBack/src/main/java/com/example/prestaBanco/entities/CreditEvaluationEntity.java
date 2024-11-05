package com.example.prestaBanco.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "credit_evaluation")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreditEvaluationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Datos de la evaluación
    private boolean incomeQuota;
    private boolean creditHistory;
    private boolean employmentSeniority;
    private boolean incomeDebtRelation;
    private boolean financingLimit;
    private boolean applicantAge;
    private boolean savingsCapacity;

    private long idRquest;

    //----------------------------------------------





}
