package com.matrimony.eliteinovamatrimonybackend.controller;

import com.matrimony.eliteinovamatrimonybackend.dto.NotificationDTO;
import com.matrimony.eliteinovamatrimonybackend.entity.Notification;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.security.CustomUserDetails;
import com.matrimony.eliteinovamatrimonybackend.service.NotificationService;
import com.matrimony.eliteinovamatrimonybackend.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.matrimony.eliteinovamatrimonybackend.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getUserNotifications(@AuthenticationPrincipal Object principal) {
        try {
            System.out.println("🔍 NotificationController - Principal type: " +
                    (principal != null ? principal.getClass().getName() : "NULL"));

            User user = null;

            // Handle different principal types
            if (principal instanceof User) {
                user = (User) principal;
            } else if (principal instanceof CustomUserDetails) {
                user = ((CustomUserDetails) principal).getUser();
            } else if (principal instanceof UserDetails) {
                // Load user by email from repository
                String email = ((UserDetails) principal).getUsername();
                user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found: " + email));
            } else if (principal instanceof String) {
                // Load user by email string
                user = userRepository.findByEmail((String) principal)
                        .orElseThrow(() -> new RuntimeException("User not found: " + principal));
            }

            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "User not authenticated"
                ));
            }

            // ✅ FIXED: Now returns List<NotificationDTO>
            java.util.List<NotificationDTO> notifications = notificationService.getUserNotifications(user.getId());
            // ✅ Add unread count for convenience
            Long unreadCount = notificationService.getUnreadNotificationCount(user.getId());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "notifications", notifications,
                    "unreadCount", unreadCount
            ));

        } catch (Exception e) {
            e.printStackTrace(); // Add logging
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to fetch notifications: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "User not authenticated"
                ));
            }

            // ✅ FIXED: Now returns List<NotificationDTO>
            java.util.List<NotificationDTO> notifications = notificationService.getUnreadNotifications(user.getId());
            var count = notificationService.getUnreadNotificationCount(user.getId());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "notifications", notifications,
                    "unreadCount", count
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to fetch unread notifications: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/{notificationId}/mark-read")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId,
                                        @AuthenticationPrincipal Object principal) {
        try {
            System.out.println("🔍 markAsRead - Principal type: " +
                    (principal != null ? principal.getClass().getName() : "NULL"));

            User user = extractUserFromPrincipal(principal);

            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "User not authenticated"
                ));
            }

            System.out.println("✅ markAsRead - Authenticated user: " + user.getEmail());

            notificationService.markAsRead(notificationId, user.getId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Notification marked as read"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to mark notification as read: " + e.getMessage()
            ));
        }
    }

    // Add this helper method (or reuse the logic from getUserNotifications)
    private User extractUserFromPrincipal(Object principal) {
        if (principal instanceof User) {
            return (User) principal;
        } else if (principal instanceof CustomUserDetails) {
            return ((CustomUserDetails) principal).getUser();
        } else if (principal instanceof UserDetails) {
            String email = ((UserDetails) principal).getUsername();
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found: " + email));
        } else if (principal instanceof String) {
            return userRepository.findByEmail((String) principal)
                    .orElseThrow(() -> new RuntimeException("User not found: " + principal));
        }
        return null;
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "User not authenticated"
                ));
            }

            notificationService.markAllAsRead(user.getId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "All notifications marked as read"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to mark all notifications as read: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "User not authenticated"
                ));
            }

            var count = notificationService.getUnreadNotificationCount(user.getId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "unreadCount", count
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to fetch unread count: " + e.getMessage()
            ));
        }
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId,
                                                @AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "User not authenticated"
                ));
            }

            Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

            if (notificationOpt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                        "success", false,
                        "message", "Notification not found"
                ));
            }

            Notification notification = notificationOpt.get();

            if (!notification.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "message", "Unauthorized to delete this notification"
                ));
            }

            notificationRepository.delete(notification);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Notification deleted successfully"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to delete notification: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/debug-auth")
    public ResponseEntity<?> debugAuthentication(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();

        if (user == null) {
            response.put("success", false);
            response.put("message", "User is NULL in NotificationController");
            response.put("debug", "Check Spring Security configuration for this endpoint");
            return ResponseEntity.status(401).body(response);
        }

        response.put("success", true);
        response.put("message", "Authentication working in NotificationController");
        response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName()
        ));

        return ResponseEntity.ok(response);
    }
}