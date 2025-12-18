package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.dto.MembershipPlanResponse;
import com.matrimony.eliteinovamatrimonybackend.entity.MembershipPlan;
import com.matrimony.eliteinovamatrimonybackend.repository.MembershipPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MembershipPlanService {

    @Autowired
    private MembershipPlanRepository membershipPlanRepository;

    public Optional<MembershipPlanResponse> getPlanById(Long planId) {
        return membershipPlanRepository.findByIdAndActiveTrue(planId)
                .map(this::convertToResponse);
    }

    public Optional<MembershipPlan> getPlanEntityById(Long planId) {
        return membershipPlanRepository.findByIdAndActiveTrue(planId);
    }

    public List<MembershipPlanResponse> getFeaturedPlans() {
        List<MembershipPlan> plans = membershipPlanRepository.findByFeaturedTrueAndActiveTrue();
        return plans.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<MembershipPlanResponse> getPopularPlans() {
        List<MembershipPlan> plans = membershipPlanRepository.findByPopularTrueAndActiveTrue();
        return plans.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private MembershipPlanResponse convertToResponse(MembershipPlan plan) {
        MembershipPlanResponse response = new MembershipPlanResponse();
        response.setId(plan.getId());
        response.setName(plan.getName());
        response.setDescription(plan.getDescription());
        // ✅ FIXED: Directly set Integer price (no conversion needed)
        response.setPrice(plan.getPrice() != null ? plan.getPrice() : 0);
        response.setDuration(plan.getDuration());
        response.setFeatured(plan.getFeatured());
        response.setPopular(plan.getPopular());
        response.setColor(plan.getColor());
        response.setFeatures(plan.getFeatures());
        response.setButtonText(plan.getButtonText());
        response.setSavings(plan.getSavings());
        response.setActive(plan.getActive());
        return response;
    }

    public boolean planExists(Long planId) {
        return membershipPlanRepository.findByIdAndActiveTrue(planId).isPresent();
    }

    // Get all plans (including inactive for admin)
    public List<MembershipPlan> getAllPlans() {
        return membershipPlanRepository.findAll();
    }

    // Create or update plan
    public MembershipPlan savePlan(MembershipPlan plan) {
        return membershipPlanRepository.save(plan);
    }

    // Delete plan (soft delete)
    public void deletePlan(Long planId) {
        membershipPlanRepository.findById(planId).ifPresent(plan -> {
            plan.setActive(false);
            membershipPlanRepository.save(plan);
        });
    }

    public List<MembershipPlanResponse> getAllActivePlans() {
        List<MembershipPlan> plans = membershipPlanRepository.findByActiveTrueOrderByPriceAsc();

        // Filter duplicates - keep only one plan per name (case-insensitive)
        Map<String, MembershipPlan> uniquePlans = new LinkedHashMap<>();

        for (MembershipPlan plan : plans) {
            String nameKey = plan.getName().toLowerCase();
            if (!uniquePlans.containsKey(nameKey)) {
                uniquePlans.put(nameKey, plan);
            } else {
                // If duplicate found, keep the one with better data
                MembershipPlan existing = uniquePlans.get(nameKey);
                if (shouldReplace(existing, plan)) {
                    uniquePlans.put(nameKey, plan);
                }
            }
        }

        return uniquePlans.values().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private boolean shouldReplace(MembershipPlan existing, MembershipPlan newPlan) {
        // Replace if new plan is more recent
        return newPlan.getUpdatedAt().isAfter(existing.getUpdatedAt());
    }
}