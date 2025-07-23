@@ .. @@
 import com.cloudgym.entity.User;
 import com.cloudgym.repository.BookingRepository;
 import com.cloudgym.repository.GymRepository;
+import com.cloudgym.repository.SubscriptionRepository;
 import com.cloudgym.repository.TimeSlotRepository;
 import com.cloudgym.repository.UserRepository;
 import org.springframework.beans.factory.annotation.Autowired;
@@ .. @@
     @Autowired
     private TimeSlotRepository timeSlotRepository;

+    @Autowired
+    private SubscriptionRepository subscriptionRepository;
+
     public List<TimeSlotDTO> getAvailableSlots(Long gymId, LocalDate date) {
@@ .. @@
     }

     @Transactional
-    public BookingDTO createBooking(Long userId, Long gymId, Long timeSlotId, LocalDate bookingDate) {
+    public BookingDTO createBooking(Long userId, Long gymId, Long timeSlotId, LocalDate bookingDate, boolean requiresPayment) {
         User user = userRepository.findById(userId)
                 .orElseThrow(() -> new RuntimeException("User not found"));
         
@@ .. @@
         if (bookedCount >= timeSlot.getTotalSpots()) {
             throw new RuntimeException("Time slot is fully booked");
         }

+        // Check if user has active subscription
+        boolean hasActiveSubscription = subscriptionRepository
+                .findActiveSubscriptionByUserId(userId, LocalDateTime.now())
+                .isPresent();
+
         // Create booking
         Booking booking = new Booking(user, gym, timeSlot, bookingDate, timeSlot.getPrice());
         booking.setQrCode(generateQRCode());
+        
+        // Set booking status based on subscription and payment requirement
+        if (hasActiveSubscription) {
+            booking.setStatus(Booking.BookingStatus.CONFIRMED);
+        } else if (requiresPayment) {
+            booking.setStatus(Booking.BookingStatus.PENDING_PAYMENT);
+        } else {
+            booking.setStatus(Booking.BookingStatus.CONFIRMED);
+        }
         
         Booking savedBooking = bookingRepository.save(booking);
         return new BookingDTO(savedBooking);
@@ .. @@
         return UUID.randomUUID().toString();
     }
 }