package com.example.prestaBanco.repositories;

import com.example.prestaBanco.entities.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {
    LoanEntity findByTypeLoan(String typeLoan);
}
