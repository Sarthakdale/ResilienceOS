package com.resilience.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity // Tells Java this is a Database Table
@Data   // Lombok: Automatically generates Getters, Setters, and toString
@Table(name = "chaos_nodes") // Custom table name for Postgres
public class ChaosNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The name of the asset (e.g., "Frankfurt Data Center")
    @Column(nullable = false)
    private String name;

    // The category (e.g., "Logistics", "IT_Infrastructure", "Supplier")
    // In a real interview, you'd mention this allows for "Sector-Specific Risk Analysis"
    private String nodeType;

    // A score from 0.0 to 100.0 representing current health
    // 100 = Fully Operational, 0 = Total Failure
    private Double resilienceScore;

    // Is this a "Single Point of Failure"?
    // If TRUE, failure here stops the whole business.
    private Boolean isCritical;

    // Cost per hour if this node goes down (Financial Impact Analysis)
    private Double downtimeCostPerHour;
}