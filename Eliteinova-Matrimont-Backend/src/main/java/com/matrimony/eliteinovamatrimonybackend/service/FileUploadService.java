package com.matrimony.eliteinovamatrimonybackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileUploadService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    public String uploadProfilePhoto(MultipartFile file, Long userId) throws IOException {
        return uploadFile(file, userId, "photos", "profile_photo");
    }

    public String uploadDocument(MultipartFile file, Long userId, String documentType) throws IOException {
        return uploadFile(file, userId, "documents", documentType.toLowerCase());
    }

    private String uploadFile(MultipartFile file, Long userId, String fileType, String prefix) throws IOException {
        // ✅ FIXED: Use absolute path and ensure it's in project directory
        String projectRoot = System.getProperty("user.dir");
        String absoluteUploadDir = projectRoot + "/" + uploadDir;
        String userDir = absoluteUploadDir + "/users/" + userId + "/" + fileType;
        Path userDirPath = Paths.get(userDir);

        System.out.println("📁 Project Root: " + projectRoot);
        System.out.println("📁 Absolute Upload Directory: " + absoluteUploadDir);
        System.out.println("📁 User Directory: " + userDirPath.toAbsolutePath());

        // ✅ Create directories if they don't exist
        if (!Files.exists(userDirPath)) {
            Files.createDirectories(userDirPath);
            System.out.println("✅ Created directory: " + userDirPath.toAbsolutePath());
        }

        // ✅ Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String uniqueFileName = prefix + "_" + System.currentTimeMillis() + "." + fileExtension;

        // ✅ Full file path
        Path filePath = userDirPath.resolve(uniqueFileName);

        System.out.println("💾 Saving file to: " + filePath.toAbsolutePath());

        // ✅ Save file using copy
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // ✅ Return relative path for database storage
        String relativePath = "users/" + userId + "/" + fileType + "/" + uniqueFileName;
        System.out.println("✅ File saved successfully. Relative path: " + relativePath);

        return relativePath;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "jpg"; // default extension
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    public void deleteFile(String filePath) {
        try {
            String projectRoot = System.getProperty("user.dir");
            Path fullPath = Paths.get(projectRoot + "/" + uploadDir + "/" + filePath);
            Files.deleteIfExists(fullPath);
            System.out.println("✅ File deleted: " + fullPath);
        } catch (IOException e) {
            System.err.println("❌ Failed to delete file: " + e.getMessage());
        }
    }
}