package com.cloudgym.service;

import com.cloudgym.dto.UserDTO;
import com.cloudgym.entity.User;
import com.cloudgym.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        logger.info("UserService initialized with dependencies");
    }

    @Transactional
    public UserDTO createUser(UserDTO userDTO, String password) {
        logger.info("=== CREATE USER DEBUG START ===");
        logger.info("Creating user with email: {}, username: {}", userDTO.getEmail(), userDTO.getUsername());
        
        try {
            // Check if email already exists
            logger.debug("Checking if email exists: {}", userDTO.getEmail());
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                logger.error("Email already exists: {}", userDTO.getEmail());
                throw new RuntimeException("Email already exists");
            }
            
            // Check if username already exists
            logger.debug("Checking if username exists: {}", userDTO.getUsername());
            if (userRepository.existsByUsername(userDTO.getUsername())) {
                logger.error("Username already exists: {}", userDTO.getUsername());
                throw new RuntimeException("Username already exists");
            }
            
            logger.info("Email and username are unique, proceeding with user creation");
            
            // Create new user entity
            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setContactNumber(userDTO.getContactNumber());
            user.setFitnessGoals(userDTO.getFitnessGoals());
            
            // Encrypt password
            logger.debug("Encrypting password (length: {})", password.length());
            String encodedPassword = passwordEncoder.encode(password);
            logger.debug("Password encrypted successfully (encoded length: {})", encodedPassword.length());
            user.setPassword(encodedPassword);
            
            // Log entity before save
            logger.debug("User entity before save: Username={}, Email={}, Contact={}, Role={}, SubscriptionStatus={}, SubscriptionPlan={}", 
                        user.getUsername(), user.getEmail(), user.getContactNumber(), 
                        user.getRole(), user.getSubscriptionStatus(), user.getSubscriptionPlan());
            
            logger.info("Saving user to database...");
            User savedUser = userRepository.save(user);
            
            logger.info("User saved successfully with ID: {}", savedUser.getId());
            logger.debug("Saved user details: {}", savedUser);
            
            UserDTO result = new UserDTO(savedUser);
            logger.info("=== CREATE USER DEBUG END - SUCCESS ===");
            return result;
            
        } catch (Exception e) {
            logger.error("=== CREATE USER DEBUG END - ERROR ===");
            logger.error("Failed to create user: ", e);
            
            // Log specific database errors
            if (e.getCause() != null) {
                logger.error("Root cause: {}", e.getCause().getMessage());
                if (e.getCause().getCause() != null) {
                    logger.error("Nested cause: {}", e.getCause().getCause().getMessage());
                }
            }
            
            throw e;
        }
    }

    public Optional<UserDTO> getUserById(Long id) {
        logger.debug("Getting user by ID: {}", id);
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isPresent()) {
                logger.debug("User found with ID: {}", id);
                return Optional.of(new UserDTO(user.get()));
            } else {
                logger.warn("User not found with ID: {}", id);
                return Optional.empty();
            }
        } catch (Exception e) {
            logger.error("Error getting user by ID {}: ", id, e);
            return Optional.empty();
        }
    }

    public Optional<UserDTO> getUserByEmail(String email) {
        logger.debug("Getting user by email: {}", email);
        try {
            Optional<User> user = userRepository.findByEmail(email);
            if (user.isPresent()) {
                logger.debug("User found with email: {}", email);
                return Optional.of(new UserDTO(user.get()));
            } else {
                logger.warn("User not found with email: {}", email);
                return Optional.empty();
            }
        } catch (Exception e) {
            logger.error("Error getting user by email {}: ", email, e);
            return Optional.empty();
        }
    }

    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        logger.info("Updating user with ID: {}", id);
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            logger.debug("Updating user fields for ID: {}", id);
            user.setUsername(userDTO.getUsername());
            user.setContactNumber(userDTO.getContactNumber());
            user.setFitnessGoals(userDTO.getFitnessGoals());
            user.setProfileImage(userDTO.getProfileImage());

            if (userDTO.getSubscriptionStatus() != null) {
                user.setSubscriptionStatus(User.SubscriptionStatus.valueOf(userDTO.getSubscriptionStatus().toUpperCase()));
            }
            if (userDTO.getSubscriptionPlan() != null) {
                user.setSubscriptionPlan(User.SubscriptionPlan.valueOf(userDTO.getSubscriptionPlan().toUpperCase()));
            }

            User updatedUser = userRepository.save(user);
            logger.info("User updated successfully with ID: {}", id);
            return new UserDTO(updatedUser);
        } catch (Exception e) {
            logger.error("Error updating user with ID {}: ", id, e);
            throw e;
        }
    }

    @Transactional
    public void deleteUser(Long id) {
        logger.info("Deleting user with ID: {}", id);
        try {
            userRepository.deleteById(id);
            logger.info("User deleted successfully with ID: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting user with ID {}: ", id, e);
            throw e;
        }
    }

    public List<UserDTO> getAllUsers() {
        logger.debug("Getting all users");
        try {
            List<User> users = userRepository.findAll();
            logger.debug("Found {} users", users.size());
            return users.stream()
                    .map(UserDTO::new)
                    .toList();
        } catch (Exception e) {
            logger.error("Error getting all users: ", e);
            throw e;
        }
    }

    public boolean validatePassword(String email, String password) {
        logger.debug("=== PASSWORD VALIDATION DEBUG START ===");
        logger.debug("Validating password for email: {}", email);
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                logger.warn("User not found for email: {}", email);
                logger.debug("=== PASSWORD VALIDATION DEBUG END - USER NOT FOUND ===");
                return false;
            }
            
            User user = userOpt.get();
            logger.debug("User found: {}, checking password", user.getUsername());
            
            boolean matches = passwordEncoder.matches(password, user.getPassword());
            logger.debug("Password validation result: {}", matches);
            
            if (!matches) {
                logger.debug("Password mismatch for user: {}", email);
                logger.debug("Provided password length: {}", password.length());
                logger.debug("Stored password hash length: {}", user.getPassword().length());
            }
            
            logger.debug("=== PASSWORD VALIDATION DEBUG END - RESULT: {} ===", matches);
            return matches;
            
        } catch (Exception e) {
            logger.error("=== PASSWORD VALIDATION DEBUG END - ERROR ===");
            logger.error("Error validating password for email {}: ", email, e);
            return false;
        }
    }
}