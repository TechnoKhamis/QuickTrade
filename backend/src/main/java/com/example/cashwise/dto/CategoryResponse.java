package com.example.cashwise.dto;

import com.example.cashwise.entity.Category.CategoryType;

public class CategoryResponse {
    
    private Long id;
    private String name;
    private String emoji;
    private CategoryType type;
    
    public CategoryResponse() {}
    
    public CategoryResponse(Long id, String name, String emoji, CategoryType type) {
        this.id = id;
        this.name = name;
        this.emoji = emoji;
        this.type = type;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    
    public CategoryType getType() { return type; }
    public void setType(CategoryType type) { this.type = type; }
}
