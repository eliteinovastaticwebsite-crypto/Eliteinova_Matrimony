package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class ServiceResponse {
    private Long id;
    private String name;
    private String description;
    private String duration;
    private String category;
    private Boolean featured;
    private Boolean popular;
    private String badge;
    private List<String> features;
    private String iconName;

    // Constructors
    public ServiceResponse() {}

    public ServiceResponse(Long id, String name, String description, String duration,
                           String category, Boolean featured, Boolean popular,
                           String badge, List<String> features, String iconName) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.category = category;
        this.featured = featured;
        this.popular = popular;
        this.badge = badge;
        this.features = features;
        this.iconName = iconName;
    }
}