package com.example.cashwise.controller;

import com.example.cashwise.dto.TransactionRequest;
import com.example.cashwise.dto.TransactionResponse;
import com.example.cashwise.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody TransactionRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TransactionResponse response = transactionService.createTransaction(userEmail, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getUserTransactions(
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<TransactionResponse> transactions = transactionService.getUserTransactions(userEmail);
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        String userEmail = authentication.getName();
        List<TransactionResponse> transactions = 
            transactionService.getTransactionsByDateRange(userEmail, startDate, endDate);
        return ResponseEntity.ok(transactions);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        TransactionResponse response = transactionService.updateTransaction(id, userEmail, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        transactionService.deleteTransaction(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}
