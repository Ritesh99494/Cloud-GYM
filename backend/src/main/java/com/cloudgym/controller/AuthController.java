@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        System.out.println("=== LOGIN ENDPOINT DEBUG START ===");
        System.out.println("Login request received: " + request);
        
        try {
            String email = request.get("email");
            String password = request.get("password");
            
            System.out.println("Email: " + email);
            System.out.println("Password provided: " + (password != null && !password.isEmpty()));
            
            if (userService.validatePassword(email, password)) {
                UserDTO user = userService.getUserByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                
                String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", user);
                response.put("token", token);
                
                System.out.println("Login successful for user: " + user.getEmail());
                System.out.println("=== LOGIN ENDPOINT DEBUG END - SUCCESS ===");
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Password validation failed for email: " + email);
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Invalid email or password");
                System.out.println("=== LOGIN ENDPOINT DEBUG END - INVALID CREDENTIALS ===");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            System.out.println("=== LOGIN ENDPOINT DEBUG END - ERROR ===");
            return ResponseEntity.badRequest().body(response);
        }
    }