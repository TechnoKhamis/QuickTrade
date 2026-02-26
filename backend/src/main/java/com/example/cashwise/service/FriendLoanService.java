package com.example.cashwise.service;

import com.example.cashwise.dto.FriendLoanRequest;
import com.example.cashwise.dto.FriendLoanResponse;
import com.example.cashwise.entity.FriendLoan;
import com.example.cashwise.entity.FriendLoan.LoanStatus;
import com.example.cashwise.entity.User;
import com.example.cashwise.repository.FriendLoanRepository;
import com.example.cashwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendLoanService {
    
    @Autowired
    private FriendLoanRepository friendLoanRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public FriendLoanResponse createLoan(String userEmail, FriendLoanRequest request) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        FriendLoan loan = new FriendLoan();
        loan.setUser(user);
        loan.setFriendName(request.getFriendName());
        loan.setAmount(request.getAmount());
        loan.setType(request.getType());
        loan.setNote(request.getNote());
        loan.setLoanDate(request.getLoanDate());
        loan.setStatus(LoanStatus.PENDING);
        
        loan = friendLoanRepository.save(loan);
        return mapToResponse(loan);
    }
    
    public List<FriendLoanResponse> getUserLoans(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return friendLoanRepository.findByUserIdOrderByLoanDateDesc(user.getId())
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public FriendLoanResponse settleLoan(Long loanId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        FriendLoan loan = friendLoanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Loan not found"));
        
        if (!loan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        loan.setStatus(LoanStatus.SETTLED);
        loan = friendLoanRepository.save(loan);
        return mapToResponse(loan);
    }
    
    private FriendLoanResponse mapToResponse(FriendLoan loan) {
        return new FriendLoanResponse(
            loan.getId(),
            loan.getFriendName(),
            loan.getAmount(),
            loan.getType(),
            loan.getNote(),
            loan.getLoanDate(),
            loan.getStatus()
        );
    }
}
