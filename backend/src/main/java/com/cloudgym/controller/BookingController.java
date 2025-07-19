@@ .. @@
 @RestController
-@RequestMapping("/bookings")
+@RequestMapping("/api/bookings")
 @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
 public class BookingController {
@@ .. @@
 @RestController
-@RequestMapping("/gyms")
+@RequestMapping("/api/gyms")
 @CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
 class TimeSlotController {