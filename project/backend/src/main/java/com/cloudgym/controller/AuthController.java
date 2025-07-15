package com.cloudgym.controller;

import com.cloudgym.dto.UserDTO;
import com.cloudgym.service.UserService;
import com.cloudgym.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // ✅ Register endpoint
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

    // ✅ Login endpoint
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
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response); // ✅ Proper fix here
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response); // ✅ Also here
        }
    }

    // ✅ Token validation endpoint
    @GetMapping("/validate")
    public ResponseEntity<UserDTO> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;

            if (jwtTokenProvider.validateToken(jwtToken)) {
                String email = jwtTokenProvider.getEmailFromToken(jwtToken);
                UserDTO user = userService.getUserByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // ✅ Fix for .unauthorized()
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // ✅ Same here
        }
    }
}
