package com.resilience.backend.repository;

import com.resilience.backend.model.NodeDependency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NodeDependencyRepository extends JpaRepository<NodeDependency, Long> {
    // Find all parents for a specific node
    List<NodeDependency> findByNodeId(Long nodeId);

    // Find all children that rely on a specific parent
    List<NodeDependency> findByDependsOnId(Long dependsOnId);
}