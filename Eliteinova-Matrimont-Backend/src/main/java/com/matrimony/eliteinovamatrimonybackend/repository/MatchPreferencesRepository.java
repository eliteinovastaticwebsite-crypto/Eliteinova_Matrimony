package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.MatchPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatchPreferencesRepository extends JpaRepository<MatchPreferences, Long> {
    Optional<MatchPreferences> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
