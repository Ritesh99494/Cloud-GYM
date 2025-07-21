@@ .. @@
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
+        System.out.println("=== REGISTER ENDPOINT HIT ===");
+        System.out.println("Request: " + request);
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
             
+            System.out.println("Registration successful for: " + createdUser.getEmail());
             return ResponseEntity.ok(response);
         } catch (Exception e) {
+            System.err.println("Registration failed: " + e.getMessage());
+            e.printStackTrace();
             Map<String, Object> response = new HashMap<>();
             response.put("success", false);
             response.put("message", e.getMessage());
             return ResponseEntity.badRequest().body(response);
         }
     }

     @PostMapping("/login")
     public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
+        System.out.println("=== LOGIN ENDPOINT HIT ===");
+        System.out.println("Login attempt for email: " + request.get("email"));
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
                 
+                System.out.println("Login successful for: " + email);
                 return ResponseEntity.ok(response);
             } else {
+                System.out.println("Invalid credentials for: " + email);
                 Map<String, Object> response = new HashMap<>();
                 response.put("success", false);
                 response.put("message", "Invalid email or password");
                 return ResponseEntity.badRequest().body(response);
             }
         } catch (Exception e) {
+            System.err.println("Login error: " + e.getMessage());
+            e.printStackTrace();
             Map<String, Object> response = new HashMap<>();
             response.put("success", false);
             response.put("message", e.getMessage());
             return ResponseEntity.badRequest().body(response);
         }
     }