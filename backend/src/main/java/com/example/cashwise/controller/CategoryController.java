package com.example.cashwise.controller;

import com.example.cashwise.dto.CategoryResponse;
import com.example.cashwise.entity.Category.CategoryType;
import com.example.cashwise.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<CategoryResponse>> getCategoriesByType(@PathVariable CategoryType type) {
        return ResponseEntity.ok(categoryService.getCategoriesByType(type));
    }
    
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestBody com.example.cashwise.dto.CategoryRequest request,
            org.springframework.security.core.Authentication authentication) {
        String userEmail = authentication.getName();
        CategoryResponse response = categoryService.createCategory(userEmail, request);
        return ResponseEntity.ok(response);
    }
}
