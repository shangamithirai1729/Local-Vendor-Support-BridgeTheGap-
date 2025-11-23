package com.bridgethegap.repository;

import com.bridgethegap.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    Optional<Vendor> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<Vendor> findByCategory(String category);
    
    @Query("SELECT v FROM Vendor v WHERE v.latitude IS NOT NULL AND v.longitude IS NOT NULL")
    List<Vendor> findVendorsWithLocation();
    
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:lng)) + sin(radians(:lat)) * " +
            "sin(radians(latitude)))) AS distance " +
            "FROM vendors " +
            "WHERE latitude IS NOT NULL AND longitude IS NOT NULL " +
            "HAVING distance < :radius " +
            "ORDER BY distance", nativeQuery = true)
    List<Vendor> findVendorsWithinRadius(@Param("lat") BigDecimal latitude, 
                                       @Param("lng") BigDecimal longitude, 
                                       @Param("radius") double radiusKm);
    
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:lng)) + sin(radians(:lat)) * " +
            "sin(radians(latitude)))) AS distance " +
            "FROM vendors " +
            "WHERE latitude IS NOT NULL AND longitude IS NOT NULL " +
            "AND category = :category " +
            "HAVING distance < :radius " +
            "ORDER BY distance", nativeQuery = true)
    List<Vendor> findVendorsWithinRadiusByCategory(@Param("lat") BigDecimal latitude, 
                                                  @Param("lng") BigDecimal longitude, 
                                                  @Param("radius") double radiusKm,
                                                  @Param("category") String category);
}
