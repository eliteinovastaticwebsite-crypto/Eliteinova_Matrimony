package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
    List<ContactRequest> findByRequesterIdAndProfileOwnerId(Long requesterId, Long profileOwnerId);
    List<ContactRequest> findByProfileOwnerIdOrderByCreatedAtDesc(Long profileOwnerId);;
    List<ContactRequest> findByProfileOwnerIdAndStatus(Long profileOwnerId, ContactRequest.Status status);
}
