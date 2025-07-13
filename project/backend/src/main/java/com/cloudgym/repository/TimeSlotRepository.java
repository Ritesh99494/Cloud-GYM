package com.cloudgym.repository;

import com.cloudgym.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    
    List<TimeSlot> findByGymIdOrderByStartTime(Long gymId);
    
    @Query("SELECT ts FROM TimeSlot ts WHERE ts.gym.id = :gymId AND ts.availableSpots > 0")
    List<TimeSlot> findAvailableSlotsByGymId(@Param("gymId") Long gymId);
}