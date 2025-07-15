package com.cloudgym.dto;

import com.cloudgym.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

public class UserDTO {
    private Long id;
    
    @NotBlank
    private String username;
    
    @NotBlank
    @Email
    private String email;
    
    private String contactNumber;
    private String role;
    private String subscriptionStatus;
    private String subscriptionPlan;
    private List<String> fitnessGoals;
    private String profileImage;
    private LocalDateTime joinDate;

    // Constructors
    public UserDTO() {}

    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.contactNumber = user.getContactNumber();
        this.role = user.getRole().name();
        this.subscriptionStatus = user.getSubscriptionStatus().name().toLowerCase();
        this.subscriptionPlan = user.getSubscriptionPlan().name().toLowerCase();
        this.fitnessGoals = user.getFitnessGoals();
        this.profileImage = user.getProfileImage();
        this.joinDate = user.getJoinDate();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getSubscriptionStatus() { return subscriptionStatus; }
    public void setSubscriptionStatus(String subscriptionStatus) { this.subscriptionStatus = subscriptionStatus; }

    public String getSubscriptionPlan() { return subscriptionPlan; }
    public void setSubscriptionPlan(String subscriptionPlan) { this.subscriptionPlan = subscriptionPlan; }

    public List<String> getFitnessGoals() { return fitnessGoals; }
    public void setFitnessGoals(List<String> fitnessGoals) { this.fitnessGoals = fitnessGoals; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public LocalDateTime getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDateTime joinDate) { this.joinDate = joinDate; }
}