package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Boolean success;
    private String message;
    private String transactionId;
    private Long planId;
    private String paymentUrl;
    private String orderId;
    private LocalDateTime timestamp;
    private String error;

    // Success constructor
    public PaymentResponse(Boolean success, String message, String transactionId,
                           Long planId, String paymentUrl, String orderId) {
        this.success = success;
        this.message = message;
        this.transactionId = transactionId;
        this.planId = planId;
        this.paymentUrl = paymentUrl;
        this.orderId = orderId;
        this.timestamp = LocalDateTime.now();
    }

    // Error constructor
    public PaymentResponse(Boolean success, String error) {
        this.success = success;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }
}