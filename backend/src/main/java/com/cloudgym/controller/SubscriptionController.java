package com.cloudgym.controller;

import com.cloudgym.dto.SubscriptionDTO;
import com.cloudgym.entity.Subscription;
import com.cloudgym.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<List<Map<String, Object>>> getSubscriptionPlans() {
        try {
            List<Map<String, Object>> plans = subscriptionService.getAvailablePlans().stream()
                    .map(type -> Map.of(
                        "type", type.name(),
                        "name", type.getDisplayName(),
                        "price", type.getPrice(),
                        "duration", getDurationText(type)
                    ))
                    .toList();
            
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/my-subscriptions")
    public ResponseEntity<List<SubscriptionDTO>> getUserSubscriptions(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            List<SubscriptionDTO> subscriptions = subscriptionService.getUserSubscriptions(userId);
            return ResponseEntity.ok(subscriptions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/active")
    public ResponseEntity<SubscriptionDTO> getActiveSubscription(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            return subscriptionService.getActiveSubscription(userId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSubscriptionStatus(@RequestHeader("Authorization") String token) {
        try {
            Long userId = extractUserIdFromToken(token);
            boolean hasActive = subscriptionService.hasActiveSubscription(userId);
            
            Map<String, Object> status = Map.of(
                "hasActiveSubscription", hasActive,
                "userId", userId
            );
            
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<SubscriptionDTO> createSubscription(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> request) {
        try {
            Long userId = extractUserIdFromToken(token);
            String typeStr = request.get("type");
            Subscription.SubscriptionType type = Subscription.SubscriptionType.valueOf(typeStr);
            
            SubscriptionDTO subscription = subscriptionService.createSubscription(userId, type);
            return ResponseEntity.ok(subscription);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelSubscription(@PathVariable Long id) {
        try {
            subscriptionService.cancelSubscription(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
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

    private String getDurationText(Subscription.SubscriptionType type) {
        return switch (type) {
            case ONE_MONTH -> "1 Month";
            case SIX_MONTHS -> "6 Months";
            case ONE_YEAR -> "12 Months";
        };
    }
}