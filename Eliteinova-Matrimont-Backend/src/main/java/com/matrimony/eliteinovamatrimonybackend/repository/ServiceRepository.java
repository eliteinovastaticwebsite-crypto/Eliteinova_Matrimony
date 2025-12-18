package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.MatrimonyService; // ✅ CHANGED
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<MatrimonyService, Long> { // ✅ CHANGED

    List<MatrimonyService> findByActiveTrue(); // ✅ CHANGED
    List<MatrimonyService> findByCategoryAndActiveTrue(String category); // ✅ CHANGED
    List<MatrimonyService> findByFeaturedTrueAndActiveTrue(); // ✅ CHANGED
    List<MatrimonyService> findByPopularTrueAndActiveTrue(); // ✅ CHANGED
    Optional<MatrimonyService> findByIdAndActiveTrue(Long id); // ✅ CHANGED

    @Query("SELECT s.category, COUNT(s) FROM MatrimonyService s WHERE s.active = true GROUP BY s.category") // ✅ CHANGED
    List<Object[]> countServicesByCategory();

    @Query("SELECT s FROM MatrimonyService s WHERE s.active = true ORDER BY s.featured DESC, s.popular DESC, s.createdAt DESC") // ✅ CHANGED
    List<MatrimonyService> findAllActiveServicesSorted();
}