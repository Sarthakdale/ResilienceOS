package com.resilience.backend.dto;

public class FailureStats {
    private String nodeName;
    private Long failureCount;
    private Double totalLost; // New Metric: Total money lost by this specific node

    public FailureStats(String nodeName, Long failureCount, Double totalLost) {
        this.nodeName = nodeName;
        this.failureCount = failureCount;
        this.totalLost = totalLost;
    }

    // Getters are needed for JSON conversion
    public String getNodeName() { return nodeName; }
    public Long getFailureCount() { return failureCount; }
    public Double getTotalLost() { return totalLost; }
}