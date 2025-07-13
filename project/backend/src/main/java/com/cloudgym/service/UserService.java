package com.cloudgym.service;

import com.cloudgym.dto.UserDTO;
import com.cloudgym.entity.User;
import com.cloudgym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO createUser(UserDTO userDTO, String password) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhone(userDTO.getPhone());
        user.setFitnessGoals(userDTO.getFitnessGoals());

        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser);
    }

    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id).map(UserDTO::new);
    }

    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(UserDTO::new);
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setPhone(userDTO.getPhone());
        user.setFitnessGoals(userDTO.getFitnessGoals());
        user.setProfileImage(userDTO.getProfileImage());

        if (userDTO.getSubscriptionStatus() != null) {
            user.setSubscriptionStatus(User.SubscriptionStatus.valueOf(userDTO.getSubscriptionStatus().toUpperCase()));
        }
        if (userDTO.getSubscriptionPlan() != null) {
            user.setSubscriptionPlan(User.SubscriptionPlan.valueOf(userDTO.getSubscriptionPlan().toUpperCase()));
        }

        User updatedUser = userRepository.save(user);
        return new UserDTO(updatedUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::new)
                .toList();
    }

    public boolean validatePassword(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword());
    }
}