package com.bridgethegap.repository;

import com.bridgethegap.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.latitude IS NOT NULL AND u.longitude IS NOT NULL")
    List<User> findUsersWithLocation();
    
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:lng)) + sin(radians(:lat)) * " +
            "sin(radians(latitude)))) AS distance " +
            "FROM users " +
            "WHERE latitude IS NOT NULL AND longitude IS NOT NULL " +
            "HAVING distance < :radius " +
            "ORDER BY distance", nativeQuery = true)
    List<User> findUsersWithinRadius(@Param("lat") BigDecimal latitude, 
                                   @Param("lng") BigDecimal longitude, 
                                   @Param("radius") double radiusKm);
}
