package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.UserDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDocumentRepository extends JpaRepository<UserDocument, Long> {
    List<UserDocument> findByUserId(Long userId);
    List<UserDocument> findByUserIdAndDocumentType(Long userId, String documentType);
    Optional<UserDocument> findByUserIdAndDocumentTypeAndId(Long userId, String documentType, Long id);
}
