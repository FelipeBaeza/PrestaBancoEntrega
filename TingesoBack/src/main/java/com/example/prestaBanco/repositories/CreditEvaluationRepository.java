package com.example.prestaBanco.repositories;

import com.example.prestaBanco.entities.CreditEvaluationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditEvaluationRepository extends JpaRepository<CreditEvaluationEntity, Long> {
}
