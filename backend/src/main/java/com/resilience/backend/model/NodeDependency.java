package com.resilience.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class NodeDependency {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The Child (e.g., "Berlin Factory")
    @Column(name = "node_id")
    private Long nodeId;

    // The Parent it relies on (e.g., "Power Grid")
    @Column(name = "depends_on_id")
    private Long dependsOnId;

    // Constructor for easy usage
    public NodeDependency() {}

    public NodeDependency(Long nodeId, Long dependsOnId) {
        this.nodeId = nodeId;
        this.dependsOnId = dependsOnId;
    }
}