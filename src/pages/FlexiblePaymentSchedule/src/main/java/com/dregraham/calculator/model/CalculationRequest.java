package com.dregraham.rentcalculator.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CalculationRequest {
    
    @NotNull(message = "Loan amount is required")
    @DecimalMin(value = "0.01", message = "Loan amount must be greater than 0")
    private Double loanAmount;
    
    @NotNull(message = "Interest rate is required")
    @DecimalMin(value = "0.0", message = "Interest rate must be 0 or greater")
    private Double interestRate;
    
    @NotNull(message = "Payments per year is required")
    @Min(value = 1, message = "Payments per year must be at least 1")
    private Integer paymentsPerYear;
    
    public CalculationRequest() {}
    
    public CalculationRequest(Double loanAmount, Double interestRate, Integer paymentsPerYear) {
        this.loanAmount = loanAmount;
        this.interestRate = interestRate;
        this.paymentsPerYear = paymentsPerYear;
    }
    
    public Double getLoanAmount() {
        return loanAmount;
    }
    
    public void setLoanAmount(Double loanAmount) {
        this.loanAmount = loanAmount;
    }
    
    public Double getInterestRate() {
        return interestRate;
    }
    
    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }
    
    public Integer getPaymentsPerYear() {
        return paymentsPerYear;
    }
    
    public void setPaymentsPerYear(Integer paymentsPerYear) {
        this.paymentsPerYear = paymentsPerYear;
    }
}