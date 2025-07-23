package com.cloudgym.controller;

import com.cloudgym.dto.PaymentDTO;
import com.cloudgym.entity.Subscription;
import com.cloudgym.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/my-payments")
    public ResponseEntity<List<PaymentDTO>> getUserPayments(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            List<PaymentDTO> payments = paymentService.getUserPayments(userId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/subscription/initiate")
    public ResponseEntity<Map<String, Object>> initiateSubscriptionPayment(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            Long userId = extractUserIdFromToken(token);
            String typeStr = request.get("type");
            Subscription.SubscriptionType type = Subscription.SubscriptionType.valueOf(typeStr);
            
            Map<String, Object> paymentResponse = paymentService.initiateSubscriptionPayment(userId, type);
            return ResponseEntity.ok(paymentResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/booking/initiate")
    public ResponseEntity<Map<String, Object>> initiateBookingPayment(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        try {
            Long userId = extractUserIdFromToken(token);
            Long bookingId = Long.valueOf(request.get("bookingId").toString());
            
            Map<String, Object> paymentResponse = paymentService.initiateBookingPayment(userId, bookingId);
            return ResponseEntity.ok(paymentResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/callback")
    public ResponseEntity<PaymentDTO> processPaymentCallback(@RequestBody Map<String, Object> callbackData) {
        try {
            String paymentId = (String) callbackData.get("paymentId");
            PaymentDTO payment = paymentService.processPaymentCallback(paymentId, callbackData);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentDTO> getPaymentByPaymentId(@PathVariable String paymentId) {
        try {
            return paymentService.getPaymentByPaymentId(paymentId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private Long extractUserIdFromToken(String token) {
        // Mock implementation - extract user ID from token
        if (token != null && token.startsWith("Bearer mock-jwt-token-")) {
            String userIdStr = token.substring("Bearer mock-jwt-token-".length());
            return Long.parseLong(userIdStr);
        }
        return 1L; // Default user ID for demo
    }
}