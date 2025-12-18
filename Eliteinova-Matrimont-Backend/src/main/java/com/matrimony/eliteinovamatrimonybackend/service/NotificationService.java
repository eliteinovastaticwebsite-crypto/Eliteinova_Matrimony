package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.dto.NotificationDTO;
import com.matrimony.eliteinovamatrimonybackend.dto.UserBasicDTO;
import com.matrimony.eliteinovamatrimonybackend.entity.Notification;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.NotificationRepository;
import com.matrimony.eliteinovamatrimonybackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /**
     * Create and persist a notification with an optional actionUrl.
     * Loads User from DB to ensure the user reference is a managed entity.
     */
    @Transactional
    public Notification createNotification(Long userId, String title, String message, String type, String actionUrl) {
        System.out.println("🔔 NotificationService.createNotification -> userId:" + userId + " title:" + title + " actionUrl:" + actionUrl);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found when creating notification: " + userId));

        Notification notification = new Notification(user, title, message, type);

        // ✅ Include actionUrl if provided
        if (actionUrl != null && !actionUrl.trim().isEmpty()) {
            notification.setActionUrl(actionUrl);
        }

        Notification saved = notificationRepository.save(notification);
        System.out.println("🔔 Notification saved id=" + saved.getId() + " for user=" + userId);
        return saved;
    }

    // Backwards-compatible convenience method (keeps existing callers working)
    @Transactional
    public Notification createNotification(Long userId, String title, String message, String type) {
        return createNotification(userId, title, message, type, null);
    }

    public List<NotificationDTO> getUserNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        // ✅ FIXED: Get entities directly from repository (not DTOs)
        List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ✅ ADD THIS METHOD: Get unread notification count
    public Long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    // ✅ ADD THIS METHOD: Convert Notification to DTO (make it public for testing)
    public NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setIsRead(notification.getIsRead());
        dto.setActionUrl(notification.getActionUrl());
        dto.setCreatedAt(notification.getCreatedAt());

        // Convert User to basic DTO (avoid circular reference)
        if (notification.getUser() != null) {
            UserBasicDTO userBasicDTO = convertUserToBasicDTO(notification.getUser());
            dto.setUser(userBasicDTO);
        }

        return dto;
    }

    private UserBasicDTO convertUserToBasicDTO(User user) {
        UserBasicDTO dto = new UserBasicDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        // ✅ FIX: Gender is String, not Enum
        dto.setGender(user.getGender());

        // Calculate age from dob if available
        if (user.getDob() != null) {
            LocalDate dob = user.getDob().toLocalDate();
            Period period = Period.between(dob, LocalDate.now());
            dto.setAge(period.getYears());
        }

        return dto;
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (notification.getUser().getId().equals(userId)) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        } else {
            throw new RuntimeException("Unauthorized to mark this notification as read");
        }
    }

    public void markAllAsRead(Long userId) {
        // ✅ FIXED: Get entities from repository, not DTOs
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    public void cleanupOldNotifications(Long userId, int daysToKeep) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysToKeep);
        notificationRepository.deleteOldReadNotifications(userId, cutoffDate);
    }
}