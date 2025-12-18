package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
    boolean existsByEmail(String email);

    // ✅ REMOVED User queries - they belong in UserRepository
}