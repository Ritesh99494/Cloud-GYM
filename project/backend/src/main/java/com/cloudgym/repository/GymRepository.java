package com.cloudgym.repository;

import com.cloudgym.entity.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GymRepository extends JpaRepository<Gym, Long> {
    @Query(value = "SELECT g.id, g.name, g.address, g.latitude, g.longitude, g.rating, g.review_count, " +
           "GROUP_CONCAT(DISTINCT a.amenity) AS amenities, " +
           "GROUP_CONCAT(DISTINCT i.image_url) AS images, " +
           "GROUP_CONCAT(DISTINCT CONCAT(oh.day_of_week, ':', oh.hours)) AS operating_hours, " +
           "g.capacity, g.current_occupancy, g.price_range, g.description, g.contact_phone, g.contact_email, " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(g.latitude)) * " +
           "cos(radians(g.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(g.latitude)))) AS distance " +
           "FROM gyms g " +
           "LEFT JOIN gym_amenities a ON g.id = a.gym_id " +
           "LEFT JOIN gym_images i ON g.id = i.gym_id " +
           "LEFT JOIN gym_operating_hours oh ON g.id = oh.gym_id " +
           "GROUP BY g.id " +
           "HAVING distance <= :radiusInKm " +
           "ORDER BY distance", nativeQuery = true)
List<Object[]> findNearbyGyms(@Param("lat") Double latitude,
                              @Param("lng") Double longitude,
                              @Param("radiusInKm") Double radiusInKm);

    @Query("SELECT g FROM Gym g WHERE " +
           "LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(g.address) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Gym> searchGyms(@Param("query") String query);

    @Query("SELECT g FROM Gym g WHERE g.rating >= :minRating")
    List<Gym> findByRatingGreaterThanEqual(@Param("minRating") Double minRating);
}