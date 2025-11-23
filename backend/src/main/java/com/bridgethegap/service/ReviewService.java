package com.bridgethegap.service;

import com.bridgethegap.entity.Review;
import com.bridgethegap.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    public Review addReview(Review review) {
        Optional<Review> existingReview = reviewRepository.findByUserIdAndProductId(
            review.getUserId(), review.getProductId());
        
        if (existingReview.isPresent()) {
            Review reviewToUpdate = existingReview.get();
            reviewToUpdate.setRating(review.getRating());
            reviewToUpdate.setComment(review.getComment());
            return reviewRepository.save(reviewToUpdate);
        }
        
        return reviewRepository.save(review);
    }
    
    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findReviewsByProductIdOrderByCreatedAtDesc(productId);
    }
    
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
    
    public Review updateReview(Long id, Review reviewDetails) {
        Review review = getReviewById(id);
        
        if (reviewDetails.getRating() != null) {
            review.setRating(reviewDetails.getRating());
        }
        if (reviewDetails.getComment() != null) {
            review.setComment(reviewDetails.getComment());
        }
        
        return reviewRepository.save(review);
    }
    
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found");
        }
        reviewRepository.deleteById(id);
    }
    
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }
    
    public Double getAverageRatingByProductId(Long productId) {
        Double averageRating = reviewRepository.findAverageRatingByProductId(productId);
        return averageRating != null ? averageRating : 0.0;
    }
    
    public Long getReviewCountByProductId(Long productId) {
        return reviewRepository.countReviewsByProductId(productId);
    }
    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}
