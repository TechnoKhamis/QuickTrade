package com.example.cashwise.dto;

import java.math.BigDecimal;

public class BudgetGoalRequest {
    
    private Long categoryId;
    private String month; // Format: YYYY-MM-DD (first day of month)
    private BigDecimal limitAmount;
    
    public BudgetGoalRequest() {}
    
    public BudgetGoalRequest(Long categoryId, String month, BigDecimal limitAmount) {
        this.categoryId = categoryId;
        this.month = month;
        this.limitAmount = limitAmount;
    }
    
    // Getters and Setters
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    
    public String getMonth() {
        return month;
    }
    
    public void setMonth(String month) {
        this.month = month;
    }
    
    public BigDecimal getLimitAmount() {
        return limitAmount;
    }
    
    public void setLimitAmount(BigDecimal limitAmount) {
        this.limitAmount = limitAmount;
    }
}
