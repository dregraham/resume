package com.dregraham.rentcalculator.controller;

import com.dregraham.rentcalculator.model.CalculationRequest;
import com.dregraham.rentcalculator.model.CalculationResponse;
import com.dregraham.rentcalculator.service.CalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payment-calculator")
@CrossOrigin(origins = "*")
public class CalculatorController {

    @Autowired
    private CalculatorService calculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<CalculationResponse> calculatePaymentSchedule(
            @Valid @RequestBody CalculationRequest request) {
        CalculationResponse response = calculatorService.calculatePaymentSchedule(request);
        return ResponseEntity.ok(response);
    }

    // Health check endpoint for frontend
    @GetMapping("/ping")
    public String ping() {
        return "OK";
    }

    // Default root endpoint
    @GetMapping("/")
    public String home() {
        return "Payment Calculator API is running.";
    }
}