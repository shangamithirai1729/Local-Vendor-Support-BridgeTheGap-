package com.bridgethegap.repository;

import com.bridgethegap.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByVendorId(Long vendorId);
    
    List<Product> findByCategory(String category);
    
    List<Product> findByIsActiveTrue();
    
    List<Product> findByVendorIdAndIsActiveTrue(Long vendorId);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND p.category = :category")
    List<Product> findActiveProductsByCategory(@Param("category") String category);
    
    @Query("SELECT p FROM Product p WHERE p.isActive = true AND " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> searchActiveProducts(@Param("searchTerm") String searchTerm);
}
