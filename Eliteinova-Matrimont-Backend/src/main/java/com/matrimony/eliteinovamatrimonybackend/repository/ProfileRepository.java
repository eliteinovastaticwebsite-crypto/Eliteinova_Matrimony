package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long>, JpaSpecificationExecutor<Profile> {

    // Basic queries
    Page<Profile> findByIsVerifiedTrue(Pageable pageable);
    Page<Profile> findByIsPremiumTrue(Pageable pageable);

    // ✅ FIXED: Use enum values in queries
    @Query("SELECT COUNT(p) FROM Profile p WHERE p.gender = 'MALE'")
    long countMaleProfiles();

    @Query("SELECT COUNT(p) FROM Profile p WHERE p.gender = 'FEMALE'")
    long countFemaleProfiles();

    Page<Profile> findByGender(Profile.Gender gender, Pageable pageable);
    Page<Profile> findByReligion(String religion, Pageable pageable);
    Page<Profile> findByCaste(String caste, Pageable pageable);
    Page<Profile> findBySubCaste(String subCaste, Pageable pageable);

    // Complex queries - ✅ FIXED: Added more search parameters
    @Query("SELECT p FROM Profile p WHERE " +
            "(:gender IS NULL OR p.gender = :gender) AND " +
            "(:minAge IS NULL OR p.age >= :minAge) AND " +
            "(:maxAge IS NULL OR p.age <= :maxAge) AND " +
            "(:religion IS NULL OR p.religion = :religion) AND " +
            "(:caste IS NULL OR p.caste = :caste) AND " +
            "(:maritalStatus IS NULL OR p.maritalStatus = :maritalStatus) AND " +
            "(:education IS NULL OR p.education LIKE %:education%) AND " +
            "(:profession IS NULL OR p.profession LIKE %:profession%)")
    Page<Profile> searchProfiles(
            @Param("gender") Profile.Gender gender,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge,
            @Param("religion") String religion,
            @Param("caste") String caste,
            @Param("maritalStatus") Profile.MaritalStatus maritalStatus,
            @Param("education") String education,
            @Param("profession") String profession,
            Pageable pageable);

    // ✅ ADDED: Method to find all non-admin profiles with specification
    @Query("SELECT p FROM Profile p WHERE p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN")
    Page<Profile> findAllNonAdminProfiles(Pageable pageable);

    // ✅ ADDED: Method to combine specification with admin exclusion
    default Page<Profile> findAllNonAdminProfiles(Specification<Profile> spec, Pageable pageable) {
        Specification<Profile> nonAdminSpec = (root, query, criteriaBuilder) ->
                criteriaBuilder.notEqual(root.get("user").get("role"),
                        com.matrimony.eliteinovamatrimonybackend.entity.User.UserRole.ADMIN);

        if (spec != null) {
            return findAll(spec.and(nonAdminSpec), pageable);
        } else {
            return findAll(nonAdminSpec, pageable);
        }
    }

    // Statistics queries
    @Query("SELECT COUNT(p) FROM Profile p WHERE p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN")
    long countTotalProfiles();

    @Query("SELECT COUNT(p) FROM Profile p WHERE p.isVerified = true AND p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN")
    long countVerifiedProfiles();

    @Query("SELECT COUNT(p) FROM Profile p WHERE p.isPremium = true AND p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN")
    long countPremiumProfiles();

    @Query("SELECT p.religion, COUNT(p) FROM Profile p WHERE p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN GROUP BY p.religion")
    List<Object[]> countProfilesByReligion();

    @Query("SELECT p.caste, COUNT(p) FROM Profile p WHERE p.caste IS NOT NULL AND p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN GROUP BY p.caste")
    List<Object[]> countProfilesByCaste();

    // ✅ FIXED: Find profile by user ID
    Optional<Profile> findByUserId(Long userId);

    // ✅ ADDED: Check if profile exists for user
    boolean existsByUserId(Long userId);

    // Find recent profiles (non-admin only)
    @Query("SELECT p FROM Profile p WHERE p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN ORDER BY p.createdAt DESC")
    Page<Profile> findByOrderByCreatedAtDesc(Pageable pageable);

    // ✅ ADDED: Count profiles created today (non-admin only)
    @Query("SELECT COUNT(p) FROM Profile p WHERE p.createdAt >= CURRENT_DATE AND p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN")
    long countNewProfilesToday();

    @Query("SELECT p FROM Profile p WHERE " +
            "(:occupation IS NULL OR " +
            "LOWER(p.profession) LIKE LOWER(CONCAT('%', :occupation, '%')) OR " +
            "LOWER(p.occupation) LIKE LOWER(CONCAT('%', :occupation, '%')))")
    List<Profile> findByOccupationContaining(@Param("occupation") String occupation);

    // ✅ ADDED: List version for non-admin profiles
    @Query("SELECT p FROM Profile p WHERE p.user.role <> com.matrimony.eliteinovamatrimonybackend.entity.User$UserRole.ADMIN")
    List<Profile> findAllNonAdminProfiles();


    List<Profile> findByIsVerified(Boolean isVerified);

    @Query("SELECT p.city, COUNT(p) FROM Profile p WHERE p.city IS NOT NULL GROUP BY p.city")
    List<Object[]> countUsersByCity();

    @Query("SELECT p FROM Profile p WHERE p.isVerified = false")
    List<Profile> findByIsVerifiedFalse();

    @Query("SELECT COUNT(p) FROM Profile p WHERE p.isVerified = false")
    long countByIsVerifiedFalse();

    @Query("SELECT p FROM Profile p LEFT JOIN FETCH p.user WHERE p.photos IS NOT EMPTY")
    List<Profile> findWithPhotos();

    @Query("SELECT p.city, COUNT(p) FROM Profile p GROUP BY p.city")
    List<Object[]> countProfilesByCity();

    @Query("SELECT p.state, COUNT(p) FROM Profile p GROUP BY p.state")
    List<Object[]> countProfilesByState();
}