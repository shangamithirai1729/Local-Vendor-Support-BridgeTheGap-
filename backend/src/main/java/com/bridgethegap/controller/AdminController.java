package com.bridgethegap.controller;

import com.bridgethegap.entity.Product;
import com.bridgethegap.entity.Review;
import com.bridgethegap.entity.User;
import com.bridgethegap.entity.Vendor;
import com.bridgethegap.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok("{\"message\":\"User deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/vendors")
    public ResponseEntity<?> getAllVendors() {
        try {
            List<Vendor> vendors = adminService.getAllVendors();
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/vendors/{vendorId}")
    public ResponseEntity<?> deleteVendor(@PathVariable Long vendorId) {
        try {
            adminService.deleteVendor(vendorId);
            return ResponseEntity.ok("{\"message\":\"Vendor deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        try {
            List<Product> products = adminService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        try {
            adminService.deleteProduct(productId);
            return ResponseEntity.ok("{\"message\":\"Product deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/products/{productId}/activate")
    public ResponseEntity<?> activateProduct(@PathVariable Long productId) {
        try {
            Product product = adminService.activateProduct(productId);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/vendors/{vendorId}/products/activate")
    public ResponseEntity<?> activateProductsByVendor(@PathVariable Long vendorId) {
        try {
            return ResponseEntity.ok(adminService.activateProductsByVendor(vendorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/reviews")
    public ResponseEntity<?> getAllReviews() {
        try {
            List<Review> reviews = adminService.getAllReviews();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        try {
            adminService.deleteReview(reviewId);
            return ResponseEntity.ok("{\"message\":\"Review deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
