package com.example.cashwise.controller;

import com.example.cashwise.dto.UserUpdateRequest;
import com.example.cashwise.entity.User;
import com.example.cashwise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(new UserResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getCurrency()
        ));
    }
    
    @PutMapping("/me")
    public ResponseEntity<?> updateUser(
            @RequestBody UserUpdateRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getCurrency() != null) {
            user.setCurrency(request.getCurrency());
        }
        
        user = userRepository.save(user);
        
        return ResponseEntity.ok(new UserResponse(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getCurrency()
        ));
    }
    
    static class UserResponse {
        private Long id;
        private String fullName;
        private String email;
        private String currency;
        
        public UserResponse(Long id, String fullName, String email, String currency) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.currency = currency;
        }
        
        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getCurrency() { return currency; }
    }
}
