package com.cloudgym.controller;

import com.cloudgym.dto.UserDTO;
import com.cloudgym.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Mock implementation - extract user ID from token
        Long userId = extractUserIdFromToken(token);
        
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@RequestHeader("Authorization") String token, 
                                                @Valid @RequestBody UserDTO userDTO) {
        Long userId = extractUserIdFromToken(token);
        
        try {
            UserDTO updatedUser = userService.updateUser(userId, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private Long extractUserIdFromToken(String token) {
        // Mock implementation - extract user ID from token
        // In real implementation, you would decode JWT token
        if (token != null && token.startsWith("Bearer mock-jwt-token-")) {
            String userIdStr = token.substring("Bearer mock-jwt-token-".length());
            return Long.parseLong(userIdStr);
        }
        return 1L; // Default user ID for demo
    }
}