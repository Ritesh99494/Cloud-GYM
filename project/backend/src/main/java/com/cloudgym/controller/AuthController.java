package com.cloudgym.controller;

import com.cloudgym.dto.UserDTO;
import com.cloudgym.service.UserService;
import com.cloudgym.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody Map<String, Object> request) {
        try {
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername((String) request.get("username"));
            userDTO.setEmail((String) request.get("email"));
            userDTO.setContactNumber((String) request.get("contactNumber"));
            
            @SuppressWarnings("unchecked")
            List<String> fitnessGoals = (List<String>) request.get("fitnessGoals");
            userDTO.setFitnessGoals(fitnessGoals);

            String password = (String) request.get("password");
            
            UserDTO createdUser = userService.createUser(userDTO, password);
            String token = jwtTokenProvider.generateToken(createdUser.getEmail(), createdUser.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", createdUser);
            response.put("token", token);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            if (userService.validatePassword(email, password)) {
                UserDTO user = userService.getUserByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", user);
                response.put("token", token);
                
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Invalid email or password");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<UserDTO> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7); // Remove "Bearer " prefix
            if (jwtTokenProvider.validateToken(jwtToken)) {
                String email = jwtTokenProvider.getEmailFromToken(jwtToken);
                UserDTO user = userService.getUserByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(401).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}