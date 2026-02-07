package com.resilience.backend.repository;

import com.resilience.backend.model.ChaosNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChaosNodeRepository extends JpaRepository<ChaosNode, Long> {
    // This interface gives us magical methods like .save(), .findAll(), .delete()
    // without us writing a single line of SQL!
}