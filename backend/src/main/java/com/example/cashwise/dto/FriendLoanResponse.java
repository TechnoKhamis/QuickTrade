package com.example.cashwise.dto;

import com.example.cashwise.entity.FriendLoan.LoanType;
import com.example.cashwise.entity.FriendLoan.LoanStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public class FriendLoanResponse {
    
    private Long id;
    private String friendName;
    private BigDecimal amount;
    private LoanType type;
    private String note;
    private LocalDate loanDate;
    private LoanStatus status;
    
    public FriendLoanResponse() {}
    
    public FriendLoanResponse(Long id, String friendName, BigDecimal amount, LoanType type,
                             String note, LocalDate loanDate, LoanStatus status) {
        this.id = id;
        this.friendName = friendName;
        this.amount = amount;
        this.type = type;
        this.note = note;
        this.loanDate = loanDate;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
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
    
    public LoanStatus getStatus() { return status; }
    public void setStatus(LoanStatus status) { this.status = status; }
}
