package com.example.cashwise.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cashwise.dto.BudgetGoalRequest;
import com.example.cashwise.dto.BudgetGoalResponse;
import com.example.cashwise.service.BudgetGoalService;

@RestController
@RequestMapping("/api/budgets")
public class BudgetGoalController {
    
    @Autowired
    private BudgetGoalService budgetGoalService;
    
    @PostMapping
    public ResponseEntity<BudgetGoalResponse> createOrUpdateBudgetGoal(
            @RequestBody BudgetGoalRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        BudgetGoalResponse response = budgetGoalService.createOrUpdateBudgetGoal(userEmail, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<BudgetGoalResponse>> getCurrentMonthBudgets(Authentication authentication) {
        String userEmail = authentication.getName();
        List<BudgetGoalResponse> budgets = budgetGoalService.getCurrentMonthBudgetGoals(userEmail);
        return ResponseEntity.ok(budgets);
    }
    
    @GetMapping("/month/{month}")
    public ResponseEntity<List<BudgetGoalResponse>> getBudgetsByMonth(
            @PathVariable String month,
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<BudgetGoalResponse> budgets = budgetGoalService.getBudgetGoalsByMonth(userEmail, month);
        return ResponseEntity.ok(budgets);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudgetGoal(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        budgetGoalService.deleteBudgetGoal(userEmail, id);
        return ResponseEntity.noContent().build();
    }
}
