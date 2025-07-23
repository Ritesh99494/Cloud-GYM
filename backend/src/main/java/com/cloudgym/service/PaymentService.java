package com.cloudgym.service;

import com.cloudgym.dto.PaymentDTO;
import com.cloudgym.entity.Booking;
import com.cloudgym.entity.Payment;
import com.cloudgym.entity.Subscription;
import com.cloudgym.entity.User;
import com.cloudgym.repository.BookingRepository;
import com.cloudgym.repository.PaymentRepository;
import com.cloudgym.repository.SubscriptionRepository;
import com.cloudgym.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    
    @Autowired
    private SubscriptionService subscriptionService;

    public List<PaymentDTO> getUserPayments(Long userId) {
        logger.info("Getting payments for user ID: {}", userId);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Payment> payments = paymentRepository.findByUserOrderByCreatedAtDesc(user);
            logger.info("Found {} payments for user {}", payments.size(), userId);
            
            return payments.stream()
                    .map(PaymentDTO::new)
                    .toList();
        } catch (Exception e) {
            logger.error("Error getting user payments for user {}: ", userId, e);
            throw e;
        }
    }

    @Transactional
    public Map<String, Object> initiateSubscriptionPayment(Long userId, Subscription.SubscriptionType type) {
        logger.info("Initiating subscription payment for user {} with type {}", userId, type);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create subscription
            Subscription subscription = new Subscription(user, type, BigDecimal.valueOf(type.getPrice()));
            subscription.setStatus(Subscription.SubscriptionStatus.PENDING);
            Subscription savedSubscription = subscriptionRepository.save(subscription);

            // Create payment record
            Payment payment = new Payment(user, BigDecimal.valueOf(type.getPrice()), Payment.PaymentType.SUBSCRIPTION);
            payment.setSubscription(savedSubscription);
            payment.setPaymentId(generatePaymentId());
            Payment savedPayment = paymentRepository.save(payment);

            // In a real implementation, you would integrate with a payment gateway here
            // For now, we'll simulate the payment gateway response
            Map<String, Object> paymentResponse = simulatePaymentGateway(savedPayment);
            
            logger.info("Initiated subscription payment with ID: {}", savedPayment.getPaymentId());
            return paymentResponse;
        } catch (Exception e) {
            logger.error("Error initiating subscription payment for user {}: ", userId, e);
            throw e;
        }
    }

    @Transactional
    public Map<String, Object> initiateBookingPayment(Long userId, Long bookingId) {
        logger.info("Initiating booking payment for user {} and booking {}", userId, bookingId);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            // Create payment record
            Payment payment = new Payment(user, BigDecimal.valueOf(booking.getPrice()), Payment.PaymentType.BOOKING);
            payment.setBooking(booking);
            payment.setPaymentId(generatePaymentId());
            Payment savedPayment = paymentRepository.save(payment);

            // Simulate payment gateway
            Map<String, Object> paymentResponse = simulatePaymentGateway(savedPayment);
            
            logger.info("Initiated booking payment with ID: {}", savedPayment.getPaymentId());
            return paymentResponse;
        } catch (Exception e) {
            logger.error("Error initiating booking payment for user {}: ", userId, e);
            throw e;
        }
    }

    @Transactional
    public PaymentDTO processPaymentCallback(String paymentId, Map<String, Object> callbackData) {
        logger.info("Processing payment callback for payment ID: {}", paymentId);
        try {
            Payment payment = paymentRepository.findByPaymentId(paymentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            String status = (String) callbackData.get("status");
            String transactionId = (String) callbackData.get("transactionId");
            String paymentMethod = (String) callbackData.get("paymentMethod");

            payment.setTransactionId(transactionId);
            payment.setPaymentMethod(paymentMethod);
            payment.setGatewayResponse(callbackData.toString());

            if ("SUCCESS".equals(status)) {
                payment.setStatus(Payment.PaymentStatus.SUCCESS);
                
                // Handle successful payment based on type
                if (payment.getType() == Payment.PaymentType.SUBSCRIPTION) {
                    subscriptionService.activateSubscription(
                        payment.getSubscription().getId(), 
                        paymentId
                    );
                } else if (payment.getType() == Payment.PaymentType.BOOKING) {
                    // Confirm booking
                    Booking booking = payment.getBooking();
                    booking.setStatus(Booking.BookingStatus.CONFIRMED);
                    bookingRepository.save(booking);
                }
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
            }

            Payment updatedPayment = paymentRepository.save(payment);
            logger.info("Processed payment callback for payment {}: {}", paymentId, status);
            
            return new PaymentDTO(updatedPayment);
        } catch (Exception e) {
            logger.error("Error processing payment callback for payment {}: ", paymentId, e);
            throw e;
        }
    }

    public Optional<PaymentDTO> getPaymentByPaymentId(String paymentId) {
        logger.debug("Getting payment by payment ID: {}", paymentId);
        try {
            Optional<Payment> payment = paymentRepository.findByPaymentId(paymentId);
            return payment.map(PaymentDTO::new);
        } catch (Exception e) {
            logger.error("Error getting payment by payment ID {}: ", paymentId, e);
            return Optional.empty();
        }
    }

    @Transactional
    public void cleanupPendingPayments() {
        logger.info("Cleaning up pending payments");
        try {
            LocalDateTime cutoffTime = LocalDateTime.now().minusHours(1); // 1 hour timeout
            List<Payment> pendingPayments = paymentRepository.findPendingPaymentsOlderThan(cutoffTime);
            
            logger.info("Found {} pending payments to cleanup", pendingPayments.size());
            
            for (Payment payment : pendingPayments) {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                paymentRepository.save(payment);
                logger.debug("Marked payment {} as failed due to timeout", payment.getPaymentId());
            }
        } catch (Exception e) {
            logger.error("Error cleaning up pending payments: ", e);
        }
    }

    private String generatePaymentId() {
        return "PAY_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
    }

    private Map<String, Object> simulatePaymentGateway(Payment payment) {
        // This is a simulation - in real implementation, integrate with actual payment gateway
        return Map.of(
            "paymentId", payment.getPaymentId(),
            "amount", payment.getAmount(),
            "currency", "USD",
            "redirectUrl", "http://localhost:5173/payment/redirect?paymentId=" + payment.getPaymentId(),
            "status", "PENDING"
        );
    }
}