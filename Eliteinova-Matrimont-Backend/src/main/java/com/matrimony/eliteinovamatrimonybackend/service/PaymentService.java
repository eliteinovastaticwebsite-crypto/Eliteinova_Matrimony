package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.dto.PaymentResponse;
import com.matrimony.eliteinovamatrimonybackend.dto.PlanSelectionRequest;
import com.matrimony.eliteinovamatrimonybackend.entity.MembershipPlan;
import com.matrimony.eliteinovamatrimonybackend.entity.PaymentTransaction;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.PaymentTransactionRepository;
import com.matrimony.eliteinovamatrimonybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private MembershipPlanService membershipPlanService;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationService authenticationService; // To get current user

    public PaymentResponse selectPlan(Long planId, PlanSelectionRequest.PaymentDetails paymentDetails) {
        try {
            // Get current user
            User currentUser = authenticationService.getCurrentUser();
            if (currentUser == null) {
                return new PaymentResponse(false, "User not authenticated");
            }

            // Get plan
            Optional<MembershipPlan> planOpt = membershipPlanService.getPlanEntityById(planId);
            if (planOpt.isEmpty()) {
                return new PaymentResponse(false, "Plan not found");
            }

            MembershipPlan plan = planOpt.get();

            // Create payment transaction
            PaymentTransaction payment = new PaymentTransaction();
            payment.setUser(currentUser);
            payment.setPlan(plan);
            payment.setAmount(plan.getPrice());
            payment.setStatus(PaymentTransaction.PaymentStatus.PENDING);
            payment.setPaymentMethod(PaymentTransaction.PaymentMethod.valueOf(
                    paymentDetails.getPaymentMethod().toUpperCase()));

            // Save transaction
            payment = paymentTransactionRepository.save(payment);

            // Process payment with real gateway (example: Razorpay/Stripe)
            boolean paymentSuccess = processWithPaymentGateway(payment, paymentDetails);

            if (paymentSuccess) {
                payment.setStatus(PaymentTransaction.PaymentStatus.COMPLETED);
                payment.setCompletedAt(LocalDateTime.now());
                paymentTransactionRepository.save(payment);

                // Update user membership
                updateUserMembership(currentUser.getId(), plan);

                return new PaymentResponse(
                        true,
                        "Payment processed successfully",
                        payment.getTransactionId(),
                        planId,
                        null,
                        "ORD_" + payment.getId()
                );
            } else {
                payment.setStatus(PaymentTransaction.PaymentStatus.FAILED);
                payment.setFailureReason("Payment gateway declined");
                paymentTransactionRepository.save(payment);

                return new PaymentResponse(false, "Payment failed. Please try again.");
            }

        } catch (Exception e) {
            return new PaymentResponse(false, "Payment processing error: " + e.getMessage());
        }
    }

    private boolean processWithPaymentGateway(PaymentTransaction payment, PlanSelectionRequest.PaymentDetails details) {
        // Implement actual payment gateway integration here
        // This should call Razorpay, Stripe, etc.

        // For now, simulate with these rules:
        // 1. Card payments: Check if card number is valid (simple validation)
        // 2. UPI: Check if UPI ID format is valid
        // 3. Net banking: Always succeeds for demo

        if ("CARD".equalsIgnoreCase(details.getPaymentMethod())) {
            return details.getCardNumber() != null &&
                    details.getCardNumber().matches("\\d{16}") &&
                    details.getExpiryDate() != null &&
                    details.getCvv() != null && details.getCvv().matches("\\d{3}");
        } else if ("UPI".equalsIgnoreCase(details.getPaymentMethod())) {
            return details.getUpiId() != null &&
                    details.getUpiId().matches("[a-zA-Z0-9.]+@[a-zA-Z]+");
        } else {
            return true; // Net banking always succeeds for demo
        }
    }

    private void updateUserMembership(Long userId, MembershipPlan plan) {
        userRepository.findById(userId).ifPresent(user -> {
            User.MembershipType membershipType;
            switch (plan.getName().toUpperCase()) {
                case "SILVER": membershipType = User.MembershipType.SILVER; break;
                case "GOLD": membershipType = User.MembershipType.GOLD; break;
                case "DIAMOND": membershipType = User.MembershipType.DIAMOND; break;
                default: membershipType = User.MembershipType.PREMIUM; break;
            }
            user.setMembership(membershipType);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }
}