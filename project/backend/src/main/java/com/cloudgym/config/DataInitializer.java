package com.cloudgym.config;

import com.cloudgym.entity.Gym;
import com.cloudgym.entity.TimeSlot;
import com.cloudgym.entity.User;
import com.cloudgym.repository.GymRepository;
import com.cloudgym.repository.TimeSlotRepository;
import com.cloudgym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (gymRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Create sample user
        User user = new User();
        user.setUsername("johndoe");
        user.setEmail("john.doe@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setContactNumber("+1234567890");
        user.setSubscriptionStatus(User.SubscriptionStatus.ACTIVE);
        user.setSubscriptionPlan(User.SubscriptionPlan.PREMIUM);
        user.setFitnessGoals(Arrays.asList("Weight Loss", "Strength Training", "Cardio"));
        userRepository.save(user);

        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@cloudgym.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setContactNumber("+1234567891");
        admin.setRole(User.Role.ADMIN);
        admin.setSubscriptionStatus(User.SubscriptionStatus.ACTIVE);
        admin.setSubscriptionPlan(User.SubscriptionPlan.ELITE);
        userRepository.save(admin);

        // Create sample gyms
        Gym gym1 = createGym(
            "FitZone Downtown",
            "123 Main St, Downtown",
            40.7128, -74.0060,
            4.5, 324,
            Arrays.asList("WiFi", "Parking", "Equipment", "Sauna"),
            Arrays.asList("https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg"),
            150, 45,
            "$25-35",
            "Modern fitness center with state-of-the-art equipment",
            "+1-555-0123", "info@fitzone.com"
        );

        Gym gym2 = createGym(
            "PowerHouse Gym",
            "456 Oak Ave, Midtown",
            40.7589, -73.9851,
            4.2, 189,
            Arrays.asList("Equipment", "Parking", "Personal Training"),
            Arrays.asList("https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"),
            200, 180,
            "$30-45",
            "Serious training facility for dedicated athletes",
            "+1-555-0456", "contact@powerhouse.com"
        );

        Gym gym3 = createGym(
            "Zen Fitness Studio",
            "789 Pine St, Uptown",
            40.7831, -73.9712,
            4.8, 267,
            Arrays.asList("WiFi", "Yoga", "Meditation", "Sauna"),
            Arrays.asList("https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg"),
            80, 25,
            "$20-30",
            "Holistic wellness center focusing on mind-body connection",
            "+1-555-0789", "hello@zenfitness.com"
        );

        gymRepository.saveAll(Arrays.asList(gym1, gym2, gym3));

        // Create time slots for each gym
        createTimeSlots(gym1);
        createTimeSlots(gym2);
        createTimeSlots(gym3);
    }

    private Gym createGym(String name, String address, Double lat, Double lng, 
                         Double rating, Integer reviewCount, List<String> amenities,
                         List<String> images, Integer capacity, Integer currentOccupancy,
                         String priceRange, String description, String phone, String email) {
        
        Gym gym = new Gym();
        gym.setName(name);
        gym.setAddress(address);
        gym.setLatitude(lat);
        gym.setLongitude(lng);
        gym.setRating(rating);
        gym.setReviewCount(reviewCount);
        gym.setAmenities(amenities);
        gym.setImages(images);
        gym.setCapacity(capacity);
        gym.setCurrentOccupancy(currentOccupancy);
        gym.setPriceRange(priceRange);
        gym.setDescription(description);
        gym.setContactPhone(phone);
        gym.setContactEmail(email);

        // Set operating hours
        Map<String, String> operatingHours = new HashMap<>();
        operatingHours.put("monday", "06:00-22:00");
        operatingHours.put("tuesday", "06:00-22:00");
        operatingHours.put("wednesday", "06:00-22:00");
        operatingHours.put("thursday", "06:00-22:00");
        operatingHours.put("friday", "06:00-22:00");
        operatingHours.put("saturday", "08:00-20:00");
        operatingHours.put("sunday", "08:00-20:00");
        gym.setOperatingHours(operatingHours);

        return gym;
    }

    private void createTimeSlots(Gym gym) {
        List<TimeSlot> timeSlots = Arrays.asList(
            new TimeSlot(gym, LocalTime.of(6, 0), LocalTime.of(8, 0), 20, 25.0),
            new TimeSlot(gym, LocalTime.of(8, 0), LocalTime.of(10, 0), 20, 30.0),
            new TimeSlot(gym, LocalTime.of(10, 0), LocalTime.of(12, 0), 20, 35.0),
            new TimeSlot(gym, LocalTime.of(12, 0), LocalTime.of(14, 0), 20, 35.0),
            new TimeSlot(gym, LocalTime.of(14, 0), LocalTime.of(16, 0), 20, 30.0),
            new TimeSlot(gym, LocalTime.of(16, 0), LocalTime.of(18, 0), 20, 35.0),
            new TimeSlot(gym, LocalTime.of(18, 0), LocalTime.of(20, 0), 20, 40.0),
            new TimeSlot(gym, LocalTime.of(20, 0), LocalTime.of(22, 0), 20, 30.0)
        );
        
        timeSlotRepository.saveAll(timeSlots);
    }
}