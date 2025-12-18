package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class MembershipPlanResponse {
    private Long id;
    private String name;
    private String description;
    private Integer price; // ✅ Keep as Integer to match entity
    private String duration;
    private Boolean featured;
    private Boolean popular;
    private String color;
    private List<String> features;
    private String buttonText;
    private String savings;
    private Boolean active;

    // Constructors
    public MembershipPlanResponse() {}

    public MembershipPlanResponse(Long id, String name, String description, Integer price,
                                  String duration, Boolean featured, Boolean popular,
                                  String color, List<String> features, String buttonText,
                                  String savings) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price; // ✅ Integer, not String
        this.duration = duration;
        this.featured = featured;
        this.popular = popular;
        this.color = color;
        this.features = features;
        this.buttonText = buttonText;
        this.savings = savings;
    }
}