package com.cloudgym.controller;

import com.cloudgym.dto.GymDTO;
import com.cloudgym.service.GymService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/gyms")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GymController {

    private static final Logger logger = LoggerFactory.getLogger(GymController.class);
    
    @Autowired
    private GymService gymService;

    @GetMapping("/nearby")
    public ResponseEntity<List<GymDTO>> getNearbyGyms(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10") Double radius) {
        
        logger.info("=== NEARBY GYMS DEBUG START ===");
        logger.info("Searching for gyms near coordinates: lat={}, lng={}, radius={}km", lat, lng, radius);
        
        try {
            // Validate coordinates
            if (lat == null || lng == null) {
                logger.error("Invalid coordinates: lat={}, lng={}", lat, lng);
                return ResponseEntity.badRequest().build();
            }
            
            if (lat < -90 || lat > 90) {
                logger.error("Invalid latitude: {} (must be between -90 and 90)", lat);
                return ResponseEntity.badRequest().build();
            }
            
            if (lng < -180 || lng > 180) {
                logger.error("Invalid longitude: {} (must be between -180 and 180)", lng);
                return ResponseEntity.badRequest().build();
            }
            
            if (radius <= 0 || radius > 100) {
                logger.error("Invalid radius: {} (must be between 0 and 100)", radius);
                return ResponseEntity.badRequest().build();
            }
            
            logger.debug("Coordinates validation passed, calling gymService");
            
            List<GymDTO> gyms = gymService.getNearbyGyms(lat, lng, radius);
            
            logger.info("Found {} gyms within {}km radius", gyms.size(), radius);
            
            // Log each gym found
            for (int i = 0; i < gyms.size(); i++) {
                GymDTO gym = gyms.get(i);
                logger.debug("Gym {}: {} - Distance: {}km, Location: ({}, {})", 
                           i + 1, gym.getName(), 
                           gym.getDistance() != null ? String.format("%.2f", gym.getDistance()) : "N/A",
                           gym.getLatitude(), gym.getLongitude());
            }
            
            logger.info("=== NEARBY GYMS DEBUG END - SUCCESS ===");
            return ResponseEntity.ok(gyms);
            
        } catch (Exception e) {
            logger.error("=== NEARBY GYMS DEBUG END - ERROR ===");
            logger.error("Error finding nearby gyms: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<GymDTO> getGymById(@PathVariable Long id) {
        logger.info("Getting gym by ID: {}", id);
        try {
            return gymService.getGymById(id)
                    .map(gym -> {
                        logger.debug("Gym found: {}", gym.getName());
                        return ResponseEntity.ok(gym);
                    })
                    .orElseGet(() -> {
                        logger.warn("Gym not found with ID: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error getting gym by ID {}: ", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<GymDTO>> searchGyms(@RequestParam String q) {
        logger.info("Searching gyms with query: '{}'", q);
        try {
            if (q == null || q.trim().isEmpty()) {
                logger.warn("Empty search query provided");
                return ResponseEntity.badRequest().build();
            }
            
            List<GymDTO> gyms = gymService.searchGyms(q.trim());
            logger.info("Found {} gyms matching query: '{}'", gyms.size(), q);
            return ResponseEntity.ok(gyms);
        } catch (Exception e) {
            logger.error("Error searching gyms with query '{}': ", q, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<GymDTO>> getAllGyms(
            @RequestParam(required = false) Double minRating) {
        
        logger.info("Getting all gyms with minRating: {}", minRating);
        try {
            List<GymDTO> gyms;
            if (minRating != null) {
                if (minRating < 0 || minRating > 5) {
                    logger.error("Invalid rating: {} (must be between 0 and 5)", minRating);
                    return ResponseEntity.badRequest().build();
                }
                gyms = gymService.getGymsByRating(minRating);
                logger.info("Found {} gyms with rating >= {}", gyms.size(), minRating);
            } else {
                gyms = gymService.getAllGyms();
                logger.info("Found {} total gyms", gyms.size());
            }
            return ResponseEntity.ok(gyms);
        } catch (Exception e) {
            logger.error("Error getting gyms: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<GymDTO> createGym(@RequestBody GymDTO gymDTO) {
        logger.info("=== CREATE GYM DEBUG START ===");
        logger.info("Creating gym: {}", gymDTO != null ? gymDTO.getName() : "null");
        logger.info("Request body: {}", gymDTO);
        
        try {
            // Validate required fields
            if (gymDTO.getName() == null || gymDTO.getName().trim().isEmpty()) {
                logger.error("Gym name is required");
                return ResponseEntity.badRequest().body(null);
            }
            
            if (gymDTO.getAddress() == null || gymDTO.getAddress().trim().isEmpty()) {
                logger.error("Gym address is required");
                return ResponseEntity.badRequest().body(null);
            }
            
            if (gymDTO.getLatitude() == null || gymDTO.getLongitude() == null) {
                logger.error("Gym coordinates are required");
                return ResponseEntity.badRequest().body(null);
            }
            
            if (gymDTO.getCapacity() == null || gymDTO.getCapacity() <= 0) {
                logger.error("Valid gym capacity is required");
                return ResponseEntity.badRequest().body(null);
            }
            
            logger.debug("Gym validation passed, creating gym");
            
            GymDTO createdGym = gymService.createGym(gymDTO);
            logger.info("Gym created successfully with ID: {}", createdGym.getId());
            logger.info("=== CREATE GYM DEBUG END - SUCCESS ===");
            return ResponseEntity.status(201).body(createdGym);
            
        } catch (Exception e) {
            logger.error("=== CREATE GYM DEBUG END - ERROR ===");
            logger.error("Error creating gym: ", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<GymDTO> updateGym(@PathVariable Long id, @RequestBody GymDTO gymDTO) {
        logger.info("Updating gym with ID: {}", id);
        try {
            GymDTO updatedGym = gymService.updateGym(id, gymDTO);
            logger.info("Gym updated successfully: {}", updatedGym.getName());
            return ResponseEntity.ok(updatedGym);
        } catch (Exception e) {
            logger.error("Error updating gym with ID {}: ", id, e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGym(@PathVariable Long id) {
        logger.info("Deleting gym with ID: {}", id);
        try {
            gymService.deleteGym(id);
            logger.info("Gym deleted successfully with ID: {}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting gym with ID {}: ", id, e);
            return ResponseEntity.notFound().build();
        }
    }
}