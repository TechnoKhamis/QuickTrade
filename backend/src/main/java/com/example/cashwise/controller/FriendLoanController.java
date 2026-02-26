package com.example.cashwise.controller;

import com.example.cashwise.dto.FriendLoanRequest;
import com.example.cashwise.dto.FriendLoanResponse;
import com.example.cashwise.service.FriendLoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friend-loans")
public class FriendLoanController {
    
    @Autowired
    private FriendLoanService friendLoanService;
    
    @PostMapping
    public ResponseEntity<FriendLoanResponse> createLoan(
            @RequestBody FriendLoanRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        FriendLoanResponse response = friendLoanService.createLoan(userEmail, request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<FriendLoanResponse>> getUserLoans(Authentication authentication) {
        String userEmail = authentication.getName();
        List<FriendLoanResponse> loans = friendLoanService.getUserLoans(userEmail);
        return ResponseEntity.ok(loans);
    }
    
    @PutMapping("/{id}/settle")
    public ResponseEntity<FriendLoanResponse> settleLoan(
            @PathVariable Long id,
            Authentication authentication) {
        String userEmail = authentication.getName();
        FriendLoanResponse response = friendLoanService.settleLoan(id, userEmail);
        return ResponseEntity.ok(response);
    }
}
