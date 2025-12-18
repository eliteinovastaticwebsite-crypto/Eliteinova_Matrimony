package com.matrimony.eliteinovamatrimonybackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "contact_requests")
public class ContactRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The user who requested contact (requester)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    // The profile owner (target)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_owner_id", nullable = false)
    private User profileOwner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    private String acceptedLanguage; // 'en', 'hi', etc (for audit/notification language)

    @Column(columnDefinition = "TEXT")
    private String note; // optional message

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED
    }
}
