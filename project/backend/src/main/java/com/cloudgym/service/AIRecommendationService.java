package com.cloudgym.service;

import com.cloudgym.dto.GymDTO;
import com.cloudgym.entity.User;
import com.cloudgym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
public class AIRecommendationService {

    @Autowired
    private GymService gymService;

    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> getAIRecommendations(Long userId, Double latitude, Double longitude) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<GymDTO> nearbyGyms = gymService.getNearbyGyms(latitude, longitude, 10.0);
        
        return nearbyGyms.stream()
                .map(gym -> calculateRecommendationScore(gym, user))
                .sorted((a, b) -> Double.compare((Double) b.get("score"), (Double) a.get("score")))
                .limit(5)
                .collect(Collectors.toList());
    }

    private Map<String, Object> calculateRecommendationScore(GymDTO gym, User user) {
        Map<String, Object> recommendation = new HashMap<>();
        double score = 0.0;
        List<String> reasons = new ArrayList<>();
        List<String> matchedGoals = new ArrayList<>();

        // Base score from rating
        score += (gym.getRating() / 5.0) * 0.3;

        // Distance factor (closer is better)
        if (gym.getDistance() != null) {
            double distanceScore = Math.max(0, 1 - (gym.getDistance() / 10.0));
            score += distanceScore * 0.2;
            
            if (gym.getDistance() < 2.0) {
                reasons.add("Very close to your location");
            }
        }

        // Occupancy factor (less crowded is better)
        if (gym.getCurrentOccupancy() != null && gym.getCapacity() != null) {
            double occupancyRate = (double) gym.getCurrentOccupancy() / gym.getCapacity();
            double occupancyScore = 1 - occupancyRate;
            score += occupancyScore * 0.2;
            
            if (occupancyRate < 0.5) {
                reasons.add("Low current occupancy for comfortable workouts");
            }
        }

        // Fitness goals matching
        if (user.getFitnessGoals() != null && gym.getAmenities() != null) {
            for (String goal : user.getFitnessGoals()) {
                switch (goal.toLowerCase()) {
                    case "weight loss":
                    case "cardio":
                        if (gym.getAmenities().contains("Cardio Equipment") || 
                            gym.getName().toLowerCase().contains("cardio")) {
                            score += 0.1;
                            matchedGoals.add(goal);
                            reasons.add("Excellent cardio facilities for " + goal.toLowerCase());
                        }
                        break;
                    case "strength training":
                        if (gym.getAmenities().contains("Equipment") || 
                            gym.getAmenities().contains("Free Weights")) {
                            score += 0.1;
                            matchedGoals.add(goal);
                            reasons.add("Great strength training equipment");
                        }
                        break;
                    case "yoga":
                    case "flexibility":
                        if (gym.getAmenities().contains("Yoga") || 
                            gym.getName().toLowerCase().contains("zen")) {
                            score += 0.1;
                            matchedGoals.add(goal);
                            reasons.add("Specialized yoga and flexibility programs");
                        }
                        break;
                }
            }
        }

        // Premium amenities bonus
        if (gym.getAmenities() != null) {
            if (gym.getAmenities().contains("Sauna")) {
                score += 0.05;
                reasons.add("Premium amenities including sauna");
            }
            if (gym.getAmenities().contains("WiFi")) {
                score += 0.02;
            }
            if (gym.getAmenities().contains("Parking")) {
                score += 0.03;
                reasons.add("Convenient parking available");
            }
        }

        // High rating bonus
        if (gym.getRating() >= 4.5) {
            reasons.add("Highly rated by other users (" + gym.getRating() + " stars)");
        }

        // Ensure score is between 0 and 1
        score = Math.min(1.0, Math.max(0.0, score));

        recommendation.put("gym", gym);
        recommendation.put("score", score);
        recommendation.put("reasons", reasons.subList(0, Math.min(3, reasons.size())));
        recommendation.put("matchedGoals", matchedGoals);

        return recommendation;
    }
}