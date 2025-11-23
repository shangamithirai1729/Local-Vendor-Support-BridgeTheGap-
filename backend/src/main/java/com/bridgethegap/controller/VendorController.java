package com.bridgethegap.controller;

import com.bridgethegap.dto.LocationRequest;
import com.bridgethegap.entity.Vendor;
import com.bridgethegap.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "http://localhost:3000")
public class VendorController {
    
    @Autowired
    private VendorService vendorService;
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getVendorById(@PathVariable Long id) {
        try {
            Vendor vendor = vendorService.getVendorById(id);
            return ResponseEntity.ok(vendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVendor(@PathVariable Long id, @RequestBody Vendor vendorDetails) {
        try {
            Vendor updatedVendor = vendorService.updateVendor(id, vendorDetails);
            return ResponseEntity.ok(updatedVendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVendor(@PathVariable Long id) {
        try {
            vendorService.deleteVendor(id);
            return ResponseEntity.ok("{\"message\":\"Vendor deleted successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getVendorsByCategory(@PathVariable String category) {
        try {
            List<Vendor> vendors = vendorService.getVendorsByCategory(category);
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @PutMapping("/{id}/location")
    public ResponseEntity<?> updateVendorLocation(@PathVariable Long id, @RequestBody LocationRequest locationRequest) {
        try {
            Vendor updatedVendor = vendorService.updateVendorLocation(id, locationRequest);
            return ResponseEntity.ok(updatedVendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/nearby")
    public ResponseEntity<?> getVendorsNearby(@RequestParam BigDecimal latitude, 
                                            @RequestParam BigDecimal longitude,
                                            @RequestParam(defaultValue = "10.0") Double radiusKm) {
        try {
            List<Vendor> vendors = vendorService.getVendorsWithinRadius(latitude, longitude, radiusKm);
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @GetMapping("/nearby/category/{category}")
    public ResponseEntity<?> getVendorsNearbyByCategory(@PathVariable String category,
                                                      @RequestParam BigDecimal latitude, 
                                                      @RequestParam BigDecimal longitude,
                                                      @RequestParam(defaultValue = "10.0") Double radiusKm) {
        try {
            List<Vendor> vendors = vendorService.getVendorsWithinRadiusByCategory(
                latitude, longitude, radiusKm, category);
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
