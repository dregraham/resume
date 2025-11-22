package com.dregraham.rentcalculator.service;

import com.dregraham.rentcalculator.model.CalculationRequest;
import com.dregraham.rentcalculator.model.CalculationResponse;
import org.springframework.stereotype.Service;

@Service
public class CalculatorService {

    public CalculationResponse calculatePaymentSchedule(CalculationRequest request) {
        double loanAmount = request.getLoanAmount();
        double interestRate = request.getInterestRate() / 100.0;
        int paymentsPerYear = request.getPaymentsPerYear();
        
        // Calculate payment with interest using standard loan formula
        double periodicRate = interestRate / paymentsPerYear;
        double paymentAmount;
        
        if (periodicRate > 0) {
            paymentAmount = (loanAmount * periodicRate) / 
                           (1 - Math.pow(1 + periodicRate, -paymentsPerYear));
        } else {
            paymentAmount = loanAmount / paymentsPerYear;
        }
        
        double totalPaid = paymentAmount * paymentsPerYear;
        double totalInterest = totalPaid - loanAmount;
        String paymentFrequency = getFrequencyName(paymentsPerYear);
        
        return new CalculationResponse(
            paymentAmount, 
            paymentsPerYear, 
            paymentFrequency, 
            totalPaid, 
            totalInterest
        );
    }
    
    private String getFrequencyName(int paymentsPerYear) {
        return switch (paymentsPerYear) {
            case 12 -> "Monthly";
            case 6 -> "Bi-Monthly";
            case 4 -> "Quarterly";
            case 1 -> "Annual";
            default -> "Custom";
        };
    }
}