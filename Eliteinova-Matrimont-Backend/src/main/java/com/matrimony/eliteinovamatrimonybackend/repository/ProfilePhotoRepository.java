package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.ProfilePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfilePhotoRepository extends JpaRepository<ProfilePhoto, Long> {
    // ✅ REMOVED 'static' keyword - it's invalid in repository interfaces
    List<ProfilePhoto> findByProfileIdOrderByDisplayOrderAsc(Long profileId);

    List<ProfilePhoto> findByProfileIdAndIsPrimaryTrue(Long profileId);

    void deleteByProfileIdAndId(Long profileId, Long photoId);

    Long countByProfileId(Long profileId);

    List<ProfilePhoto> findByProfileId(Long profileId);

}