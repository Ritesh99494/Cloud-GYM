@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody Map<String, Object> request) {
        System.out.println("=== REGISTER ENDPOINT DEBUG START ===");
        System.out.println("Register request received: " + request);
        
        try {
            UserDTO userDTO = new UserDTO();
            userDTO.setUsername((String) request.get("username"));
            userDTO.setEmail((String) request.get("email"));
            userDTO.setContactNumber((String) request.get("contactNumber"));
            
            @SuppressWarnings("unchecked")
            List<String> fitnessGoals = (List<String>) request.get("fitnessGoals");
            userDTO.setFitnessGoals(fitnessGoals);

            String password = (String) request.get("password");
            
            System.out.println("Creating user: " + userDTO.getEmail());
            
            UserDTO createdUser = userService.createUser(userDTO, password);
            String token = jwtTokenProvider.generateToken(createdUser.getEmail(), createdUser.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", createdUser);
            response.put("token", token);
            
            System.out.println("Registration successful for user: " + createdUser.getEmail());
            System.out.println("=== REGISTER ENDPOINT DEBUG END - SUCCESS ===");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            System.out.println("=== REGISTER ENDPOINT DEBUG END - ERROR ===");
            return ResponseEntity.badRequest().body(response);
        }
    }