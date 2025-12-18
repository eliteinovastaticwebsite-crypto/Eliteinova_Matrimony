package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.entity.UserDocument;
import com.matrimony.eliteinovamatrimonybackend.repository.UserDocumentRepository;
import com.matrimony.eliteinovamatrimonybackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserDocumentService {

    private final UserDocumentRepository userDocumentRepository;
    private final FileUploadService fileUploadService;
    private final UserRepository userRepository;

    public UserDocumentService(UserDocumentRepository userDocumentRepository,
                               FileUploadService fileUploadService,
                               UserRepository userRepository) {
        this.userDocumentRepository = userDocumentRepository;
        this.fileUploadService = fileUploadService;
        this.userRepository = userRepository;
    }

    // Method that takes User object
    public UserDocument saveUserDocument(User user, String documentType, String documentUrl, MultipartFile file) {
        try {
            UserDocument document = new UserDocument();
            document.setUser(user);
            document.setDocumentType(documentType);
            document.setFileUrl(documentUrl); // Use setFileUrl instead of setDocumentUrl
            document.setFileName(file.getOriginalFilename());
            document.setFileSize(formatFileSize(file.getSize())); // Format the file size as string
            document.setMimeType(file.getContentType());
            document.setUploadedAt(LocalDateTime.now()); // Use LocalDateTime instead of Date

            return userDocumentRepository.save(document);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save document: " + e.getMessage(), e);
        }
    }

    // Method that takes userId (for AuthController compatibility)
    public UserDocument saveUserDocument(Long userId, String documentType, String documentUrl, MultipartFile file) {
        try {
            // Find user by ID
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            // Call the method that takes User object
            return saveUserDocument(user, documentType, documentUrl, file);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save document: " + e.getMessage(), e);
        }
    }

    private String formatFileSize(long size) {
        if (size < 1024) return size + " B";
        else if (size < 1024 * 1024) return (size / 1024) + " KB";
        else return String.format("%.1f MB", size / (1024.0 * 1024.0));
    }

    public List<UserDocument> getUserDocuments(Long userId) {
        return userDocumentRepository.findByUserId(userId);
    }

    public void deleteUserDocument(Long userId, Long documentId) {
        Optional<UserDocument> documentOpt = userDocumentRepository.findById(documentId);
        if (documentOpt.isPresent()) {
            UserDocument document = documentOpt.get();
            if (document.getUser().getId().equals(userId)) {
                // Delete physical file
                fileUploadService.deleteFile(document.getFileUrl());
                // Delete database record
                userDocumentRepository.delete(document);
            } else {
                throw new RuntimeException("Unauthorized to delete this document");
            }
        } else {
            throw new RuntimeException("Document not found");
        }
    }
}