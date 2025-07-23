package com.cloudgym.service;

import com.cloudgym.dto.SubscriptionDTO;
import com.cloudgym.entity.Subscription;
import com.cloudgym.entity.User;
import com.cloudgym.repository.SubscriptionRepository;
import com.cloudgym.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Service
@Transactional
public class SubscriptionService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionService.class);
    
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<SubscriptionDTO> getUserSubscriptions(Long userId) {
        logger.info("Getting subscriptions for user ID: {}", userId);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Subscription> subscriptions = subscriptionRepository.findByUserOrderByCreatedAtDesc(user);
            logger.info("Found {} subscriptions for user {}", subscriptions.size(), userId);
            
            return subscriptions.stream()
                    .map(SubscriptionDTO::new)
                    .toList();
        } catch (Exception e) {
            logger.error("Error getting user subscriptions for user {}: ", userId, e);
            throw e;
        }
    }

    public Optional<SubscriptionDTO> getActiveSubscription(Long userId) {
        logger.info("Getting active subscription for user ID: {}", userId);
        try {
            Optional<Subscription> subscription = subscriptionRepository
                    .findActiveSubscriptionByUserId(userId, LocalDateTime.now());
            
            if (subscription.isPresent()) {
                logger.info("Found active subscription for user {}: {}", userId, subscription.get().getId());
                return Optional.of(new SubscriptionDTO(subscription.get()));
            } else {
                logger.info("No active subscription found for user {}", userId);
                return Optional.empty();
            }
        } catch (Exception e) {
            logger.error("Error getting active subscription for user {}: ", userId, e);
            return Optional.empty();
        }
    }

    public boolean hasActiveSubscription(Long userId) {
        logger.debug("Checking if user {} has active subscription", userId);
        try {
            Optional<Subscription> subscription = subscriptionRepository
                    .findActiveSubscriptionByUserId(userId, LocalDateTime.now());
            boolean hasActive = subscription.isPresent();
            logger.debug("User {} has active subscription: {}", userId, hasActive);
            return hasActive;
        } catch (Exception e) {
            logger.error("Error checking active subscription for user {}: ", userId, e);
            return false;
        }
    }

    @Transactional
    public SubscriptionDTO createSubscription(Long userId, Subscription.SubscriptionType type) {
        logger.info("Creating subscription for user {} with type {}", userId, type);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if user already has an active subscription
            if (hasActiveSubscription(userId)) {
                throw new RuntimeException("User already has an active subscription");
            }

            BigDecimal amount = BigDecimal.valueOf(type.getPrice());
            Subscription subscription = new Subscription(user, type, amount);
            subscription.setStatus(Subscription.SubscriptionStatus.PENDING);

            Subscription savedSubscription = subscriptionRepository.save(subscription);
            logger.info("Created subscription with ID: {}", savedSubscription.getId());

            return new SubscriptionDTO(savedSubscription);
        } catch (Exception e) {
            logger.error("Error creating subscription for user {}: ", userId, e);
            throw e;
        }
    }

    @Transactional
    public SubscriptionDTO activateSubscription(Long subscriptionId, String paymentId) {
        logger.info("Activating subscription {} with payment ID {}", subscriptionId, paymentId);
        try {
            Subscription subscription = subscriptionRepository.findById(subscriptionId)
                    .orElseThrow(() -> new RuntimeException("Subscription not found"));

            subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscription.setPaymentId(paymentId);
            subscription.setPaymentStatus("SUCCESS");

            // Update user subscription status
            User user = subscription.getUser();
            user.setSubscriptionStatus(User.SubscriptionStatus.ACTIVE);
            user.setSubscriptionPlan(mapToUserSubscriptionPlan(subscription.getType()));
            userRepository.save(user);

            Subscription updatedSubscription = subscriptionRepository.save(subscription);
            logger.info("Activated subscription {}", subscriptionId);

            return new SubscriptionDTO(updatedSubscription);
        } catch (Exception e) {
            logger.error("Error activating subscription {}: ", subscriptionId, e);
            throw e;
        }
    }

    @Transactional
    public void cancelSubscription(Long subscriptionId) {
        logger.info("Cancelling subscription {}", subscriptionId);
        try {
            Subscription subscription = subscriptionRepository.findById(subscriptionId)
                    .orElseThrow(() -> new RuntimeException("Subscription not found"));

            subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);

            // Update user subscription status
            User user = subscription.getUser();
            user.setSubscriptionStatus(User.SubscriptionStatus.INACTIVE);
            userRepository.save(user);

            subscriptionRepository.save(subscription);
            logger.info("Cancelled subscription {}", subscriptionId);
        } catch (Exception e) {
            logger.error("Error cancelling subscription {}: ", subscriptionId, e);
            throw e;
        }
    }

    @Transactional
    public void expireSubscriptions() {
        logger.info("Running subscription expiry check");
        try {
            List<Subscription> expiredSubscriptions = subscriptionRepository
                    .findExpiredActiveSubscriptions(LocalDateTime.now());

            logger.info("Found {} expired subscriptions", expiredSubscriptions.size());

            for (Subscription subscription : expiredSubscriptions) {
                subscription.setStatus(Subscription.SubscriptionStatus.EXPIRED);
                
                // Update user subscription status
                User user = subscription.getUser();
                user.setSubscriptionStatus(User.SubscriptionStatus.EXPIRED);
                userRepository.save(user);
                
                subscriptionRepository.save(subscription);
                logger.info("Expired subscription {} for user {}", 
                           subscription.getId(), user.getId());
            }
        } catch (Exception e) {
            logger.error("Error expiring subscriptions: ", e);
        }
    }

    public List<Subscription.SubscriptionType> getAvailablePlans() {
        return List.of(Subscription.SubscriptionType.values());
    }

    private User.SubscriptionPlan mapToUserSubscriptionPlan(Subscription.SubscriptionType type) {
        return switch (type) {
            case ONE_MONTH -> User.SubscriptionPlan.BASIC;
            case SIX_MONTHS -> User.SubscriptionPlan.PREMIUM;
            case ONE_YEAR -> User.SubscriptionPlan.ELITE;
        };
    }
}