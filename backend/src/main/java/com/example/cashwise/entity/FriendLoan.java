package com.example.cashwise.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "friend_loans")
public class FriendLoan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "friend_name", nullable = false, length = 100)
    private String friendName;
    
    @Column(nullable = false, precision = 15, scale = 3)
    private BigDecimal amount;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private LoanType type;
    
    @Column(length = 500)
    private String note;
    
    @Column(name = "loan_date", nullable = false)
    private LocalDate loanDate;
    
    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private LoanStatus status = LoanStatus.PENDING;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    public enum LoanType {
        LENT, BORROWED
    }
    
    public enum LoanStatus {
        PENDING, SETTLED
    }
    
    public FriendLoan() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
