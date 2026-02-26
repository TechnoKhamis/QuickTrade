package com.example.cashwise.service;

import com.example.cashwise.dto.DashboardStatsResponse;
import com.example.cashwise.dto.DashboardStatsResponse.MonthlyTrend;
import com.example.cashwise.entity.Transaction.TransactionType;
import com.example.cashwise.entity.User;
import com.example.cashwise.repository.TransactionRepository;
import com.example.cashwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public DashboardStatsResponse getDashboardStats(String userEmail, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        DashboardStatsResponse stats = new DashboardStatsResponse();
        
        // Calculate totals
        BigDecimal totalIncome = transactionRepository
            .sumByUserIdAndTypeAndDateRange(user.getId(), TransactionType.INCOME, startDate, endDate);
        BigDecimal totalExpenses = transactionRepository
            .sumByUserIdAndTypeAndDateRange(user.getId(), TransactionType.EXPENSE, startDate, endDate);
        
        stats.setTotalIncome(totalIncome != null ? totalIncome : BigDecimal.ZERO);
        stats.setTotalExpenses(totalExpenses != null ? totalExpenses : BigDecimal.ZERO);
        stats.setNetSavings(stats.getTotalIncome().subtract(stats.getTotalExpenses()));
        
        // Spending by category
        List<Object[]> categoryData = transactionRepository.getSpendingByCategory(user.getId(), startDate, endDate);
        Map<String, BigDecimal> spendingByCategory = categoryData.stream()
            .collect(Collectors.toMap(
                row -> (String) row[0],
                row -> (BigDecimal) row[1]
            ));
        stats.setSpendingByCategory(spendingByCategory);
        
        // Monthly trends (last 6 months)
        List<MonthlyTrend> trends = new ArrayList<>();
        YearMonth currentMonth = YearMonth.from(endDate);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM");
        
        for (int i = 5; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);
            LocalDate monthStart = month.atDay(1);
            LocalDate monthEnd = month.atEndOfMonth();
            
            BigDecimal income = transactionRepository.sumByUserIdAndTypeAndDateRange(
                user.getId(), TransactionType.INCOME, monthStart, monthEnd);
            BigDecimal expenses = transactionRepository.sumByUserIdAndTypeAndDateRange(
                user.getId(), TransactionType.EXPENSE, monthStart, monthEnd);
            
            trends.add(new MonthlyTrend(
                month.format(formatter),
                income != null ? income : BigDecimal.ZERO,
                expenses != null ? expenses : BigDecimal.ZERO
            ));
        }
        stats.setMonthlyTrends(trends);
        
        // Transaction count
        int count = transactionRepository
            .findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
                user.getId(), startDate, endDate).size();
        stats.setTransactionCount(count);
        
        return stats;
    }
}
