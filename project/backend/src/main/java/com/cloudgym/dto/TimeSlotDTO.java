package com.cloudgym.dto;

import com.cloudgym.entity.TimeSlot;
import java.time.LocalTime;

public class TimeSlotDTO {
    private Long id;
    private Long gymId;
    private String startTime;
    private String endTime;
    private Integer availableSpots;
    private Integer totalSpots;
    private Double price;

    // Constructors
    public TimeSlotDTO() {}

    public TimeSlotDTO(TimeSlot timeSlot) {
        this.id = timeSlot.getId();
        this.gymId = timeSlot.getGym().getId();
        this.startTime = timeSlot.getStartTime().toString();
        this.endTime = timeSlot.getEndTime().toString();
        this.availableSpots = timeSlot.getAvailableSpots();
        this.totalSpots = timeSlot.getTotalSpots();
        this.price = timeSlot.getPrice();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public Integer getAvailableSpots() { return availableSpots; }
    public void setAvailableSpots(Integer availableSpots) { this.availableSpots = availableSpots; }

    public Integer getTotalSpots() { return totalSpots; }
    public void setTotalSpots(Integer totalSpots) { this.totalSpots = totalSpots; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}