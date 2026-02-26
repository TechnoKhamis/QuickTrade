package com.example.cashwise.dto;

import com.example.cashwise.entity.Transaction.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionResponse {
    
    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private String categoryName;
    private String categoryEmoji;
    private String description;
    private LocalDate transactionDate;
    private Boolean isManual;
    
    public TransactionResponse() {}
    
    public TransactionResponse(Long id, BigDecimal amount, TransactionType type, 
                              String categoryName, String categoryEmoji, String description,
                              LocalDate transactionDate, Boolean isManual) {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.categoryName = categoryName;
        this.categoryEmoji = categoryEmoji;
        this.description = description;
        this.transactionDate = transactionDate;
        this.isManual = isManual;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    
    public String getCategoryEmoji() { return categoryEmoji; }
    public void setCategoryEmoji(String categoryEmoji) { this.categoryEmoji = categoryEmoji; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
    
    public Boolean getIsManual() { return isManual; }
    public void setIsManual(Boolean isManual) { this.isManual = isManual; }
}
