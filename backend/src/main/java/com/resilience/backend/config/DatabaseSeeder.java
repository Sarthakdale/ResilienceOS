package com.resilience.backend.config;

import com.resilience.backend.model.ChaosNode;
import com.resilience.backend.model.NodeDependency;
import com.resilience.backend.repository.ChaosNodeRepository;
import com.resilience.backend.repository.NodeDependencyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(ChaosNodeRepository nodeRepository, NodeDependencyRepository dependencyRepository) {
        return args -> {
            // 1. Wipe clean
            dependencyRepository.deleteAll();
            nodeRepository.deleteAll();

            System.out.println("🌱 Seeding ResilienceOS with MASSIVE Smart Ecosystem (33 Nodes)...");

            // --- 1. CRITICAL INFRASTRUCTURE (With Backups) ---
            ChaosNode awsCloud = createNode("AWS region (Frankfurt)", "IT_Infrastructure", 99.9, true, 85000.0);
            ChaosNode backupServer = createNode("Disaster Recovery Server (Paris)", "IT_Infrastructure", 100.0, false, 0.0); // BACKUP
            ChaosNode powerGrid = createNode("Regional Power Grid (Munich)", "Utilities", 99.5, true, 1000000.0);
            ChaosNode generator = createNode("Diesel Generators (Backup)", "Utilities", 100.0, false, 0.0); // BACKUP
            ChaosNode internet = createNode("VPN & Internal Wifi", "IT_Infrastructure", 88.0, false, 5000.0);
            ChaosNode firewall = createNode("Enterprise Firewall Perimeter", "Security", 99.8, true, 1000000.0);

            // --- 2. MANUFACTURING ---
            ChaosNode berlinFactory = createNode("Berlin Assembly Plant", "Manufacturing", 94.0, true, 450000.0);
            ChaosNode roboticArm = createNode("Robotic Welding Unit A", "Manufacturing", 89.5, false, 30000.0);
            ChaosNode paintShop = createNode("Automated Paint Shop", "Manufacturing", 91.0, false, 45000.0);
            ChaosNode coolingSystem = createNode("Factory Cooling System", "Facility", 94.0, true, 20000.0);
            ChaosNode prototype3D = createNode("3D Printer Fleet (Prototyping)", "R&D", 82.0, false, 5000.0);

            // --- 3. LOGISTICS (With Backups) ---
            ChaosNode hamburgPort = createNode("Port of Hamburg (Inbound)", "Logistics", 85.0, true, 120000.0);
            ChaosNode railFreight = createNode("Emergency Rail Freight", "Logistics", 100.0, false, 0.0); // BACKUP
            ChaosNode dhlFreight = createNode("DHL Freight Partner", "Logistics", 90.0, false, 25000.0);
            ChaosNode balticRoute = createNode("Baltic Sea Shipping Route", "External_Logistics", 80.0, true, 200000.0);

            // --- 4. SALES & MARKET ---
            ChaosNode onlineStore = createNode("Web Storefront (Shopify)", "Sales", 99.2, true, 75000.0);
            ChaosNode berlinShowroom = createNode("Berlin Flagship Showroom", "Sales", 96.0, false, 12000.0);
            ChaosNode crmSystem = createNode("Salesforce CRM", "IT_Software", 92.0, false, 15000.0);
            ChaosNode supportCenter = createNode("Call Center (Poland)", "Support", 88.5, false, 8000.0);

            // --- 5. SUPPLIERS & MATERIALS ---
            ChaosNode chipSupply = createNode("Taiwan Semiconductor (Import)", "Supplier", 75.0, true, 300000.0);
            ChaosNode steelSupply = createNode("ThyssenKrupp Steel Supply", "Supplier", 96.0, true, 80000.0);
            ChaosNode batterySupply = createNode("Lithium Ion Batteries (Asia)", "Supplier", 78.0, true, 150000.0);

            // --- 6. CORPORATE & LEGAL ---
            ChaosNode hqOffice = createNode("Munich Headquarters", "Facility", 98.0, false, 10000.0);
            ChaosNode payroll = createNode("SAP Payroll", "HR", 99.0, true, 60000.0);
            ChaosNode gdprDb = createNode("GDPR Compliance Database", "Legal", 99.9, true, 500000.0);
            ChaosNode unionRep = createNode("Labor Union Representative", "HR", 90.0, true, 0.0);
            ChaosNode importLicense = createNode("EU Import License API", "Legal", 97.0, true, 50000.0);

            // --- 7. R&D & INNOVATION ---
            ChaosNode stuttgartLab = createNode("Stuttgart Innovation Lab", "R&D", 95.0, false, 20000.0);
            ChaosNode cadServer = createNode("AutoCAD License Server", "IT_Software", 99.0, true, 18000.0);
            ChaosNode idpSystem = createNode("Okta Identity Provider", "Security", 99.9, true, 150000.0);

            // --- SAVE ALL NODES ---
            List<ChaosNode> savedNodes = nodeRepository.saveAll(Arrays.asList(
                    awsCloud, backupServer, powerGrid, generator, internet, firewall,
                    berlinFactory, roboticArm, paintShop, coolingSystem, prototype3D,
                    hamburgPort, railFreight, dhlFreight, balticRoute,
                    onlineStore, berlinShowroom, crmSystem, supportCenter,
                    chipSupply, steelSupply, batterySupply,
                    hqOffice, payroll, gdprDb, unionRep, importLicense,
                    stuttgartLab, cadServer, idpSystem
            ));

            // --- DEFINE DEPENDENCIES (The "Wires") ---

            // Scenario A: Power Grid Failure -> Factory & HQ
            link(berlinFactory, powerGrid, dependencyRepository);
            link(hqOffice, powerGrid, dependencyRepository);
            link(coolingSystem, powerGrid, dependencyRepository);
            link(roboticArm, berlinFactory, dependencyRepository); // Robot needs Factory
            link(paintShop, berlinFactory, dependencyRepository);

            // Scenario B: AWS Failure -> Online Store & CRM
            link(onlineStore, awsCloud, dependencyRepository);
            link(crmSystem, awsCloud, dependencyRepository);
            link(onlineStore, internet, dependencyRepository);

            // Scenario C: Hamburg Port Failure -> Chips & Batteries
            link(hamburgPort, balticRoute, dependencyRepository);
            link(chipSupply, hamburgPort, dependencyRepository);
            link(batterySupply, hamburgPort, dependencyRepository);

            // Other random links to make the graph look cool/realistic
            link(payroll, internet, dependencyRepository);
            link(gdprDb, firewall, dependencyRepository);
            link(stuttgartLab, powerGrid, dependencyRepository);
            link(berlinShowroom, berlinFactory, dependencyRepository); // Showroom needs cars from factory!

            System.out.println("✅ Database Seeded with 30+ Nodes AND 3 Backup Scenarios!");
        };
    }

    private ChaosNode createNode(String name, String type, Double score, Boolean isCritical, Double cost) {
        ChaosNode node = new ChaosNode();
        node.setName(name);
        node.setNodeType(type);
        node.setResilienceScore(score);
        node.setIsCritical(isCritical);
        node.setDowntimeCostPerHour(cost);
        return node;
    }

    private void link(ChaosNode child, ChaosNode parent, NodeDependencyRepository repo) {
        repo.save(new NodeDependency(child.getId(), parent.getId()));
    }
}