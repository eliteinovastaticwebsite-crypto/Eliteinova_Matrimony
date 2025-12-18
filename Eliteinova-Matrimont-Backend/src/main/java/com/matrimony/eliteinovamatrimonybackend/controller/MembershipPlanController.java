package com.matrimony.eliteinovamatrimonybackend.controller;

import com.matrimony.eliteinovamatrimonybackend.dto.*;
import com.matrimony.eliteinovamatrimonybackend.service.MembershipPlanService;
import com.matrimony.eliteinovamatrimonybackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "http://localhost:3000")
public class MembershipPlanController {

    @Autowired
    private MembershipPlanService membershipPlanService;

    @Autowired
    private PaymentService paymentService;

    // === GET ALL PLANS ===
    @GetMapping
    public ResponseEntity<?> getAllPlans() {
        try {
            List<MembershipPlanResponse> plans = membershipPlanService.getAllActivePlans();

            Map<String, Object> response = new HashMap<>();
            response.put("data", plans);
            response.put("success", true);
            response.put("message", "Plans fetched successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch plans: " + e.getMessage()));
        }
    }

    // === GET PLAN BY ID ===
    @GetMapping("/{planId}")
    public ResponseEntity<?> getPlanById(@PathVariable Long planId) {
        try {
            Optional<MembershipPlanResponse> planOpt = membershipPlanService.getPlanById(planId);

            if (planOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("data", planOpt.get());
                response.put("success", true);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch plan: " + e.getMessage()));
        }
    }

    // === SELECT PLAN (Initiate payment process) ===
    @PostMapping("/{planId}/select")
    public ResponseEntity<?> selectPlan(
            @PathVariable Long planId,
            @RequestBody(required = false) PlanSelectionRequest request) {

        try {
            // Validate plan exists
            if (!membershipPlanService.planExists(planId)) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Plan not found"));
            }

            PaymentResponse paymentResponse = paymentService.selectPlan(
                    planId,
                    request != null ? request.getPaymentDetails() : null
            );

            if (paymentResponse.getSuccess()) {
                return ResponseEntity.ok(paymentResponse);
            } else {
                return ResponseEntity.badRequest().body(paymentResponse);
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to select plan: " + e.getMessage()));
        }
    }

    // === PROCESS PAYMENT ===
    @PostMapping("/{planId}/payment")
    public ResponseEntity<?> processPayment(
            @PathVariable Long planId,
            @RequestBody PlanSelectionRequest request) {

        try {
            // Validate plan exists
            if (!membershipPlanService.planExists(planId)) {
                return ResponseEntity.badRequest()
                        .body(createErrorResponse("Plan not found"));
            }

            PaymentResponse paymentResponse = paymentService.selectPlan(
                    planId,
                    request != null ? request.getPaymentDetails() : null
            );

            if (paymentResponse.getSuccess()) {
                return ResponseEntity.ok(paymentResponse);
            } else {
                return ResponseEntity.badRequest().body(paymentResponse);
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Payment processing failed: " + e.getMessage()));
        }
    }

    // === GET FEATURED PLANS ===
    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedPlans() {
        try {
            List<MembershipPlanResponse> featuredPlans = membershipPlanService.getFeaturedPlans();

            Map<String, Object> response = new HashMap<>();
            response.put("data", featuredPlans);
            response.put("success", true);
            response.put("message", "Featured plans fetched successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch featured plans: " + e.getMessage()));
        }
    }

    // === GET POPULAR PLANS ===
    @GetMapping("/popular")
    public ResponseEntity<?> getPopularPlans() {
        try {
            List<MembershipPlanResponse> popularPlans = membershipPlanService.getPopularPlans();

            Map<String, Object> response = new HashMap<>();
            response.put("data", popularPlans);
            response.put("success", true);
            response.put("message", "Popular plans fetched successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(createErrorResponse("Failed to fetch popular plans: " + e.getMessage()));
        }
    }

    // === HELPER METHOD ===
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", message);
        return response;
    }
}