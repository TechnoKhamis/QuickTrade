package com.example.cashwise.dto;

import com.example.cashwise.entity.Category.CategoryType;

public class CategoryRequest {
    
    private String name;
    private String emoji;
    private CategoryType type;
    
    public CategoryRequest() {}
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    
    public CategoryType getType() { return type; }
    public void setType(CategoryType type) { this.type = type; }
}
