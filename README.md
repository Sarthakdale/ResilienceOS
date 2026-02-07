# ResilienceOS: Enterprise Supply Chain Digital Twin 🏭
### *Strategic Risk Simulation, Fault Tolerance, and Automated Mitigation System*

![Project Status](https://img.shields.io/badge/Status-Production_Ready-success)
![Build](https://img.shields.io/badge/Build-Stable-2ecc71)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📖 Executive Summary

**ResilienceOS** is a sophisticated **Digital Twin** application designed to simulate, visualize, and mitigate high-stakes supply chain disruptions in real-time. 

In an era where "Just-in-Time" manufacturing creates fragile ecosystems, managers lack the tools to visualize systemic risks. This project solves that problem by modeling a complex, 33-node interdependency graph (spanning Logistics, IT Infrastructure, and Production) and applying recursive algorithms to predict **Cascading Failures**.

More than just a simulation, ResilienceOS acts as an **Autonomous Defense System**. It features a "Self-Healing" engine that detects critical infrastructure failures (e.g., Regional Power Grid outages) and automatically reroutes resources (e.g., activating Backup Generators) to prevent operational paralysis and financial hemorrhage.

---

## 🚀 Key Capabilities & Features

### 1. 🕸️ Interactive Digital Twin (Force-Directed Graph)
The core of the system is a dynamic visualization of the entire supply chain network.
- **Complex Dependency Mapping:** Models the intricate relationships between physical assets (Trucks, Factories), digital assets (AWS Servers, ERP Systems), and infrastructure (Power Grids, Cooling Systems).
- **Visual Status Indicators:** Utilizing modern icons and color-coded health states, the graph provides immediate situational awareness to decision-makers.

### 2. 📉 Real-Time Financial Risk Ticker
Unlike traditional monitoring tools that report "uptime," ResilienceOS reports **"Value at Risk"**.
- **Live Calculation:** The system aggregates the downtime cost of every failed node in real-time.
- **Strategic Insight:** A failure in the *Berlin Assembly Plant* isn't just a technical error; it is quantified as a **€450,000/hour** operational loss, enabling managers to prioritize fixes based on ROI.

### 3. 🛡️ Automated Self-Healing Engine (The "Intelligence")
The system moves beyond passive monitoring to active mitigation using conditional logic.
- **Scenario:** A "Black Swan" event hits the *Regional Power Grid*.
- **Reaction:** The backend detects the failure pattern and triggers the **Failover Protocol**.
- **Outcome:** *Diesel Generators* are autonomously brought online within milliseconds, saving the factory and preventing millions in potential losses.

### 4. 📊 Post-Mortem Analytics Dashboard
A dedicated "War Room" for analyzing historical performance and identifying systemic weaknesses.
- **Server-Side Aggregation:** Uses optimized JPQL queries to process failure logs on the database level, ensuring scalability even with millions of records.
- **Frequency Analysis:** Visualizes "Top 5 Most Frequent Failures," helping managers identify Single Points of Failure (SPOF) that require capital investment.
- **Audit Trails:** Maintains a persistent, immutable log of every crash, manual kill, and automated recovery event for compliance and review.

### 5. ⚡ "Panic Mode" Modern UI
Designed with **Human-Computer Interaction (HCI)** principles in mind.
- **Glassmorphism Design:** A modern, frosted-glass aesthetic that reduces visual clutter.
- **Urgency Animations:** Critical failures trigger a "Pulse" animation on asset cards, instantly drawing the operator's eye to the crisis.
- **Dynamic Health Bars:** Provides granular visibility into asset degradation before total failure occurs.

---

## 🛠️ Technical Architecture

The application is built as a **Full-Stack Monolith** with a clear separation of concerns, ensuring maintainability and scalability.

### **Backend ( The "Brain" )**
- **Language:** Java 21 (LTS)
- **Framework:** Spring Boot 3.2
- **Key Logic:**
    - **Recursive Propagation:** Uses Depth-First Search (DFS) algorithms to traverse the dependency graph and trigger cascading failures downstream.
    - **RESTful APIs:** Exposes endpoints for `GET /nodes`, `POST /kill`, and `GET /analytics`.
    - **Data Transfer Objects (DTOs):** Efficiently packages statistical data for the frontend.

### **Frontend ( The "Face" )**
- **Library:** React.js (Vite)
- **Visualization:** Recharts (for Analytics) & Custom CSS Animations.
- **State Management:** React Hooks (`useState`, `useEffect`) for real-time UI updates without page reloads.

### **Database ( The "Memory" )**
- **System:** PostgreSQL
- **ORM:** Hibernate / Spring Data JPA.
- **Optimization:** Uses Indexed Queries and Server-Side counting to minimize latency during heavy load.

---

## 💻 Installation & Setup Guide

Follow these steps to deploy ResilienceOS on your local machine.

### Prerequisites
- Java JDK 17 or higher
- Node.js & npm
- PostgreSQL (Local or Docker)

###🔮 Future Roadmap
Machine Learning Integration: Implement a Python microservice to predict node failures before they happen based on historical latency data.
Multi-User Role Access: Distinct dashboards for "CTO" (Technical View) and "CFO" (Financial View).
Cloud Deployment: Containerization using Docker and orchestration via Kubernetes for high availability

### 👨‍💻 Author
Sarthak Dale Aspiring Master's in Management Candidate | Full-Stack Developer | Strategic Thinker
Bridging the gap between Complex Engineering and Strategic Management.
