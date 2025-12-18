package com.matrimony.eliteinovamatrimonybackend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "interests")
public class Interest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    @ManyToOne
    @JoinColumn(name = "to_user_id", nullable = false) // CHANGED: to_user_id for consistency
    private User toUser;

    @Enumerated(EnumType.STRING)
    private InterestStatus status = InterestStatus.PENDING;

    private LocalDateTime expressedAt = LocalDateTime.now();
    private LocalDateTime respondedAt;

    @Column(columnDefinition = "TEXT")
    private String message;

    // Enum
    public enum InterestStatus {
        PENDING, ACCEPTED, REJECTED
    }
}