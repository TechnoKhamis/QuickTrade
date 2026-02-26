package com.example.cashwise.service;

import com.example.cashwise.dto.CategoryResponse;
import com.example.cashwise.entity.Category;
import com.example.cashwise.entity.Category.CategoryType;
import com.example.cashwise.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @PostConstruct
    public void initDefaultCategories() {
        if (categoryRepository.findByIsDefaultTrue().isEmpty()) {
            // Income categories
            categoryRepository.save(new Category("Salary", "💰", CategoryType.INCOME, true));
            categoryRepository.save(new Category("Freelance", "💼", CategoryType.INCOME, true));
            categoryRepository.save(new Category("Investment", "📈", CategoryType.INCOME, true));
            categoryRepository.save(new Category("Other Income", "💵", CategoryType.INCOME, true));
            
            // Expense categories
            categoryRepository.save(new Category("Food", "🍔", CategoryType.EXPENSE, true));
            categoryRepository.save(new Category("Transport", "🚗", CategoryType.EXPENSE, true));
            categoryRepository.save(new Category("Shopping", "🛍️", CategoryType.EXPENSE, true));
            categoryRepository.save(new Category("Entertainment", "🎬", CategoryType.EXPENSE, true));
            categoryRepository.save(new Category("Bills", "📄", CategoryType.EXPENSE, true));
            categoryRepository.save(new Category("Healthcare", "🏥", CategoryType.EXPENSE, true));
            categoryRepository.save(new Category("Education", "📚", CategoryType.EXPENSE, true));
            categoryRepository.save(new Category("Other", "📦", CategoryType.EXPENSE, true));
        }
    }
    
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public List<CategoryResponse> getCategoriesByType(CategoryType type) {
        return categoryRepository.findAll()
            .stream()
            .filter(c -> c.getType() == type)
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public CategoryResponse createCategory(String userEmail, com.example.cashwise.dto.CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setEmoji(request.getEmoji());
        category.setType(request.getType());
        category.setIsDefault(false);
        
        category = categoryRepository.save(category);
        return mapToResponse(category);
    }
    
    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getName(),
            category.getEmoji(),
            category.getType()
        );
    }
}
