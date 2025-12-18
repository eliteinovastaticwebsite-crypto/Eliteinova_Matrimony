package com.matrimony.eliteinovamatrimonybackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.entity.ProfilePhoto;
import com.matrimony.eliteinovamatrimonybackend.entity.UserDocument;
import com.matrimony.eliteinovamatrimonybackend.service.FileUploadService;
import com.matrimony.eliteinovamatrimonybackend.service.ProfilePhotoService;
import com.matrimony.eliteinovamatrimonybackend.service.UserDocumentService;
import com.matrimony.eliteinovamatrimonybackend.service.UserService;
import com.matrimony.eliteinovamatrimonybackend.util.JwtUtil;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileUploadController {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private final FileUploadService fileUploadService;
    private final ProfilePhotoService profilePhotoService;
    private final UserDocumentService userDocumentService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public FileUploadController(FileUploadService fileUploadService,
                                ProfilePhotoService profilePhotoService,
                                UserDocumentService userDocumentService,
                                UserService userService,
                                JwtUtil jwtUtil) {
        this.fileUploadService = fileUploadService;
        this.profilePhotoService = profilePhotoService;
        this.userDocumentService = userDocumentService;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // ✅ FIXED: Upload profile photo - Store FULL PATH in database
    @PostMapping("/upload-profile-photo")
    public ResponseEntity<?> uploadProfilePhoto(@RequestParam("file") MultipartFile file,
                                                @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            System.out.println("🔐 Authorization Header: " + authorizationHeader);

            // ✅ MANUAL AUTHENTICATION EXTRACTION
            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Authentication required. Please include valid JWT token in Authorization header."
                ));
            }

            System.out.println("✅ User authenticated: " + user.getEmail() + ", ID: " + user.getId());

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "File is empty"
                ));
            }

            String filePath = fileUploadService.uploadProfilePhoto(file, user.getId());
            System.out.println("📁 File uploaded to: " + filePath);

            // ✅ FIXED: Store the FULL PATH in database
            String imageUrl = filePath; // This will be "users/15/photos/profile_photo_1234567890.jpg"
            System.out.println("🔗 Storing full path in DB: " + imageUrl);

            // Save to profile photos
            ProfilePhoto photo = profilePhotoService.saveProfilePhoto(user, imageUrl);

            // ✅ FIXED: Return the CORRECT URL for frontend
            String frontendImageUrl = "/api/files/images/" + filePath;
            System.out.println("🔗 Frontend image URL: " + frontendImageUrl);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Profile photo uploaded successfully",
                    "photoId", photo.getId(),
                    "imageUrl", frontendImageUrl, // Return URL that frontend can use
                    "fileName", Paths.get(filePath).getFileName().toString()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to upload photo: " + e.getMessage()
            ));
        }
    }

    // ✅ FIXED: Serve uploaded image - Handle FULL PATHS correctly
    @GetMapping("/images/{path:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String path) {
        try {
            System.out.println("🔍 Image request for path: " + path);

            // ✅ FIXED: Use the full path from the URL parameter
            String projectRoot = System.getProperty("user.dir");
            Path filePath = Paths.get(projectRoot, uploadDir, path).normalize();

            System.out.println("📁 Looking for image at: " + filePath.toAbsolutePath());
            System.out.println("📁 File exists: " + Files.exists(filePath));

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(path);
                System.out.println("✅ Image found and serving: " + path);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                System.out.println("❌ Image not found at: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ Image serving error: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ FIXED: Public image endpoint - Handle FULL PATHS correctly
    @GetMapping("/public/images/{path:.+}")
    public ResponseEntity<Resource> servePublicImage(@PathVariable String path) {
        try {
            System.out.println("🔍 Public image request for path: " + path);

            // ✅ FIXED: Use the full path from the URL parameter
            String projectRoot = System.getProperty("user.dir");
            Path filePath = Paths.get(projectRoot, uploadDir, path).normalize();

            System.out.println("📁 Looking for public image at: " + filePath.toAbsolutePath());
            System.out.println("📁 File exists: " + Files.exists(filePath));

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(path);
                System.out.println("✅ Public image found and serving: " + path);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                System.out.println("❌ Public image not found at: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ Public image serving error: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ FIXED: Secure image endpoint
    @GetMapping("/secure-images/{filename:.+}")
    public ResponseEntity<Resource> serveSecureImage(@PathVariable String filename,
                                                     @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            System.out.println("🔐 Secure image request for: " + filename);

            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.status(401).body(null);
            }

            System.out.println("✅ User authorized: " + user.getEmail() + ", ID: " + user.getId());

            Long fileUserId = extractUserIdFromFilename(filename);
            boolean isAuthorized = fileUserId.equals(user.getId()) ||
                    user.getRole() == User.UserRole.ADMIN;

            if (!isAuthorized) {
                System.out.println("❌ Unauthorized access attempt by user: " + user.getId());
                return ResponseEntity.status(403).body(null);
            }

            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(filename);
                System.out.println("✅ Serving secure image: " + filename);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                System.out.println("❌ Image not found: " + filePath);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ Secure image serving error: " + e.getMessage());
            return ResponseEntity.status(403).build();
        }
    }

    // ✅ FIXED: Document upload endpoint with proper authentication
    @PostMapping("/upload-document")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file,
                                            @RequestParam("documentType") String documentType,
                                            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            System.out.println("🔐 Authorization Header: " + authorizationHeader);
            System.out.println("📄 Document type: " + documentType);

            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Authentication required. Please include valid JWT token in Authorization header."
                ));
            }

            System.out.println("✅ User authenticated: " + user.getEmail() + ", ID: " + user.getId());

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "File is empty"
                ));
            }

            String filePath = fileUploadService.uploadDocument(file, user.getId(), documentType);
            System.out.println("📁 Document uploaded to: " + filePath);

            // ✅ FIXED: Store the FULL PATH in database
            String documentUrl = filePath;
            System.out.println("🔗 Storing document path in DB: " + documentUrl);

            // ✅ FIXED: Use userId instead of User object to match service method
            UserDocument document = userDocumentService.saveUserDocument(user.getId(), documentType, documentUrl, file);

            // ✅ FIXED: Return the CORRECT URL for frontend
            String frontendDocumentUrl = "/api/files/documents/" + filePath;
            System.out.println("🔗 Frontend document URL: " + frontendDocumentUrl);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Document uploaded successfully",
                    "documentId", document.getId(),
                    "documentUrl", frontendDocumentUrl,
                    "fileName", Paths.get(filePath).getFileName().toString(),
                    "documentType", documentType
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to upload document: " + e.getMessage()
            ));
        }
    }

    // ✅ FIXED: Serve documents - Handle FULL PATHS correctly
    @GetMapping("/documents/{path:.+}")
    public ResponseEntity<Resource> serveDocument(@PathVariable String path) {
        try {
            System.out.println("🔍 Document request for path: " + path);

            // ✅ FIXED: Use the full path from the URL parameter
            String projectRoot = System.getProperty("user.dir");
            Path filePath = Paths.get(projectRoot, uploadDir, path).normalize();

            System.out.println("📁 Looking for document at: " + filePath.toAbsolutePath());
            System.out.println("📁 File exists: " + Files.exists(filePath));

            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = determineContentType(path);
                System.out.println("✅ Document found and serving: " + path);

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                System.out.println("❌ Document not found at: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ Document serving error: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ FIXED: Get user documents with manual authentication
    @GetMapping("/my-documents")
    public ResponseEntity<?> getMyDocuments(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            System.out.println("🔐 Getting documents for user");

            User user = extractUserFromToken(authorizationHeader);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Authentication required. Please include valid JWT token in Authorization header."
                ));
            }

            System.out.println("✅ Fetching documents for user: " + user.getEmail() + ", ID: " + user.getId());

            List<UserDocument> documents = userDocumentService.getUserDocuments(user.getId());

            // ✅ FIXED: Convert to response DTOs - using correct field names from UserDocument entity
            List<Map<String, Object>> documentResponses = documents.stream()
                    .map(doc -> {
                        Map<String, Object> docMap = new HashMap<>();
                        docMap.put("id", doc.getId());
                        docMap.put("documentType", doc.getDocumentType());
                        docMap.put("fileName", doc.getFileName());

                        // ✅ Use getFileUrl() instead of getDocumentUrl()
                        String filePath = doc.getFileUrl();
                        docMap.put("documentUrl", "/api/files/documents/" + filePath);

                        docMap.put("fileSize", doc.getFileSize());
                        docMap.put("uploadedAt", doc.getUploadedAt());
                        docMap.put("mimeType", doc.getMimeType());
                        return docMap;
                    })
                    .collect(Collectors.toList());

            System.out.println("📄 Found " + documentResponses.size() + " documents for user");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "documents", documentResponses
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to fetch documents: " + e.getMessage()
            ));
        }
    }

    // ✅ KEEP EXISTING ENDPOINTS - Document endpoint with @AuthenticationPrincipal
    @GetMapping("/documents")
    public ResponseEntity<?> getUserDocuments(@AuthenticationPrincipal User user) {
        try {
            System.out.println("🔐 Getting documents using @AuthenticationPrincipal");

            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "success", false,
                        "message", "Authentication required"
                ));
            }

            System.out.println("✅ User authenticated: " + user.getEmail() + ", ID: " + user.getId());

            var documents = userDocumentService.getUserDocuments(user.getId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "documents", documents
            ));
        } catch (Exception e) {
            System.out.println("❌ Error fetching documents: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to fetch documents: " + e.getMessage()
            ));
        }
    }

    // ✅ KEEP EXISTING ENDPOINTS - Profile photos with @AuthenticationPrincipal
    @GetMapping("/profile-photos")
    public ResponseEntity<?> getUserProfilePhotos(@AuthenticationPrincipal User user) {
        try {
            var photos = profilePhotoService.getUserProfilePhotos(user.getId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "photos", photos
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to fetch photos: " + e.getMessage()
            ));
        }
    }

    // ✅ KEEP EXISTING ENDPOINTS - Delete profile photo
    @DeleteMapping("/profile-photo/{photoId}")
    public ResponseEntity<?> deleteProfilePhoto(@PathVariable Long photoId,
                                                @AuthenticationPrincipal User user) {
        try {
            profilePhotoService.deleteProfilePhoto(user.getId(), photoId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Photo deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Failed to delete photo: " + e.getMessage()
            ));
        }
    }

    // ============ HELPER METHODS ============

    private User extractUserFromToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            System.out.println("❌ No Bearer token found in header: " + authorizationHeader);
            return null;
        }

        String token = authorizationHeader.substring(7);
        try {
            String email = jwtUtil.extractUsername(token);
            System.out.println("🔍 Extracted email from token: " + email);

            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isPresent()) {
                System.out.println("✅ User found: " + userOpt.get().getEmail());
                return userOpt.get();
            } else {
                System.out.println("❌ User not found for email: " + email);
                return null;
            }
        } catch (Exception e) {
            System.out.println("❌ Token extraction error: " + e.getMessage());
            return null;
        }
    }

    private Long extractUserIdFromFilename(String filename) {
        try {
            String[] parts = filename.split("/");
            if (parts.length >= 2 && parts[0].equals("users")) {
                return Long.parseLong(parts[1]);
            }
            throw new RuntimeException("Invalid filename format");
        } catch (Exception e) {
            throw new RuntimeException("Cannot extract user ID from filename: " + filename);
        }
    }

    private String determineContentType(String filename) {
        try {
            String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
            switch (extension) {
                case "jpg":
                case "jpeg":
                    return "image/jpeg";
                case "png":
                    return "image/png";
                case "gif":
                    return "image/gif";
                case "pdf":
                    return "application/pdf";
                case "doc":
                    return "application/msword";
                case "docx":
                    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                default:
                    return "application/octet-stream";
            }
        } catch (Exception e) {
            return "application/octet-stream";
        }
    }
}