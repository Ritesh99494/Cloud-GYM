package com.cloudgym.controller;

import com.cloudgym.dto.BookingDTO;
import com.cloudgym.dto.TimeSlotDTO;
import com.cloudgym.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@RequestHeader("Authorization") String token) {
        Long userId = extractUserIdFromToken(token);
        List<BookingDTO> bookings = bookingService.getUserBookings(userId);
        return ResponseEntity.ok(bookings);
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestHeader("Authorization") String token,
                                                   @RequestBody Map<String, Object> request) {
        try {
            Long userId = extractUserIdFromToken(token);
            Long gymId = Long.valueOf(request.get("gymId").toString());
            Long slotId = Long.valueOf(request.get("slotId").toString());
            LocalDate date = LocalDate.parse(request.get("date").toString());
            
            BookingDTO booking = bookingService.createBooking(userId, gymId, slotId, date);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long id) {
        try {
            BookingDTO booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/check-in")
    public ResponseEntity<BookingDTO> checkIn(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String qrCode = request.get("qrCode");
            BookingDTO booking = bookingService.checkIn(id, qrCode);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/check-out")
    public ResponseEntity<BookingDTO> checkOut(@PathVariable Long id) {
        try {
            BookingDTO booking = bookingService.checkOut(id);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Long extractUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer mock-jwt-token-")) {
            String userIdStr = token.substring("Bearer mock-jwt-token-".length());
            return Long.parseLong(userIdStr);
        }
        return 1L;
    }
}

@RestController
@RequestMapping("/gyms")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
class TimeSlotController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/{gymId}/slots")
    public ResponseEntity<List<TimeSlotDTO>> getAvailableSlots(
            @PathVariable Long gymId,
            @RequestParam String date) {
        
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<TimeSlotDTO> slots = bookingService.getAvailableSlots(gymId, localDate);
            return ResponseEntity.ok(slots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}