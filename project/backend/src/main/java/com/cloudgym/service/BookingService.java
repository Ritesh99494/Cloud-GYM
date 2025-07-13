package com.cloudgym.service;

import com.cloudgym.dto.BookingDTO;
import com.cloudgym.dto.TimeSlotDTO;
import com.cloudgym.entity.Booking;
import com.cloudgym.entity.Gym;
import com.cloudgym.entity.TimeSlot;
import com.cloudgym.entity.User;
import com.cloudgym.repository.BookingRepository;
import com.cloudgym.repository.GymRepository;
import com.cloudgym.repository.TimeSlotRepository;
import com.cloudgym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    public List<TimeSlotDTO> getAvailableSlots(Long gymId, LocalDate date) {
        List<TimeSlot> timeSlots = timeSlotRepository.findByGymIdOrderByStartTime(gymId);
        
        return timeSlots.stream().map(slot -> {
            Long bookedCount = bookingRepository.countConfirmedBookingsByTimeSlotAndDate(slot.getId(), date);
            TimeSlotDTO dto = new TimeSlotDTO(slot);
            dto.setAvailableSpots(slot.getTotalSpots() - bookedCount.intValue());
            return dto;
        }).toList();
    }

    @Transactional
    public BookingDTO createBooking(Long userId, Long gymId, Long timeSlotId, LocalDate bookingDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));
        
        TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                .orElseThrow(() -> new RuntimeException("Time slot not found"));

        // Check availability
        Long bookedCount = bookingRepository.countConfirmedBookingsByTimeSlotAndDate(timeSlotId, bookingDate);
        if (bookedCount >= timeSlot.getTotalSpots()) {
            throw new RuntimeException("Time slot is fully booked");
        }

        // Create booking
        Booking booking = new Booking(user, gym, timeSlot, bookingDate, timeSlot.getPrice());
        booking.setQrCode(generateQRCode());
        
        Booking savedBooking = bookingRepository.save(booking);
        return new BookingDTO(savedBooking);
    }

    public List<BookingDTO> getUserBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return bookingRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(BookingDTO::new)
                .toList();
    }

    public Optional<BookingDTO> getBookingById(Long id) {
        return bookingRepository.findById(id).map(BookingDTO::new);
    }

    @Transactional
    public BookingDTO cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new RuntimeException("Booking cannot be cancelled");
        }
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingDTO(updatedBooking);
    }

    @Transactional
    public BookingDTO checkIn(Long bookingId, String qrCode) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getQrCode().equals(qrCode)) {
            throw new RuntimeException("Invalid QR code");
        }
        
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new RuntimeException("Booking is not confirmed");
        }
        
        booking.setCheckInTime(LocalDateTime.now());
        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingDTO(updatedBooking);
    }

    @Transactional
    public BookingDTO checkOut(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getCheckInTime() == null) {
            throw new RuntimeException("User has not checked in");
        }
        
        booking.setCheckOutTime(LocalDateTime.now());
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingDTO(updatedBooking);
    }

    private String generateQRCode() {
        return UUID.randomUUID().toString();
    }
}