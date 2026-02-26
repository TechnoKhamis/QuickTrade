package com.example.cashwise.service;

import com.example.cashwise.dto.TransactionRequest;
import com.example.cashwise.dto.TransactionResponse;
import com.example.cashwise.entity.Category;
import com.example.cashwise.entity.Transaction;
import com.example.cashwise.entity.User;
import com.example.cashwise.repository.CategoryRepository;
import com.example.cashwise.repository.TransactionRepository;
import com.example.cashwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public TransactionResponse createTransaction(String userEmail, TransactionRequest request) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(category);
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setIsManual(request.getIsManual() != null ? request.getIsManual() : true);
        
        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }
    
    public List<TransactionResponse> getUserTransactions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(user.getId())
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public List<TransactionResponse> getTransactionsByDateRange(String userEmail, 
                                                                 LocalDate startDate, 
                                                                 LocalDate endDate) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return transactionRepository
            .findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
                user.getId(), startDate, endDate)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public TransactionResponse updateTransaction(Long transactionId, String userEmail, 
                                                 TransactionRequest request) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(category);
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        
        transaction = transactionRepository.save(transaction);
        return mapToResponse(transaction);
    }
    
    @Transactional
    public void deleteTransaction(Long transactionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Transaction transaction = transactionRepository.findById(transactionId)
            .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        transactionRepository.delete(transaction);
    }
    
    private TransactionResponse mapToResponse(Transaction transaction) {
        return new TransactionResponse(
            transaction.getId(),
            transaction.getAmount(),
            transaction.getType(),
            transaction.getCategory().getName(),
            transaction.getCategory().getEmoji(),
            transaction.getDescription(),
            transaction.getTransactionDate(),
            transaction.getIsManual()
        );
    }
}
