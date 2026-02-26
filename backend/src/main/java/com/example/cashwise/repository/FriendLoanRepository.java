package com.example.cashwise.repository;

import com.example.cashwise.entity.FriendLoan;
import com.example.cashwise.entity.FriendLoan.LoanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FriendLoanRepository extends JpaRepository<FriendLoan, Long> {
    
    List<FriendLoan> findByUserIdOrderByLoanDateDesc(Long userId);
    
    List<FriendLoan> findByUserIdAndType(Long userId, LoanType type);
    
    @Query("SELECT SUM(f.amount) FROM FriendLoan f WHERE f.user.id = :userId AND f.type = :type AND f.status = 'PENDING'")
    BigDecimal sumByUserIdAndType(Long userId, LoanType type);
}
