package com.example.cashwise.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {
    
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netSavings;
    private Map<String, BigDecimal> spendingByCategory;
    private List<MonthlyTrend> monthlyTrends;
    private Integer transactionCount;
    
    public DashboardStatsResponse() {}
    
    public static class MonthlyTrend {
        private String month;
        private BigDecimal income;
        private BigDecimal expenses;
        
        public MonthlyTrend(String month, BigDecimal income, BigDecimal expenses) {
            this.month = month;
            this.income = income;
            this.expenses = expenses;
        }
        
        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        
        public BigDecimal getIncome() { return income; }
        public void setIncome(BigDecimal income) { this.income = income; }
        
        public BigDecimal getExpenses() { return expenses; }
        public void setExpenses(BigDecimal expenses) { this.expenses = expenses; }
    }
    
    // Getters and Setters
    public BigDecimal getTotalIncome() { return totalIncome; }
    public void setTotalIncome(BigDecimal totalIncome) { this.totalIncome = totalIncome; }
    
    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }
    
    public BigDecimal getNetSavings() { return netSavings; }
    public void setNetSavings(BigDecimal netSavings) { this.netSavings = netSavings; }
    
    public Map<String, BigDecimal> getSpendingByCategory() { return spendingByCategory; }
    public void setSpendingByCategory(Map<String, BigDecimal> spendingByCategory) { 
        this.spendingByCategory = spendingByCategory; 
    }
    
    public List<MonthlyTrend> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyTrend> monthlyTrends) { 
        this.monthlyTrends = monthlyTrends; 
    }
    
    public Integer getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Integer transactionCount) { 
        this.transactionCount = transactionCount; 
    }
}
