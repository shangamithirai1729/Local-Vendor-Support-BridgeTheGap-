package com.bridgethegap.service;

import com.bridgethegap.dto.LoginRequest;
import com.bridgethegap.dto.LocationRequest;
import com.bridgethegap.entity.Vendor;
import com.bridgethegap.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class VendorService {
    
    @Autowired
    private VendorRepository vendorRepository;

    public Vendor registerVendor(Vendor vendor) {
        if (vendorRepository.existsByEmail(vendor.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        vendor.setPassword(vendor.getPassword());
        return vendorRepository.save(vendor);
    }

    public Vendor loginVendor(LoginRequest loginRequest) {
        Optional<Vendor> vendorOpt = vendorRepository.findByEmail(loginRequest.getEmail());
        if (vendorOpt.isEmpty()) {
            throw new RuntimeException("Vendor not found");
        }

        Vendor vendor = vendorOpt.get();
        // Removed password check for simplicity

        return vendor;
    }
    
    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }
    
    public Vendor updateVendor(Long id, Vendor vendorDetails) {
        Vendor vendor = getVendorById(id);
        
        if (vendorDetails.getName() != null) {
            vendor.setName(vendorDetails.getName());
        }
        if (vendorDetails.getCategory() != null) {
            vendor.setCategory(vendorDetails.getCategory());
        }
        if (vendorDetails.getEmail() != null && !vendorDetails.getEmail().equals(vendor.getEmail())) {
            if (vendorRepository.existsByEmail(vendorDetails.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            vendor.setEmail(vendorDetails.getEmail());
        }
        if (vendorDetails.getPassword() != null) {
            vendor.setPassword(vendorDetails.getPassword());
        }
        if (vendorDetails.getDescription() != null) {
            vendor.setDescription(vendorDetails.getDescription());
        }
        if (vendorDetails.getPhone() != null) {
            vendor.setPhone(vendorDetails.getPhone());
        }
        if (vendorDetails.getAddress() != null) {
            vendor.setAddress(vendorDetails.getAddress());
        }
        if (vendorDetails.getLatitude() != null) {
            vendor.setLatitude(vendorDetails.getLatitude());
        }
        if (vendorDetails.getLongitude() != null) {
            vendor.setLongitude(vendorDetails.getLongitude());
        }
        
        return vendorRepository.save(vendor);
    }
    
    public void deleteVendor(Long id) {
        if (!vendorRepository.existsById(id)) {
            throw new RuntimeException("Vendor not found");
        }
        vendorRepository.deleteById(id);
    }
    
    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }
    
    public List<Vendor> getVendorsByCategory(String category) {
        return vendorRepository.findByCategory(category);
    }
    
    public Vendor updateVendorLocation(Long id, LocationRequest locationRequest) {
        Vendor vendor = getVendorById(id);
        vendor.setLatitude(locationRequest.getLatitude());
        vendor.setLongitude(locationRequest.getLongitude());
        return vendorRepository.save(vendor);
    }
    
    public List<Vendor> getVendorsWithinRadius(BigDecimal latitude, BigDecimal longitude, double radiusKm) {
        return vendorRepository.findVendorsWithinRadius(latitude, longitude, radiusKm);
    }
    
    public List<Vendor> getVendorsWithinRadiusByCategory(BigDecimal latitude, BigDecimal longitude, 
                                                        double radiusKm, String category) {
        return vendorRepository.findVendorsWithinRadiusByCategory(latitude, longitude, radiusKm, category);
    }
}
