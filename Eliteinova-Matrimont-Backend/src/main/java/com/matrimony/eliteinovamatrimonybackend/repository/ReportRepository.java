package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Find reports by status
    List<Report> findByStatus(String status);

    // Find reports by status with ordering
    List<Report> findByStatusOrderByCreatedAtDesc(String status);

    // Find reports by severity
    List<Report> findBySeverity(String severity);

    // Find reports by severity with ordering
    List<Report> findBySeverityOrderByCreatedAtDesc(String severity);

    // Find reports by reporter
    List<Report> findByReporterId(Long reporterId);

    List<Report> findByReporterIdOrderByCreatedAtDesc(Long reporterId);

    // Find reports by reported user
    List<Report> findByReportedUserId(Long reportedUserId);

    List<Report> findByReportedUserIdOrderByCreatedAtDesc(Long reportedUserId);

    // Count reports by status
    long countByStatus(String status);

    // Count reports by severity
    long countBySeverity(String severity);

    // ✅ FIXED: Count today's reports using LocalDate comparison
    @Query("SELECT COUNT(r) FROM Report r WHERE FUNCTION('DATE', r.createdAt) = CURRENT_DATE")
    long countTodaysReports();

    // Alternative: Count reports from today
    @Query("SELECT COUNT(r) FROM Report r WHERE r.createdAt >= :startOfDay")
    long countReportsFromDate(@Param("startOfDay") LocalDateTime startOfDay);

    // Search reports by reason, description, or user names
    @Query("SELECT r FROM Report r WHERE " +
            "LOWER(r.reason) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.reporter.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.reportedUser.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Report> searchReports(@Param("search") String search);

    // Find all reports ordered by creation date (descending)
    @Query("SELECT r FROM Report r ORDER BY r.createdAt DESC")
    List<Report> findAllOrderByCreatedAtDesc();

    // Find reports created after a certain date
    List<Report> findByCreatedAtAfter(LocalDateTime date);

    // Find reports between dates
    @Query("SELECT r FROM Report r WHERE r.createdAt BETWEEN :startDate AND :endDate ORDER BY r.createdAt DESC")
    List<Report> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);

    // Count reports by status and date range
    @Query("SELECT COUNT(r) FROM Report r WHERE r.status = :status AND r.createdAt BETWEEN :startDate AND :endDate")
    long countByStatusAndDateRange(@Param("status") String status,
                                   @Param("startDate") LocalDateTime startDate,
                                   @Param("endDate") LocalDateTime endDate);

    // Get reports with pagination support
    @Query("SELECT r FROM Report r WHERE " +
            "(:status IS NULL OR r.status = :status) AND " +
            "(:severity IS NULL OR r.severity = :severity) " +
            "ORDER BY r.createdAt DESC")
    List<Report> findReportsWithFilters(@Param("status") String status,
                                        @Param("severity") String severity);
}