package com.example.prestaBanco.repositories;

import com.example.prestaBanco.entities.CreditRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface CreditRequestRepository extends JpaRepository<CreditRequestEntity, Long> {

}
