package com.cloudgym.repository;

import com.cloudgym.entity.Subscription;
import com.cloudgym.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    List<Subscription> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT s FROM Subscription s WHERE s.user = :user AND s.status = 'ACTIVE' AND s.endDate > :now")
    Optional<Subscription> findActiveSubscriptionByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId AND s.status = 'ACTIVE' AND s.endDate > :now")
    Optional<Subscription> findActiveSubscriptionByUserId(@Param("userId") Long userId, @Param("now") LocalDateTime now);
    
    @Query("SELECT s FROM Subscription s WHERE s.endDate < :now AND s.status = 'ACTIVE'")
    List<Subscription> findExpiredActiveSubscriptions(@Param("now") LocalDateTime now);
    
    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.user = :user AND s.status = 'ACTIVE'")
    Long countActiveSubscriptionsByUser(@Param("user") User user);
    
    List<Subscription> findByPaymentId(String paymentId);
}