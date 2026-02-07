package com.resilience.backend.repository;

import com.resilience.backend.dto.FailureStats;
import com.resilience.backend.model.FailureLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FailureLogRepository extends JpaRepository<FailureLog, Long> {

    // THE SMART LOGIC:
    // 1. Filter out "AUTO_RECOVERY" (we only want bad events)
    // 2. Group by Node Name
    // 3. Count failures AND Sum the financial loss
    // 4. Sort by the most frequent failures
    @Query("SELECT new com.resilience.backend.dto.FailureStats(" +
            "f.nodeName, COUNT(f), SUM(f.costAtTimeOfFailure)) " +
            "FROM FailureLog f " +
            "WHERE f.failureType <> 'AUTO_RECOVERY' " +
            "GROUP BY f.nodeName " +
            "ORDER BY COUNT(f) DESC")
    List<FailureStats> findTopFailures();
}