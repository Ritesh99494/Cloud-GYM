package com.cloudgym.repository;

import com.cloudgym.entity.Booking;
import com.cloudgym.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = 'CONFIRMED'")
    List<Booking> findActiveBookingsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.gym.id = :gymId AND b.bookingDate = :date")
    List<Booking> findByGymIdAndDate(@Param("gymId") Long gymId, @Param("date") LocalDate date);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.timeSlot.id = :timeSlotId AND b.bookingDate = :date AND b.status = 'CONFIRMED'")
    Long countConfirmedBookingsByTimeSlotAndDate(@Param("timeSlotId") Long timeSlotId, @Param("date") LocalDate date);
}