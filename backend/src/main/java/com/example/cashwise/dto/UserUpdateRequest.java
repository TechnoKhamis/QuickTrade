package com.example.cashwise.dto;

public class UserUpdateRequest {
    
    private String fullName;
    private String currency;
    
    public UserUpdateRequest() {}
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
