package com.bridgethegap.controller;

import com.bridgethegap.dto.LoginRequest;
import com.bridgethegap.entity.Admin;
import com.bridgethegap.entity.User;
import com.bridgethegap.entity.Vendor;
import com.bridgethegap.service.AdminService;
import com.bridgethegap.service.UserService;
import com.bridgethegap.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private VendorService vendorService;
    
    @Autowired
    private AdminService adminService;
    
    @PostMapping("/user/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            
            savedUser.setPassword(null);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/user/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.loginUser(loginRequest);
            
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/vendor/register")
    public ResponseEntity<?> registerVendor(@RequestBody Vendor vendor) {
        try {
            Vendor savedVendor = vendorService.registerVendor(vendor);
            
            savedVendor.setPassword(null);
            return ResponseEntity.ok(savedVendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/vendor/login")
    public ResponseEntity<?> loginVendor(@RequestBody LoginRequest loginRequest) {
        try {
            Vendor vendor = vendorService.loginVendor(loginRequest);
            
            vendor.setPassword(null);
            return ResponseEntity.ok(vendor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
    
    @PostMapping("/admin/login")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest loginRequest) {
        try {
            Admin admin = adminService.loginAdmin(loginRequest);
            
            admin.setPassword(null);
            return ResponseEntity.ok(admin);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
