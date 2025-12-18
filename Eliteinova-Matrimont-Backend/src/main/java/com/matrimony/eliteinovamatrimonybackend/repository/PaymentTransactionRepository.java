package com.matrimony.eliteinovamatrimonybackend.repository;

import com.matrimony.eliteinovamatrimonybackend.entity.PaymentTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    List<PaymentTransaction> findByUserId(Long userId);
    Page<PaymentTransaction> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<PaymentTransaction> findByStatus(PaymentTransaction.PaymentStatus status);
    Optional<PaymentTransaction> findByTransactionId(String transactionId);

    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.status = 'COMPLETED'")
    Long sumCompletedPayments();

    @Query("SELECT COUNT(p) FROM PaymentTransaction p WHERE p.status = 'COMPLETED' AND p.createdAt >= CURRENT_DATE")
    Long countTodayPayments();

    @Query("SELECT p.paymentMethod, COUNT(p) FROM PaymentTransaction p WHERE p.status = 'COMPLETED' GROUP BY p.paymentMethod")
    List<Object[]> countPaymentsByMethod();

    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.status = 'COMPLETED' AND MONTH(p.createdAt) = :month AND YEAR(p.createdAt) = :year")
    Long sumAmountByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT p FROM PaymentTransaction p LEFT JOIN FETCH p.user LEFT JOIN FETCH p.plan")
    List<PaymentTransaction> findAllWithUser();

    @Query("SELECT SUM(p.amount) FROM PaymentTransaction p WHERE p.status = 'COMPLETED' AND p.createdAt BETWEEN :start AND :end")
    Long sumRevenueByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}