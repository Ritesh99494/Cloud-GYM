package com.cloudgym.dto;

import com.cloudgym.entity.Booking;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDTO {
    private Long id;
    private Long userId;
    private Long gymId;
    private GymDTO gym;
    private TimeSlotDTO timeSlot;
    
    @NotNull
    private LocalDate bookingDate;
    
    private String status;
    private String qrCode;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Double price;
    private LocalDateTime createdAt;

    // Constructors
    public BookingDTO() {}

    public BookingDTO(Booking booking) {
        this.id = booking.getId();
        this.userId = booking.getUser().getId();
        this.gymId = booking.getGym().getId();
        this.gym = new GymDTO(booking.getGym());
        this.timeSlot = new TimeSlotDTO(booking.getTimeSlot());
        this.bookingDate = booking.getBookingDate();
        this.status = booking.getStatus().name().toLowerCase();
        this.qrCode = booking.getQrCode();
        this.checkInTime = booking.getCheckInTime();
        this.checkOutTime = booking.getCheckOutTime();
        this.price = booking.getPrice();
        this.createdAt = booking.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getGymId() { return gymId; }
    public void setGymId(Long gymId) { this.gymId = gymId; }

    public GymDTO getGym() { return gym; }
    public void setGym(GymDTO gym) { this.gym = gym; }

    public TimeSlotDTO getTimeSlot() { return timeSlot; }
    public void setTimeSlot(TimeSlotDTO timeSlot) { this.timeSlot = timeSlot; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}