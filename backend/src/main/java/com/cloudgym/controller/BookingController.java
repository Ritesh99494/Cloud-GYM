@@ .. @@
 import com.cloudgym.dto.BookingDTO;
 import com.cloudgym.dto.TimeSlotDTO;
 import com.cloudgym.service.BookingService;
+import com.cloudgym.service.SubscriptionService;
 import org.springframework.beans.factory.annotation.Autowired;
@@ .. @@
     @Autowired
     private BookingService bookingService;

+    @Autowired
+    private SubscriptionService subscriptionService;
+
     @GetMapping("/my-bookings")
@@ .. @@
             Long userId = extractUserIdFromToken(token);
             Long gymId = Long.valueOf(request.get("gymId").toString());
             Long slotId = Long.valueOf(request.get("slotId").toString());
             LocalDate date = LocalDate.parse(request.get("date").toString());
+            
+            // Check if user has active subscription
+            boolean hasActiveSubscription = subscriptionService.hasActiveSubscription(userId);
+            boolean requiresPayment = !hasActiveSubscription;
             
-            BookingDTO booking = bookingService.createBooking(userId, gymId, slotId, date);
+            BookingDTO booking = bookingService.createBooking(userId, gymId, slotId, date, requiresPayment);
             return ResponseEntity.ok(booking);
         } catch (Exception e) {