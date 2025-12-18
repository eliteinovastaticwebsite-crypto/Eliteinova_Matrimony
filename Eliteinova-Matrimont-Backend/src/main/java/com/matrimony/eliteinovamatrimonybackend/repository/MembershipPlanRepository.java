package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.MembershipPlan;
import com.matrimony.eliteinovamatrimonybackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Long> {
    List<MembershipPlan> findByActiveTrue();
    List<MembershipPlan> findByActiveTrueOrderByPriceAsc();
    Optional<MembershipPlan> findByIdAndActiveTrue(Long id);
    List<MembershipPlan> findByFeaturedTrueAndActiveTrue();
    List<MembershipPlan> findByPopularTrueAndActiveTrue();

    @Query("SELECT COUNT(m) FROM MembershipPlan m WHERE m.active = true")
    long countActivePlans();

    boolean existsByName(String name);
    @Query("SELECT COUNT(u) FROM User u WHERE u.membership = :membershipType")
    long countUsersByMembershipType(@Param("membershipType") User.MembershipType membershipType);

    @Query("SELECT m, COUNT(u) FROM MembershipPlan m LEFT JOIN User u ON u.membership = m.name GROUP BY m")
    List<Object[]> countSubscribersByPlan();

    @Query("SELECT p FROM MembershipPlan p WHERE LOWER(p.name) = LOWER(:name) AND p.active = true")
    List<MembershipPlan> findActivePlansByName(@Param("name") String name);

    @Query("SELECT COUNT(p) FROM MembershipPlan p WHERE LOWER(p.name) = LOWER(:name)")
    Long countByNameIgnoreCase(@Param("name") String name);
}