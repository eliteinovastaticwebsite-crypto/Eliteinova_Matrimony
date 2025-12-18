package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);

    List<User> findByStatus(User.UserStatus status);
    List<User> findByMembership(User.MembershipType membership);
    List<User> findByRole(User.UserRole role);

    long countByStatus(User.UserStatus status);
    long countByMembership(User.MembershipType membership);
    long countByRole(User.UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.status = 'ACTIVE'")
    long countActiveUsers();

    // ✅ FIXED: Remove city and state queries since User entity doesn't have these fields
    // @Query("SELECT u.city, COUNT(u) FROM User u WHERE u.city IS NOT NULL GROUP BY u.city")
    // List<Object[]> countUsersByCity(); // ❌ REMOVED

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= CURRENT_DATE")
    long countNewUsersToday();

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastLogin >= CURRENT_DATE")
    long countDailyActiveUsers();

    @Query("SELECT u.membership, COUNT(u) FROM User u GROUP BY u.membership")
    List<Object[]> countUsersByMembership();

    @Query("SELECT u FROM User u WHERE u.profile IS NOT NULL")
    List<User> findUsersWithProfiles();

    @Query("SELECT u FROM User u WHERE u.name LIKE %:searchTerm% OR u.email LIKE %:searchTerm%")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :date")
    long countByCreatedAtAfter(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(u) FROM User u WHERE u.lastActive >= :date")
    long countByLastActiveAfter(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(u) FROM User u WHERE u.membership IN :memberships")
    long countByMembershipIn(@Param("memberships") List<User.MembershipType> memberships);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.profile WHERE u.id = :id")
    Optional<User> findByIdWithProfile(@Param("id") Long id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.profile")
    List<User> findAllWithProfile();

    @Query("SELECT u FROM User u WHERE u.role <> 'ADMIN'")
    List<User> findAllNonAdminUsers();

    Optional<User> findByEmailAndRole(String email, User.UserRole role);

}