package com.bridgethegap.repository;

import com.bridgethegap.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByProductId(Long productId);
    
    List<Review> findByUserId(Long userId);
    
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.productId = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.productId = :productId")
    Long countReviewsByProductId(@Param("productId") Long productId);
    
    @Query("SELECT r FROM Review r WHERE r.productId = :productId ORDER BY r.createdAt DESC")
    List<Review> findReviewsByProductIdOrderByCreatedAtDesc(@Param("productId") Long productId);
}
