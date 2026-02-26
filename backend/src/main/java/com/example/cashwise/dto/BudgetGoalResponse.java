package com.example.cashwise.dto;

import java.math.BigDecimal;

public class BudgetGoalResponse {
    
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryEmoji;
    private String month;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private Double percentageUsed;
    private String status; // "ok", "warn", "over"
    
    public BudgetGoalResponse() {}
    
    public BudgetGoalResponse(Long id, Long categoryId, String categoryName, String categoryEmoji,
                             String month, BigDecimal limitAmount, BigDecimal spentAmount) {
        this.id = id;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryEmoji = categoryEmoji;
        this.month = month;
        this.limitAmount = limitAmount;
        this.spentAmount = spentAmount;
        this.remainingAmount = limitAmount.subtract(spentAmount);
        
        if (limitAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.percentageUsed = spentAmount.divide(limitAmount, 4, BigDecimal.ROUND_HALF_UP)
                                            .multiply(new BigDecimal(100))
                                            .doubleValue();
        } else {
            this.percentageUsed = 0.0;
        }
        
        if (percentageUsed >= 100) {
            this.status = "over";
        } else if (percentageUsed >= 80) {
            this.status = "warn";
        } else {
            this.status = "ok";
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    public String getCategoryEmoji() {
        return categoryEmoji;
    }
    
    public void setCategoryEmoji(String categoryEmoji) {
        this.categoryEmoji = categoryEmoji;
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
    
    public BigDecimal getSpentAmount() {
        return spentAmount;
    }
    
    public void setSpentAmount(BigDecimal spentAmount) {
        this.spentAmount = spentAmount;
    }
    
    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }
    
    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }
    
    public Double getPercentageUsed() {
        return percentageUsed;
    }
    
    public void setPercentageUsed(Double percentageUsed) {
        this.percentageUsed = percentageUsed;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}
