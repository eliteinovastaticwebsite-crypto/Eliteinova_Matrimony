package com.matrimony.eliteinovamatrimonybackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // CHANGED: Auto-generated ID

    private String transactionId; // ADDED: External transaction ID

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private MembershipPlan plan;

    private Integer amount;
    private Integer originalAmount;
    private Integer tax;
    private Integer discount = 0;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String paymentGateway;
    private String cardLast4;
    private String upiId;
    private String bankName;
    private String failureReason;
    private String invoiceId;
    private Integer refundAmount;
    private String refundReason;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime completedAt;
    private LocalDateTime refundedAt;

    // Enums
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }

    public enum PaymentMethod {
        CARD, UPI, NETBANKING, WALLET
    }
}