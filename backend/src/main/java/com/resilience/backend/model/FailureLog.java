package com.resilience.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class FailureLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nodeName;
    private String failureType; // e.g., "MANUAL_KILL" or "CASCADE"
    private Double costAtTimeOfFailure;
    private LocalDateTime timestamp;

    public FailureLog() {}

    public FailureLog(String nodeName, String failureType, Double cost) {
        this.nodeName = nodeName;
        this.failureType = failureType;
        this.costAtTimeOfFailure = cost;
        this.timestamp = LocalDateTime.now();
    }
}