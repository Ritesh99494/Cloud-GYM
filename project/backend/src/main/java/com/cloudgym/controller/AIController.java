package com.cloudgym.controller;

import com.cloudgym.service.AIRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AIController {

    @Autowired
    private AIRecommendationService aiRecommendationService;

    @PostMapping("/recommendations")
    public ResponseEntity<List<Map<String, Object>>> getAIRecommendations(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> request) {
        
        try {
            Long userId = extractUserIdFromToken(token);
            Double latitude = Double.valueOf(request.get("latitude").toString());
            Double longitude = Double.valueOf(request.get("longitude").toString());
            
            List<Map<String, Object>> recommendations = aiRecommendationService
                    .getAIRecommendations(userId, latitude, longitude);
            
            return ResponseEntity.ok(recommendations);
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