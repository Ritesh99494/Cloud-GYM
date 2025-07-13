package com.cloudgym.controller;

import com.cloudgym.dto.GymDTO;
import com.cloudgym.service.GymService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/gyms")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GymController {

    @Autowired
    private GymService gymService;

    @GetMapping("/nearby")
    public ResponseEntity<List<GymDTO>> getNearbyGyms(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "10") Double radius) {
        
        List<GymDTO> gyms = gymService.getNearbyGyms(lat, lng, radius);
        return ResponseEntity.ok(gyms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GymDTO> getGymById(@PathVariable Long id) {
        return gymService.getGymById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<GymDTO>> searchGyms(@RequestParam String q) {
        List<GymDTO> gyms = gymService.searchGyms(q);
        return ResponseEntity.ok(gyms);
    }

    @GetMapping
    public ResponseEntity<List<GymDTO>> getAllGyms(
            @RequestParam(required = false) Double minRating) {
        
        List<GymDTO> gyms;
        if (minRating != null) {
            gyms = gymService.getGymsByRating(minRating);
        } else {
            gyms = gymService.getAllGyms();
        }
        return ResponseEntity.ok(gyms);
    }

    @PostMapping
    public ResponseEntity<GymDTO> createGym(@RequestBody GymDTO gymDTO) {
        try {
            GymDTO createdGym = gymService.createGym(gymDTO);
            return ResponseEntity.ok(createdGym);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<GymDTO> updateGym(@PathVariable Long id, @RequestBody GymDTO gymDTO) {
        try {
            GymDTO updatedGym = gymService.updateGym(id, gymDTO);
            return ResponseEntity.ok(updatedGym);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGym(@PathVariable Long id) {
        try {
            gymService.deleteGym(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}