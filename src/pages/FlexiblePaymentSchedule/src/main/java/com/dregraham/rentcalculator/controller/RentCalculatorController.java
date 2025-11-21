package com.dregraham.rentcalculator.controller;

import com.dregraham.rentcalculator.model.RentCalculationRequest;
import com.dregraham.rentcalculator.model.RentCalculationResponse;
import com.dregraham.rentcalculator.service.RentCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payment-calculator")
@CrossOrigin(origins = "*")
public class RentCalculatorController {

    @Autowired
    private RentCalculatorService calculatorService;

    @PostMapping("/calculate")
    public ResponseEntity<RentCalculationResponse> calculatePaymentSchedule(
            @Valid @RequestBody RentCalculationRequest request) {
        
        RentCalculationResponse response = calculatorService.calculatePaymentSchedule(request);
        return ResponseEntity.ok(response);
    }
}