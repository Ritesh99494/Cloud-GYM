package com.cloudgym.dto;

import com.cloudgym.entity.Subscription;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public class SubscriptionDTO {
    private Long id;
    private Long userId;
    private String type;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal amount;
    private String paymentId;
    private String paymentStatus;
    private boolean active;
    private long daysRemaining;
    private LocalDateTime createdAt;

    // Constructors
    public SubscriptionDTO() {}

    public SubscriptionDTO(Subscription subscription) {
        this.id = subscription.getId();
        this.userId = subscription.getUser().getId();
        this.type = subscription.getType().name();
        this.status = subscription.getStatus().name();
        this.startDate = subscription.getStartDate();
        this.endDate = subscription.getEndDate();
        this.amount = subscription.getAmount();
        this.paymentId = subscription.getPaymentId();
        this.paymentStatus = subscription.getPaymentStatus();
        this.active = subscription.isActive();
        this.daysRemaining = calculateDaysRemaining(subscription.getEndDate());
        this.createdAt = subscription.getCreatedAt();
    }

    private long calculateDaysRemaining(LocalDateTime endDate) {
        if (endDate == null) return 0;
        LocalDateTime now = LocalDateTime.now();
        if (now.isAfter(endDate)) return 0;
        return java.time.Duration.between(now, endDate).toDays();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

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

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}