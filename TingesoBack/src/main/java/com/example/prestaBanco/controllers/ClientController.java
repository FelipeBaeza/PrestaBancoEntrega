package com.example.prestaBanco.controllers;

import com.example.prestaBanco.entities.ClientEntity;
import com.example.prestaBanco.services.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clients")
@CrossOrigin("*")
public class ClientController {

    @Autowired
    private ClientService clientService;

    /**
     * Saves a new client.
     *
     * @param client the client entity to be saved
     * @return the saved client entity
     */

    @PostMapping("/save")
    public ResponseEntity<?> saveClient(@RequestBody ClientEntity client) {
        ClientEntity clientNew = clientService.saveClient(client);
        return ResponseEntity.ok(clientNew);
    }


    /**
     * Simulates a loan calculation.
     *
     * @param amount the amount of the loan
     * @param interestRate the interest rate of the loan
     * @param term the term of the loan
     * @return the monthly payment of the loan
     */
    @GetMapping("/simulation/{amount}/{interestRate}/{term}")
    public ResponseEntity<?> simulation(@PathVariable int amount, @PathVariable double interestRate, @PathVariable int term) {
        return ResponseEntity.ok(clientService.simulation(amount, interestRate, term));
    }

    /**
     * statusRequest method to get the status of a request
     * @param rut
     * @return the status of the request
     */

    @GetMapping("/statusRequest/{rut}")
    public ResponseEntity<?> statusRequest(@PathVariable String rut) {
        return ResponseEntity.ok(clientService.statusRequestClient(rut));
    }

    @GetMapping("/validateRutAndPassword/{rut}/{password}")
    public ResponseEntity<?> validateRutAndPassword(@PathVariable String rut, @PathVariable String password) {
        return ResponseEntity.ok(clientService.validateClient(rut, password));
    }

}
