package com.example.cashwise.service;

import com.example.cashwise.dto.BudgetGoalRequest;
import com.example.cashwise.dto.BudgetGoalResponse;
import com.example.cashwise.entity.BudgetGoal;
import com.example.cashwise.entity.Category;
import com.example.cashwise.entity.Transaction;
import com.example.cashwise.entity.User;
import com.example.cashwise.repository.BudgetGoalRepository;
import com.example.cashwise.repository.CategoryRepository;
import com.example.cashwise.repository.TransactionRepository;
import com.example.cashwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetGoalService {
    
    @Autowired
    private BudgetGoalRepository budgetGoalRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Transactional
    public BudgetGoalResponse createOrUpdateBudgetGoal(String userEmail, BudgetGoalRequest request) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        LocalDate month = LocalDate.parse(request.getMonth());
        // Ensure it's the first day of the month
        month = month.withDayOfMonth(1);
        
        // Check if budget already exists
        BudgetGoal budgetGoal = budgetGoalRepository
            .findByUserIdAndCategoryIdAndMonth(user.getId(), category.getId(), month)
            .orElse(new BudgetGoal());
        
        budgetGoal.setUser(user);
        budgetGoal.setCategory(category);
        budgetGoal.setMonth(month);
        budgetGoal.setLimitAmount(request.getLimitAmount());
        
        budgetGoal = budgetGoalRepository.save(budgetGoal);
        
        return buildBudgetGoalResponse(budgetGoal, user.getId());
    }
    
    public List<BudgetGoalResponse> getBudgetGoalsByMonth(String userEmail, String monthStr) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        LocalDate month = LocalDate.parse(monthStr).withDayOfMonth(1);
        
        List<BudgetGoal> budgetGoals = budgetGoalRepository.findByUserIdAndMonth(user.getId(), month);
        
        return budgetGoals.stream()
            .map(bg -> buildBudgetGoalResponse(bg, user.getId()))
            .collect(Collectors.toList());
    }
    
    public List<BudgetGoalResponse> getCurrentMonthBudgetGoals(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        
        List<BudgetGoal> budgetGoals = budgetGoalRepository.findByUserIdAndMonth(user.getId(), currentMonth);
        
        return budgetGoals.stream()
            .map(bg -> buildBudgetGoalResponse(bg, user.getId()))
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteBudgetGoal(String userEmail, Long budgetId) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        BudgetGoal budgetGoal = budgetGoalRepository.findById(budgetId)
            .orElseThrow(() -> new RuntimeException("Budget goal not found"));
        
        if (!budgetGoal.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        budgetGoalRepository.delete(budgetGoal);
    }
    
    private BudgetGoalResponse buildBudgetGoalResponse(BudgetGoal budgetGoal, Long userId) {
        Category category = budgetGoal.getCategory();
        LocalDate month = budgetGoal.getMonth();
        
        // Calculate spent amount for this category in this month
        YearMonth yearMonth = YearMonth.from(month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        
        BigDecimal spentAmount = transactionRepository
            .sumByUserIdAndCategoryIdAndTypeAndDateRange(
                userId, 
                category.getId(), 
                Transaction.TransactionType.EXPENSE, 
                startDate, 
                endDate
            );
        
        if (spentAmount == null) {
            spentAmount = BigDecimal.ZERO;
        }
        
        return new BudgetGoalResponse(
            budgetGoal.getId(),
            category.getId(),
            category.getName(),
            category.getEmoji(),
            month.toString(),
            budgetGoal.getLimitAmount(),
            spentAmount
        );
    }
}
