package com.bridgethegap.service;

import com.bridgethegap.dto.LoginRequest;
import com.bridgethegap.dto.LocationRequest;
import com.bridgethegap.entity.User;
import com.bridgethegap.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(user.getPassword());
        return userRepository.save(user);
    }

    public User loginUser(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        return user;
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        
        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPassword() != null) {
            user.setPassword(userDetails.getPassword());
        }
        if (userDetails.getLatitude() != null) {
            user.setLatitude(userDetails.getLatitude());
        }
        if (userDetails.getLongitude() != null) {
            user.setLongitude(userDetails.getLongitude());
        }
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User updateUserLocation(Long id, LocationRequest locationRequest) {
        User user = getUserById(id);
        user.setLatitude(locationRequest.getLatitude());
        user.setLongitude(locationRequest.getLongitude());
        return userRepository.save(user);
    }
    
    public List<User> getUsersWithinRadius(BigDecimal latitude, BigDecimal longitude, double radiusKm) {
        return userRepository.findUsersWithinRadius(latitude, longitude, radiusKm);
    }
}
