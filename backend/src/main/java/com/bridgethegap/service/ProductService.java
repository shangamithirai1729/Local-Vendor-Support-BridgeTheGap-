package com.bridgethegap.service;

import com.bridgethegap.entity.Product;
import com.bridgethegap.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findByIsActiveTrue();
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        if (productDetails.getName() != null) {
            product.setName(productDetails.getName());
        }
        if (productDetails.getDescription() != null) {
            product.setDescription(productDetails.getDescription());
        }
        if (productDetails.getPrice() != null) {
            product.setPrice(productDetails.getPrice());
        }
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory());
        }
        if (productDetails.getImageUrl() != null) {
            product.setImageUrl(productDetails.getImageUrl());
        }
        if (productDetails.getIsActive() != null) {
            product.setIsActive(productDetails.getIsActive());
        }
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public Product activateProduct(Long id) {
        Product product = getProductById(id);
        product.setIsActive(true);
        return productRepository.save(product);
    }

    public List<Product> activateProductsByVendor(Long vendorId) {
        List<Product> vendorProducts = productRepository.findByVendorId(vendorId);
        for (Product p : vendorProducts) {
            p.setIsActive(true);
        }
        return productRepository.saveAll(vendorProducts);
    }
    
    public List<Product> getProductsByVendorId(Long vendorId) {
        // Return all products for the vendor to match Admin visibility.
        // If you want to filter, ensure legacy rows have isActive properly set first.
        return productRepository.findByVendorId(vendorId);
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findActiveProductsByCategory(category);
    }
    
    public List<Product> searchProducts(String searchTerm) {
        return productRepository.searchActiveProducts(searchTerm);
    }
    
    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }
}
