package com.matrimony.eliteinovamatrimonybackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequest {
    @NotNull(message = "Plan ID is required")
    private Long planId;

    @NotNull(message = "Payment method is required")
    private String paymentMethod; // "card", "upi", "netbanking"

    private String upiId;
    private String cardLast4;
    private String bankName;
}