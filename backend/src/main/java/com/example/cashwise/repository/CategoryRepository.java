package com.example.cashwise.repository;

import com.example.cashwise.entity.Category;
import com.example.cashwise.entity.Category.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findByIsDefaultTrue();
    
    List<Category> findByUserIdOrIsDefaultTrue(Long userId);
    
    List<Category> findByUserIdAndType(Long userId, CategoryType type);
    
    @Query("SELECT c FROM Category c WHERE (c.user.id = :userId OR c.isDefault = true) AND c.type = :type")
    List<Category> findAvailableCategoriesByType(Long userId, CategoryType type);
}
