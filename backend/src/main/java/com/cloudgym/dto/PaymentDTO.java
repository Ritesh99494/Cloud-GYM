package com.cloudgym.dto;

import com.cloudgym.entity.Payment;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public class PaymentDTO {
    private Long id;
    private Long userId;
    private Long bookingId;
    private Long subscriptionId;
    private String paymentId;
    private BigDecimal amount;
    private String type;
    private String status;
    private String paymentMethod;
    private String transactionId;
    private LocalDateTime createdAt;

    // Constructors
    public PaymentDTO() {}

    public PaymentDTO(Payment payment) {
        this.id = payment.getId();
        this.userId = payment.getUser().getId();
        this.bookingId = payment.getBooking() != null ? payment.getBooking().getId() : null;
        this.subscriptionId = payment.getSubscription() != null ? payment.getSubscription().getId() : null;
        this.paymentId = payment.getPaymentId();
        this.amount = payment.getAmount();
        this.type = payment.getType().name();
        this.status = payment.getStatus().name();
        this.paymentMethod = payment.getPaymentMethod();
        this.transactionId = payment.getTransactionId();
        this.createdAt = payment.getCreatedAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getSubscriptionId() { return subscriptionId; }
    public void setSubscriptionId(Long subscriptionId) { this.subscriptionId = subscriptionId; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}