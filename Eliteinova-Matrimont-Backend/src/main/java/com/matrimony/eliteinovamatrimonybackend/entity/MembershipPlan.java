package com.matrimony.eliteinovamatrimonybackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "membership_plans", uniqueConstraints = @UniqueConstraint(columnNames = "name"))
public class MembershipPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Silver, Gold, Diamond

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer price; // Store as integer (299, 599, 999)

    @Column(nullable = false)
    private String duration; // "1 month", "3 months", "6 months"

    private Boolean featured = false;
    private Boolean popular = false;
    private String color; // "gray", "gold", "purple"

    @ElementCollection
    @CollectionTable(name = "plan_features", joinColumns = @JoinColumn(name = "plan_id"))
    @Column(name = "feature")
    private List<String> features;

    private String buttonText;
    private String savings; // "Save 40%", "Save 50%"

    @Column(nullable = false)
    private Boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}