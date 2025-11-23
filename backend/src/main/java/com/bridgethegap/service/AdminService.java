package com.bridgethegap.service;

import com.bridgethegap.dto.LoginRequest;
import com.bridgethegap.entity.Admin;
import com.bridgethegap.entity.Product;
import com.bridgethegap.entity.Review;
import com.bridgethegap.entity.User;
import com.bridgethegap.entity.Vendor;
import com.bridgethegap.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private VendorService vendorService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ReviewService reviewService;

    public Admin loginAdmin(LoginRequest loginRequest) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(loginRequest.getEmail());
        if (adminOpt.isEmpty()) {
            throw new RuntimeException("Admin not found");
        }

        Admin admin = adminOpt.get();
        // Removed password check for simplicity

        return admin;
    }
    
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }
    
    // User Management
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    public void deleteUser(Long userId) {
        userService.deleteUser(userId);
    }
    
    // Vendor Management
    public List<Vendor> getAllVendors() {
        return vendorService.getAllVendors();
    }
    
    public void deleteVendor(Long vendorId) {
        vendorService.deleteVendor(vendorId);
    }
    
    // Product Management
    public List<Product> getAllProducts() {
        return productService.getAllProductsForAdmin();
    }
    
    public void deleteProduct(Long productId) {
        productService.deleteProduct(productId);
    }

    public Product activateProduct(Long productId) {
        return productService.activateProduct(productId);
    }

    public List<Product> activateProductsByVendor(Long vendorId) {
        return productService.activateProductsByVendor(vendorId);
    }
    
    // Review Management
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }
    
    public void deleteReview(Long reviewId) {
        reviewService.deleteReview(reviewId);
    }
}
