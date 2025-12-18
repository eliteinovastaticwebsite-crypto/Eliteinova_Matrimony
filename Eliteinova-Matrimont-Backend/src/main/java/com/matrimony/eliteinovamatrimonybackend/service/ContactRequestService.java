package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.entity.ContactRequest;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.ContactRequestRepository;
import com.matrimony.eliteinovamatrimonybackend.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ContactRequestService(ContactRequestRepository contactRequestRepository,
                                 UserRepository userRepository,
                                 NotificationService notificationService) {
        this.contactRequestRepository = contactRequestRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ContactRequest createRequest(Long requesterId, Long profileOwnerId, String acceptedLanguage, String note) {
        // if requester == owner, throw
        if (requesterId.equals(profileOwnerId)) {
            throw new IllegalArgumentException("Cannot request contact for your own profile");
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new RuntimeException("Requester not found"));
        User owner = userRepository.findById(profileOwnerId)
                .orElseThrow(() -> new RuntimeException("Profile owner not found"));

        System.out.println("🔍 Creating contact request: " + requester.getName() + " → " + owner.getName());

        try {
            // This should return List<ContactRequest> after repository fix
            List<ContactRequest> existingRequests = contactRequestRepository
                    .findByRequesterIdAndProfileOwnerId(requesterId, profileOwnerId);

            if (!existingRequests.isEmpty()) {
                ContactRequest existing = existingRequests.get(0);
                System.out.println("🔍 Found existing request ID: " + existing.getId() +
                        ", Status: " + existing.getStatus());

                // If already ACCEPTED or PENDING, return it
                if (existing.getStatus() == ContactRequest.Status.ACCEPTED ||
                        existing.getStatus() == ContactRequest.Status.PENDING) {
                    System.out.println("✅ Returning existing " + existing.getStatus() + " request");
                    return existing;
                }

                // If REJECTED, update it to PENDING
                if (existing.getStatus() == ContactRequest.Status.REJECTED) {
                    System.out.println("🔄 Updating REJECTED request to PENDING");
                    existing.setStatus(ContactRequest.Status.PENDING);
                    existing.setAcceptedLanguage(acceptedLanguage);
                    existing.setNote(note);
                    existing.setUpdatedAt(LocalDateTime.now());

                    ContactRequest updated = contactRequestRepository.save(existing);

                    // Resend notification
                    String title = "Contact request (updated)";
                    String message = requester.getName() + " has requested your contact again. Accept or Reject.";
                    notificationService.createNotification(owner.getId(), title, message, "CONTACT_REQUEST");

                    return updated;
                }
            }

            // Create new request
            ContactRequest cr = new ContactRequest();
            cr.setRequester(requester);
            cr.setProfileOwner(owner);
            cr.setAcceptedLanguage(acceptedLanguage);
            cr.setNote(note);
            cr.setStatus(ContactRequest.Status.PENDING);

            ContactRequest saved = contactRequestRepository.save(cr);

            // Send notification to profile owner
            String title = "Contact request";
            String message = requester.getName() + " has requested your contact. Accept or Reject.";
            notificationService.createNotification(owner.getId(), title, message, "CONTACT_REQUEST");

            System.out.println("✅ Created new contact request ID: " + saved.getId());
            return saved;

        } catch (DataIntegrityViolationException e) {
            // This should not happen with unique constraint, but just in case
            System.out.println("⚠️ Unique constraint violation: " + e.getMessage());
            throw new RuntimeException("Duplicate contact request detected. Please try again.");
        }
    }

    @Transactional
    public ContactRequest handleRequest(Long requestId, Long ownerId, boolean accept) {
        ContactRequest cr = contactRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!cr.getProfileOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized");
        }

        cr.setStatus(accept ? ContactRequest.Status.ACCEPTED : ContactRequest.Status.REJECTED);
        ContactRequest saved = contactRequestRepository.save(cr);

        // Notify requester
        String title = "Contact request " + (accept ? "accepted" : "rejected");
        String message;
        if (accept) {
            // Share the profile owner's contact (the one who accepted)
            String phone = cr.getProfileOwner().getMobile() != null ? cr.getProfileOwner().getMobile() : "Not provided";
            String email = cr.getProfileOwner().getEmail() != null ? cr.getProfileOwner().getEmail() : "Not provided";
            message = cr.getProfileOwner().getName() + " has accepted your contact request. Phone: " + phone + ", Email: " + email;
        } else {
            message = cr.getProfileOwner().getName() + " has rejected your contact request.";
        }

        notificationService.createNotification(cr.getRequester().getId(), title, message, "CONTACT_REQUEST_RESPONSE");
        return saved;
    }

    public Optional<ContactRequest> getRequestStatus(Long requesterId, Long profileOwnerId) {
        List<ContactRequest> requests = contactRequestRepository
                .findByRequesterIdAndProfileOwnerId(requesterId, profileOwnerId);

        if (requests.isEmpty()) {
            return Optional.empty();
        }

        // Return the first (and should be only) request
        return Optional.of(requests.get(0));
    }

    public List<ContactRequest> getPendingRequestForProfile(Long profileId) {
        return contactRequestRepository.findByProfileOwnerIdAndStatus(profileId, ContactRequest.Status.PENDING);
    }
}