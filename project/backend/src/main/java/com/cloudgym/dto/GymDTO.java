package com.cloudgym.dto;

import com.cloudgym.entity.Gym;
import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GymDTO {
    private Long id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double distance;
    private Double rating;
    private Integer reviewCount;
    private List<String> amenities;
    private List<String> images;
    private Map<String, String> operatingHours;
    private Integer capacity;
    private Integer currentOccupancy;
    private String priceRange;
    private String description;
    private ContactInfo contactInfo;

    public GymDTO() {}

    // Constructor for mapping from Gym entity
    public GymDTO(Gym gym) {
        this.id = gym.getId();
        this.name = gym.getName();
        this.address = gym.getAddress();
        this.latitude = gym.getLatitude();
        this.longitude = gym.getLongitude();
        this.rating = gym.getRating();
        this.reviewCount = gym.getReviewCount();
        this.amenities = gym.getAmenities();
        this.images = gym.getImages();
        this.operatingHours = gym.getOperatingHours();
        this.capacity = gym.getCapacity();
        this.currentOccupancy = gym.getCurrentOccupancy();
        this.priceRange = gym.getPriceRange();
        this.description = gym.getDescription();
        this.contactInfo = new ContactInfo(gym.getContactPhone(), gym.getContactEmail());
    }

    // Constructor for mapping from native query result
    public GymDTO(Object[] result) {
        ObjectMapper mapper = new ObjectMapper();
        this.id = result[0] != null ? ((Number) result[0]).longValue() : null;
        this.name = (String) result[1];
        this.address = (String) result[2];
        this.latitude = result[3] != null ? ((Number) result[3]).doubleValue() : null;
        this.longitude = result[4] != null ? ((Number) result[4]).doubleValue() : null;
        this.rating = result[5] != null ? ((Number) result[5]).doubleValue() : null;
        this.reviewCount = result[6] != null ? ((Number) result[6]).intValue() : null;

        // Parse amenities (assume comma-separated string or JSON array)
        // In GymDTO(Object[] result)
if (result[9] instanceof String) {
    String opHoursStr = (String) result[9];
    Map<String, String> opHoursMap = new HashMap<>();
    if (!opHoursStr.isEmpty()) {
        String[] pairs = opHoursStr.split(",");
        for (String pair : pairs) {
            String[] kv = pair.split(":");
            if (kv.length == 2) {
                opHoursMap.put(kv[0], kv[1]);
            }
        }
    }
    this.operatingHours = opHoursMap;
} else {
    this.operatingHours = Collections.emptyMap();
}

        // Parse images (assume comma-separated string or JSON array)
        if (result[8] instanceof String) {
            String imagesStr = (String) result[8];
            if (imagesStr.startsWith("[") && imagesStr.endsWith("]")) {
                try {
                    this.images = mapper.readValue(imagesStr, new TypeReference<List<String>>() {});
                } catch (Exception e) {
                    this.images = Collections.emptyList();
                }
            } else if (!imagesStr.isEmpty()) {
                this.images = Arrays.asList(imagesStr.split(","));
            } else {
                this.images = Collections.emptyList();
            }
        } else {
            this.images = Collections.emptyList();
        }

        // Parse operatingHours (assume JSON string)
        if (result[9] instanceof String) {
            String opHoursStr = (String) result[9];
            try {
                this.operatingHours = mapper.readValue(opHoursStr, new TypeReference<Map<String, String>>() {});
            } catch (Exception e) {
                this.operatingHours = Collections.emptyMap();
            }
        } else {
            this.operatingHours = Collections.emptyMap();
        }

        this.capacity = result[10] != null ? ((Number) result[10]).intValue() : null;
        this.currentOccupancy = result[11] != null ? ((Number) result[11]).intValue() : null;
        this.priceRange = (String) result[12];
        this.description = (String) result[13];

        String phone = result[14] instanceof String ? (String) result[14] : null;
        String email = result[15] instanceof String ? (String) result[15] : null;
        this.contactInfo = new ContactInfo(phone, email);

        this.distance = result[16] != null ? ((Number) result[16]).doubleValue() : null;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getDistance() { return distance; }
    public void setDistance(Double distance) { this.distance = distance; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> result) { this.amenities = result; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public Map<String, String> getOperatingHours() { return operatingHours; }
    public void setOperatingHours(Map<String, String> operatingHours) { this.operatingHours = operatingHours; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getCurrentOccupancy() { return currentOccupancy; }
    public void setCurrentOccupancy(Integer currentOccupancy) { this.currentOccupancy = currentOccupancy; }

    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ContactInfo getContactInfo() { return contactInfo; }
    public void setContactInfo(ContactInfo contactInfo) { this.contactInfo = contactInfo; }

    public static class ContactInfo {
        private String phone;
        private String email;

        public ContactInfo() {}

        public ContactInfo(String phone, String email) {
            this.phone = phone;
            this.email = email;
        }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}