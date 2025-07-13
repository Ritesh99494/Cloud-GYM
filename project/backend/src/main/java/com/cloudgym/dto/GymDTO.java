package com.cloudgym.dto;

import com.cloudgym.entity.Gym;
import java.util.List;
import java.util.Map;

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

    // Constructors
    public GymDTO() {}

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
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

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