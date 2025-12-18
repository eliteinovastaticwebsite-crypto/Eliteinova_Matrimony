package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.Interest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface InterestRepository extends JpaRepository<Interest, Long> {

    // Interests expressed by a user
    Page<Interest> findByFromUserIdOrderByExpressedAtDesc(Long fromUserId, Pageable pageable);

    List<Interest> findByFromUserIdAndToUserId(Long fromUserId, Long toUserId);

    // Interests received by a user
    @Query("SELECT i FROM Interest i WHERE i.toUser.id = :userId ORDER BY i.expressedAt DESC")
    Page<Interest> findReceivedInterests(@Param("userId") Long userId, Pageable pageable);

    // ✅ FIXED: Use native query for PostgreSQL INTERVAL syntax
    @Query(value = "SELECT * FROM interests i " +
            "WHERE i.from_user_id = :fromUserId " +
            "AND i.to_user_id = :toUserId " +
            "AND i.expressed_at >= CURRENT_TIMESTAMP - INTERVAL '1 day'",
            nativeQuery = true)
    List<Interest> findRecentInterests(@Param("fromUserId") Long fromUserId, @Param("toUserId") Long toUserId);

    // Count interests expressed by user
    long countByFromUserId(Long fromUserId);

    // Count interests received by user
    long countByToUserId(Long toUserId);

    // Find by status
    Page<Interest> findByStatusOrderByExpressedAtDesc(Interest.InterestStatus status, Pageable pageable);

    // === ADD THESE METHODS ===

    // Count by status (for admin dashboard)
    long countByStatus(Interest.InterestStatus status);

    // Find all interests by status (without pagination)
    List<Interest> findByStatus(Interest.InterestStatus status);

    // Count successful matches (mutual acceptance)
    @Query("SELECT COUNT(DISTINCT i1) FROM Interest i1 " +
            "WHERE i1.status = com.matrimony.eliteinovamatrimonybackend.entity.Interest.InterestStatus.ACCEPTED " +
            "AND EXISTS (SELECT i2 FROM Interest i2 " +
            "WHERE i2.fromUser = i1.toUser " +
            "AND i2.toUser = i1.fromUser " +
            "AND i2.status = com.matrimony.eliteinovamatrimonybackend.entity.Interest.InterestStatus.ACCEPTED)")
    long countSuccessfulMatches();

    // Find pending interests for a user
    Page<Interest> findByToUserIdAndStatusOrderByExpressedAtDesc(Long toUserId, Interest.InterestStatus status, Pageable pageable);

    // Find by status with order (alternative method)
    Page<Interest> findByStatus(Interest.InterestStatus status, Pageable pageable);

    @Query("SELECT DATE(i.respondedAt), COUNT(i) FROM Interest i " +
            "WHERE i.status = 'ACCEPTED' AND i.respondedAt >= :startDate " +
            "GROUP BY DATE(i.respondedAt)")
    List<Object[]> countMatchesByDate(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT p.gender, COUNT(i) FROM Interest i " +
            "JOIN i.fromUser u JOIN u.profile p " +
            "WHERE i.status = 'ACCEPTED' " +
            "GROUP BY p.gender")
    List<Object[]> countMatchesByGender();

    @Query("SELECT CASE " +
            "WHEN p.age < 25 THEN '18-24' " +
            "WHEN p.age BETWEEN 25 AND 34 THEN '25-34' " +
            "WHEN p.age BETWEEN 35 AND 44 THEN '35-44' " +
            "ELSE '45+' END, COUNT(i) " +
            "FROM Interest i " +
            "JOIN i.fromUser u JOIN u.profile p " +
            "WHERE i.status = 'ACCEPTED' AND p.age IS NOT NULL " +
            "GROUP BY CASE " +
            "WHEN p.age < 25 THEN '18-24' " +
            "WHEN p.age BETWEEN 25 AND 34 THEN '25-34' " +
            "WHEN p.age BETWEEN 35 AND 44 THEN '35-44' " +
            "ELSE '45+' END")
    List<Object[]> countMatchesByAgeGroup();

    @Query("SELECT i FROM Interest i WHERE i.status = 'ACCEPTED' ORDER BY i.respondedAt DESC")
    List<Interest> findSuccessStories();

    @Query("SELECT COUNT(i) FROM Interest i WHERE i.status = :status AND i.expressedAt BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") Interest.InterestStatus status,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    @Query("SELECT i FROM Interest i WHERE i.status = 'ACCEPTED' ORDER BY i.expressedAt DESC")
    List<Interest> findRecentAcceptedMatches(@Param("limit") int limit);

    @Query("SELECT COUNT(i) FROM Interest i WHERE i.status = 'ACCEPTED' AND i.expressedAt >= :startDate")
    long countMatchesSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT AVG(EXTRACT(HOUR FROM i.respondedAt) - EXTRACT(HOUR FROM i.expressedAt)) FROM Interest i WHERE i.respondedAt IS NOT NULL")
    Double averageResponseTimeHours();
}