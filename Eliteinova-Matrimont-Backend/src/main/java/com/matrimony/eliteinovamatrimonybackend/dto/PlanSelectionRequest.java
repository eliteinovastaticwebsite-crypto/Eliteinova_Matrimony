package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;

@Data
public class PlanSelectionRequest {
    private PaymentDetails paymentDetails;

    @Data
    public static class PaymentDetails {
        private String paymentMethod; // "CARD", "UPI", "NETBANKING"
        private String cardNumber;
        private String expiryDate;
        private String cvv;
        private String upiId;
        private String bankName;
        private String accountNumber;
        private String ifscCode;
    }
}