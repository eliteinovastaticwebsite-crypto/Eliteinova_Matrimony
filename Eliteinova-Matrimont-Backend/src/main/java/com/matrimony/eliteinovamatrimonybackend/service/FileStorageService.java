// FileStorageService.java - NEW FILE
package com.matrimony.eliteinovamatrimonybackend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    private final Path imageStorageLocation = Paths.get("uploads/images").toAbsolutePath().normalize();
    private final Path documentStorageLocation = Paths.get("uploads/documents").toAbsolutePath().normalize();

    public FileStorageService() {
        try {
            Files.createDirectories(imageStorageLocation);
            Files.createDirectories(documentStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directories", ex);
        }
    }

    public String storeProfilePhoto(MultipartFile file, Long userId) {
        try {
            String fileName = "profile_photo_" + userId + "_" + System.currentTimeMillis() +
                    getFileExtension(file.getOriginalFilename());

            Path targetLocation = imageStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }

    public String storeDocument(MultipartFile file, String documentType, Long userId) {
        try {
            String fileName = documentType.toLowerCase() + "_" + userId + "_" +
                    System.currentTimeMillis() + getFileExtension(file.getOriginalFilename());

            Path targetLocation = documentStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }

    public byte[] loadImage(String filename) throws IOException {
        Path filePath = imageStorageLocation.resolve(filename).normalize();
        return Files.readAllBytes(filePath);
    }

    public byte[] loadDocument(String filename) throws IOException {
        Path filePath = documentStorageLocation.resolve(filename).normalize();
        return Files.readAllBytes(filePath);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDotIndex = fileName.lastIndexOf(".");
        return (lastDotIndex == -1) ? "" : fileName.substring(lastDotIndex);
    }
}
