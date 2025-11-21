package com.dregraham.rentcalculator.model;

public class RentCalculationResponse {
    
    private double paymentAmount;
    private int paymentsPerYear;
    private String paymentFrequency;
    private double totalPaid;
    private double totalInterest;
    
    public RentCalculationResponse() {}
    
    public RentCalculationResponse(double paymentAmount, int paymentsPerYear, 
                                 String paymentFrequency, double totalPaid, double totalInterest) {
        this.paymentAmount = paymentAmount;
        this.paymentsPerYear = paymentsPerYear;
        this.paymentFrequency = paymentFrequency;
        this.totalPaid = totalPaid;
        this.totalInterest = totalInterest;
    }
    
    public double getPaymentAmount() {
        return paymentAmount;
    }
    
    public void setPaymentAmount(double paymentAmount) {
        this.paymentAmount = paymentAmount;
    }
    
    public int getPaymentsPerYear() {
        return paymentsPerYear;
    }
    
    public void setPaymentsPerYear(int paymentsPerYear) {
        this.paymentsPerYear = paymentsPerYear;
    }
    
    public String getPaymentFrequency() {
        return paymentFrequency;
    }
    
    public void setPaymentFrequency(String paymentFrequency) {
        this.paymentFrequency = paymentFrequency;
    }
    
    public double getTotalPaid() {
        return totalPaid;
    }
    
    public void setTotalPaid(double totalPaid) {
        this.totalPaid = totalPaid;
    }
    
    public double getTotalInterest() {
        return totalInterest;
    }
    
    public void setTotalInterest(double totalInterest) {
        this.totalInterest = totalInterest;
    }
}