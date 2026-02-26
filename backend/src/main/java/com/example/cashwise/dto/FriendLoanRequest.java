package com.example.cashwise.dto;

import com.example.cashwise.entity.FriendLoan.LoanType;
import java.math.BigDecimal;
import java.time.LocalDate;

public class FriendLoanRequest {
    
    private String friendName;
    private BigDecimal amount;
    private LoanType type;
    private String note;
    private LocalDate loanDate;
    
    public FriendLoanRequest() {}
    
    // Getters and Setters
    public String getFriendName() { return friendName; }
    public void setFriendName(String friendName) { this.friendName = friendName; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public LoanType getType() { return type; }
    public void setType(LoanType type) { this.type = type; }
    
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    
    public LocalDate getLoanDate() { return loanDate; }
    public void setLoanDate(LocalDate loanDate) { this.loanDate = loanDate; }
}
