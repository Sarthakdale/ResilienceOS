package com.resilience.backend.controller;

import com.resilience.backend.dto.FailureStats;
import com.resilience.backend.model.ChaosNode;
import com.resilience.backend.model.FailureLog;
import com.resilience.backend.model.NodeDependency;
import com.resilience.backend.repository.ChaosNodeRepository;
import com.resilience.backend.repository.FailureLogRepository;
import com.resilience.backend.repository.NodeDependencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nodes")
@CrossOrigin(origins = "*")
public class ChaosNodeController {

    @Autowired private ChaosNodeRepository repository;
    @Autowired private NodeDependencyRepository dependencyRepository;
    @Autowired private FailureLogRepository logRepository; // NEW: The Audit Log

    // 1. GET ALL NODES
    @GetMapping
    public List<ChaosNode> getAllNodes() { return repository.findAll(); }

    // 2. GET DEPENDENCIES (Graph Lines)
    @GetMapping("/dependencies")
    public List<NodeDependency> getDependencies() { return dependencyRepository.findAll(); }

    // 3. NEW: GET HISTORY LOGS (For Analytics)
    @GetMapping("/history")
    public List<FailureLog> getHistory() { return logRepository.findAll(); }

    // 4. KILL NODE (Manual Trigger)
    @PostMapping("/{id}/kill")
    public ChaosNode killNode(@PathVariable Long id) {
        ChaosNode node = repository.findById(id).orElseThrow();

        // Only act if the node is currently alive
        if (node.getResilienceScore() > 0) {
            node.setResilienceScore(0.0);
            repository.save(node);

            System.out.println("💥 MANUAL KILL: " + node.getName());

            // LOG IT TO DB
            logRepository.save(new FailureLog(node.getName(), "MANUAL_KILL", node.getDowntimeCostPerHour()));

            // Trigger the Chain Reaction
            propagateFailure(id);

            // Trigger the Auto-Repair
            checkAutomatedFailover(node);
        }
        return node;
    }

    // 5. RESET NODE (Repair Button)
    @PostMapping("/{id}/reset")
    public ChaosNode resetNode(@PathVariable Long id) {
        ChaosNode node = repository.findById(id).orElseThrow();
        node.setResilienceScore(100.0);
        return repository.save(node);
    }

    // 6. UPDATE NODE (Scenario Editor - Cost/Name changes)
    @PutMapping("/{id}")
    public ChaosNode updateNode(@PathVariable Long id, @RequestBody ChaosNode updatedDetails) {
        ChaosNode node = repository.findById(id).orElseThrow();
        node.setName(updatedDetails.getName());
        node.setDowntimeCostPerHour(updatedDetails.getDowntimeCostPerHour());
        node.setResilienceScore(updatedDetails.getResilienceScore());

        System.out.println("📝 UPDATE: User modified " + node.getName());
        return repository.save(node);
    }

    // --- HELPER: CASCADE FAILURE (Recursive) ---
    private void propagateFailure(Long parentId) {
        List<NodeDependency> dependentLinks = dependencyRepository.findByDependsOnId(parentId);
        for (NodeDependency link : dependentLinks) {
            ChaosNode childNode = repository.findById(link.getNodeId()).orElse(null);

            if (childNode != null && childNode.getResilienceScore() > 0) {
                System.out.println("   🔥 CASCADING FAILURE: " + childNode.getName());

                childNode.setResilienceScore(0.0);
                repository.save(childNode);

                // LOG IT TO DB
                logRepository.save(new FailureLog(childNode.getName(), "CASCADE_FAILURE", childNode.getDowntimeCostPerHour()));

                // RECURSION
                propagateFailure(link.getNodeId());
            }
        }
    }

    // --- HELPER: AUTOMATED MITIGATION (Smart Backups) ---
    private void checkAutomatedFailover(ChaosNode failedNode) {
        List<ChaosNode> allNodes = repository.findAll();
        String failedName = failedNode.getName();

        if (failedName.contains("Power Grid")) {
            activateBackup(allNodes, "Diesel Generators", "Berlin Assembly Plant");
        } else if (failedName.contains("AWS")) {
            activateBackup(allNodes, "Disaster Recovery Server", "Web Storefront");
        } else if (failedName.contains("Port of Hamburg")) {
            activateBackup(allNodes, "Emergency Rail Freight", "Taiwan Semiconductor");
        }
    }

    private void activateBackup(List<ChaosNode> allNodes, String backupName, String victimName) {
        ChaosNode backup = allNodes.stream().filter(n -> n.getName().contains(backupName)).findFirst().orElse(null);
        ChaosNode victim = allNodes.stream().filter(n -> n.getName().contains(victimName)).findFirst().orElse(null);

        if (backup != null && victim != null) {
            System.out.println("✅ MITIGATION: Activating " + backup.getName());

            // Turn on Backup
            backup.setResilienceScore(100.0);
            repository.save(backup);

            // Save Victim
            victim.setResilienceScore(100.0);
            repository.save(victim);

            // LOG THE SAVE
            logRepository.save(new FailureLog(victim.getName(), "AUTO_RECOVERY", 0.0));
        }
    }
    // ANALYTICS ENDPOINT: Server-Side Processing
    // Faster, cleaner, and scalable
    @GetMapping("/analytics/stats")
    public List<FailureStats> getFailureStats() {
        return logRepository.findTopFailures();
    }
}