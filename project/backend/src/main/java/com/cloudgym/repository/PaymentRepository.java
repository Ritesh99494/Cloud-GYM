package com.cloudgym.repository;

import com.cloudgym.entity.Payment;
import com.cloudgym.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<Payment> findByPaymentId(String paymentId);
    
    @Query("SELECT p FROM Payment p WHERE p.user.id = :userId AND p.status = 'SUCCESS'")
    List<Payment> findSuccessfulPaymentsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Payment p WHERE p.booking.id = :bookingId")
    Optional<Payment> findByBookingId(@Param("bookingId") Long bookingId);
    
    @Query("SELECT p FROM Payment p WHERE p.subscription.id = :subscriptionId")
    Optional<Payment> findBySubscriptionId(@Param("subscriptionId") Long subscriptionId);
    
    @Query("SELECT p FROM Payment p WHERE p.status = 'PENDING' AND p.createdAt < :cutoffTime")
    List<Payment> findPendingPaymentsOlderThan(@Param("cutoffTime") java.time.LocalDateTime cutoffTime);
}