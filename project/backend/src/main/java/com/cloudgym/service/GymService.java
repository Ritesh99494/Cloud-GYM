package com.cloudgym.service;

import com.cloudgym.dto.GymDTO;
import com.cloudgym.entity.Gym;
import com.cloudgym.repository.GymRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Service
public class GymService {

    @Autowired
    private GymRepository gymRepository;

    public List<GymDTO> getNearbyGyms(Double latitude, Double longitude, Double radiusInKm) {
        List<Object[]> results = gymRepository.findNearbyGyms(latitude, longitude, radiusInKm);
        
        return results.stream().map(result -> {
            Gym gym = (Gym) result[0];
            BigDecimal distance = (BigDecimal) result[1];
            
            GymDTO gymDTO = new GymDTO(gym);
            gymDTO.setDistance(distance.doubleValue());
            return gymDTO;
        }).toList();
    }

    public Optional<GymDTO> getGymById(Long id) {
        return gymRepository.findById(id).map(GymDTO::new);
    }

    public List<GymDTO> searchGyms(String query) {
        return gymRepository.searchGyms(query).stream()
                .map(GymDTO::new)
                .toList();
    }

    public List<GymDTO> getGymsByRating(Double minRating) {
        return gymRepository.findByRatingGreaterThanEqual(minRating).stream()
                .map(GymDTO::new)
                .toList();
    }

    public List<GymDTO> getAllGyms() {
        return gymRepository.findAll().stream()
                .map(GymDTO::new)
                .toList();
    }

    public GymDTO createGym(GymDTO gymDTO) {
        Gym gym = new Gym();
        gym.setName(gymDTO.getName());
        gym.setAddress(gymDTO.getAddress());
        gym.setLatitude(gymDTO.getLatitude());
        gym.setLongitude(gymDTO.getLongitude());
        gym.setRating(gymDTO.getRating());
        gym.setReviewCount(gymDTO.getReviewCount());
        gym.setAmenities(gymDTO.getAmenities());
        gym.setImages(gymDTO.getImages());
        gym.setOperatingHours(gymDTO.getOperatingHours());
        gym.setCapacity(gymDTO.getCapacity());
        gym.setCurrentOccupancy(gymDTO.getCurrentOccupancy());
        gym.setPriceRange(gymDTO.getPriceRange());
        gym.setDescription(gymDTO.getDescription());
        
        if (gymDTO.getContactInfo() != null) {
            gym.setContactPhone(gymDTO.getContactInfo().getPhone());
            gym.setContactEmail(gymDTO.getContactInfo().getEmail());
        }

        Gym savedGym = gymRepository.save(gym);
        return new GymDTO(savedGym);
    }

    public GymDTO updateGym(Long id, GymDTO gymDTO) {
        Gym gym = gymRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        gym.setName(gymDTO.getName());
        gym.setAddress(gymDTO.getAddress());
        gym.setLatitude(gymDTO.getLatitude());
        gym.setLongitude(gymDTO.getLongitude());
        gym.setRating(gymDTO.getRating());
        gym.setReviewCount(gymDTO.getReviewCount());
        gym.setAmenities(gymDTO.getAmenities());
        gym.setImages(gymDTO.getImages());
        gym.setOperatingHours(gymDTO.getOperatingHours());
        gym.setCapacity(gymDTO.getCapacity());
        gym.setCurrentOccupancy(gymDTO.getCurrentOccupancy());
        gym.setPriceRange(gymDTO.getPriceRange());
        gym.setDescription(gymDTO.getDescription());
        
        if (gymDTO.getContactInfo() != null) {
            gym.setContactPhone(gymDTO.getContactInfo().getPhone());
            gym.setContactEmail(gymDTO.getContactInfo().getEmail());
        }

        Gym updatedGym = gymRepository.save(gym);
        return new GymDTO(updatedGym);
    }

    public void deleteGym(Long id) {
        gymRepository.deleteById(id);
    }
}