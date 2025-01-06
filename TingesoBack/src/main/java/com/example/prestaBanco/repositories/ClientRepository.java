package com.example.prestaBanco.repositories;

import com.example.prestaBanco.entities.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {

    Optional<ClientEntity> findByRut(String rut);

    Optional<ClientEntity> findByRutAndPassword(String rut, String password);
}
