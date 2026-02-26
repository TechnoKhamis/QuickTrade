package com.example.cashwise.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.cashwise.entity.BudgetGoal;

@Repository
public interface BudgetGoalRepository extends JpaRepository<BudgetGoal, Long> {
    
    List<BudgetGoal> findByUserIdAndMonth(Long userId, LocalDate month);
    
    List<BudgetGoal> findByUserIdOrderByMonthDesc(Long userId);
    
    Optional<BudgetGoal> findByUserIdAndCategoryIdAndMonth(Long userId, Long categoryId, LocalDate month);
    
    @Query("SELECT bg FROM BudgetGoal bg WHERE bg.user.id = :userId AND bg.month >= :startDate AND bg.month <= :endDate")
    List<BudgetGoal> findByUserIdAndMonthBetween(
        @Param("userId") Long userId, 
        @Param("startDate") LocalDate startDate, 
        @Param("endDate") LocalDate endDate
    );
}
