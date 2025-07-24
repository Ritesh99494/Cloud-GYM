package com.cloudgym.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "subscriptions")
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @NotNull
    private SubscriptionType type;

    @Enumerated(EnumType.STRING)
    @NotNull
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    @NotNull
    private BigDecimal amount;

    private String paymentId;
    private String paymentStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Subscription() {}

    public Subscription(User user, SubscriptionType type, BigDecimal amount) {
        this.user = user;
        this.type = type;
        this.amount = amount;
        this.startDate = LocalDateTime.now();
        this.endDate = calculateEndDate(type);
    }

    private LocalDateTime calculateEndDate(SubscriptionType type) {
        LocalDateTime start = LocalDateTime.now();
        return switch (type) {
            case ONE_MONTH -> start.plusMonths(1);
            case SIX_MONTHS -> start.plusMonths(6);
            case ONE_YEAR -> start.plusYears(1);
        };
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public SubscriptionType getType() { return type; }
    public void setType(SubscriptionType type) { this.type = type; }

    public SubscriptionStatus getStatus() { return status; }
    public void setStatus(SubscriptionStatus status) { this.status = status; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return status == SubscriptionStatus.ACTIVE && 
               LocalDateTime.now().isBefore(endDate);
    }

    public enum SubscriptionType {
        ONE_MONTH(29.99, "1 Month Plan"),
        SIX_MONTHS(149.99, "6 Months Plan"),
        ONE_YEAR(249.99, "1 Year Plan");

        private final double price;
        private final String displayName;

        SubscriptionType(double price, String displayName) {
            this.price = price;
            this.displayName = displayName;
        }

        public double getPrice() { return price; }
        public String getDisplayName() { return displayName; }
    }

    public enum SubscriptionStatus {
        ACTIVE, EXPIRED, CANCELLED, PENDING
    }
}