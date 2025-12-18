package com.matrimony.eliteinovamatrimonybackend.dto;

import lombok.Data;

@Data
public class ServiceCategoryResponse {
    private String id;
    private String name;
    private Long count;

    public ServiceCategoryResponse(String id, String name, Long count) {
        this.id = id;
        this.name = name;
        this.count = count;
    }
}