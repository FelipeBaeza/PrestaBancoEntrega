package com.example.prestaBanco.controllers;

import com.example.prestaBanco.entities.CreditEvaluationEntity;
import com.example.prestaBanco.services.CreditEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/creditEvaluation")
@CrossOrigin("*")
public class CreditEvaluationController {

    @Autowired
    private CreditEvaluationService creditEvaluationService;


    @PostMapping("/dataEvaluation")
    public ResponseEntity<?> dataEvaluation(@RequestBody CreditEvaluationEntity evaluation) {
        return ResponseEntity.ok(creditEvaluationService.evaluateCredit(evaluation));
    }

    @GetMapping("/totalCosts/{id}")
    public ResponseEntity<?> totalCosts(@PathVariable Long id) {
        return ResponseEntity.ok(creditEvaluationService.calculateTotalCosts(id));
    }







}
