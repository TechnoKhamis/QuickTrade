package com.example.cashwise.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.cashwise.entity.Transaction;
import com.example.cashwise.entity.Transaction.TransactionType;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);
    
    List<Transaction> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
        Long userId, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByUserIdAndTypeOrderByTransactionDateDesc(Long userId, TransactionType type);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumByUserIdAndType(Long userId, TransactionType type);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserIdAndTypeAndDateRange(Long userId, TransactionType type, 
                                               LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'EXPENSE' " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category.id, t.category.name")
    List<Object[]> getSpendingByCategory(Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId " +
           "AND t.category.id = :categoryId AND t.type = :type " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserIdAndCategoryIdAndTypeAndDateRange(Long userId, Long categoryId, 
                                                            TransactionType type, 
                                                            LocalDate startDate, LocalDate endDate);
}
