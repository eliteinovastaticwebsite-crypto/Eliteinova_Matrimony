package com.matrimony.eliteinovamatrimonybackend.service;

import com.matrimony.eliteinovamatrimonybackend.entity.Profile;
import com.matrimony.eliteinovamatrimonybackend.entity.ProfilePhoto;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import com.matrimony.eliteinovamatrimonybackend.repository.ProfilePhotoRepository;
import com.matrimony.eliteinovamatrimonybackend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfilePhotoService {

    private final ProfilePhotoRepository profilePhotoRepository;
    private final ProfileRepository profileRepository;
    private final FileUploadService fileUploadService;

    public ProfilePhotoService(ProfilePhotoRepository profilePhotoRepository,
                               ProfileRepository profileRepository,
                               FileUploadService fileUploadService) {
        this.profilePhotoRepository = profilePhotoRepository;
        this.profileRepository = profileRepository;
        this.fileUploadService = fileUploadService;
    }

    // ✅ FIXED: Accept User object and find the actual profile
    public ProfilePhoto saveProfilePhoto(User user, String imageUrl) {
        // Find user's actual profile from database
        Optional<Profile> profileOpt = profileRepository.findByUserId(user.getId());
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("User profile not found for user ID: " + user.getId());
        }

        Profile profile = profileOpt.get();

        // Create and save profile photo
        ProfilePhoto photo = new ProfilePhoto(profile, imageUrl);
        ProfilePhoto savedPhoto = profilePhotoRepository.save(photo);

        // ✅ ALSO add to profile's photos list (for backward compatibility)
        if (profile.getPhotos() != null) {
            profile.getPhotos().add(imageUrl);
            profileRepository.save(profile);
        }

        System.out.println("✅ Profile photo saved to database. Photo ID: " + savedPhoto.getId() +
                ", Profile ID: " + profile.getId() +
                ", Image URL: " + imageUrl);

        return savedPhoto;
    }

    public void deleteProfilePhoto(Long userId, Long photoId) {
        // Find user's profile first
        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("User profile not found");
        }

        Profile profile = profileOpt.get();
        Optional<ProfilePhoto> photoOpt = profilePhotoRepository.findById(photoId);

        if (photoOpt.isPresent()) {
            ProfilePhoto photo = photoOpt.get();
            // Check if photo belongs to user's profile
            if (photo.getProfile().getId().equals(profile.getId())) {
                // Delete physical file
                fileUploadService.deleteFile(photo.getImageUrl());
                // Delete from database
                profilePhotoRepository.delete(photo);
                System.out.println("✅ Profile photo deleted: " + photoId);
            } else {
                throw new RuntimeException("Unauthorized to delete this photo");
            }
        } else {
            throw new RuntimeException("Photo not found");
        }
    }

    // ✅ FIXED: Get profile first, then use profileId
    public List<ProfilePhoto> getUserProfilePhotos(Long userId) {
        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        if (profileOpt.isPresent()) {
            Long profileId = profileOpt.get().getId();
            return profilePhotoRepository.findByProfileIdOrderByDisplayOrderAsc(profileId);
        }
        return List.of();
    }

    // ✅ FIXED: Get profile first, then use profileId
    public ProfilePhoto setPrimaryPhoto(Long userId, Long photoId) {
        Optional<Profile> profileOpt = profileRepository.findByUserId(userId);
        if (profileOpt.isEmpty()) {
            throw new RuntimeException("User profile not found");
        }

        Profile profile = profileOpt.get();
        Long profileId = profile.getId();
        List<ProfilePhoto> photos = profilePhotoRepository.findByProfileIdOrderByDisplayOrderAsc(profileId);

        // Reset all primary flags
        for (ProfilePhoto photo : photos) {
            photo.setIsPrimary(photo.getId().equals(photoId));
            profilePhotoRepository.save(photo);
        }

        return profilePhotoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Photo not found"));
    }
}