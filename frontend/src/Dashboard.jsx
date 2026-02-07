import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [nodes, setNodes] = useState([]);
  const [totalLoss, setTotalLoss] = useState(0);
  const [logs, setLogs] = useState([]);
  
  // EDIT MODE STATE
  const [editingNode, setEditingNode] = useState(null); // Which node are we editing?
  const [editForm, setEditForm] = useState({ name: '', cost: 0, score: 0 });

  const navigate = useNavigate();

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 4)]);
  };

  const fetchNodes = () => {
    axios.get('http://localhost:8080/api/nodes')
      .then(response => {
        const data = response.data;
        const sorted = data.sort((a, b) => (a.isCritical === b.isCritical) ? 0 : a.isCritical ? -1 : 1);
        setNodes(sorted);
        
        // Calculate Total Risk
        const currentRisk = data
          .filter(node => node.resilienceScore === 0)
          .reduce((sum, node) => sum + node.downtimeCostPerHour, 0);
        setTotalLoss(currentRisk);
      })
      .catch(error => console.error("Error:", error));
  };

  useEffect(() => { fetchNodes(); }, []);

  // --- ACTIONS ---
  const killNode = (id, name) => { 
    addLog(`⚠ ALERT: Initiating Failure on ${name}...`);
    axios.post(`http://localhost:8080/api/nodes/${id}/kill`).then(() => {
        fetchNodes();
        setTimeout(() => {
            if (name.includes("Power Grid") || name.includes("AWS") || name.includes("Port")) {
                addLog(`✅ SYSTEM: Auto-Failover Triggered for ${name}`);
            }
        }, 500);
    }); 
  };

  const repairNode = (id, name) => { 
    addLog(`🔧 MAINTENANCE: Repairing ${name}...`);
    axios.post(`http://localhost:8080/api/nodes/${id}/reset`).then(fetchNodes); 
  };

  // --- EDITING LOGIC ---
  const handleEditClick = (node) => {
    setEditingNode(node);
    setEditForm({ name: node.name, cost: node.downtimeCostPerHour, score: node.resilienceScore });
  };

  const saveEdit = () => {
    if (!editingNode) return;
    axios.put(`http://localhost:8080/api/nodes/${editingNode.id}`, {
      name: editForm.name,
      downtimeCostPerHour: editForm.cost,
      resilienceScore: editForm.score
    }).then(() => {
      addLog(`📝 UPDATE: Modified parameters for ${editForm.name}`);
      setEditingNode(null); // Close modal
      fetchNodes(); // Refresh data
    });
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Segoe UI", backgroundColor: "#f4f7f6", minHeight: "100vh", position: 'relative' }}>
      
      {/* FINANCIAL TICKER */}
      <div style={{ 
        backgroundColor: totalLoss > 0 ? "#e74c3c" : "#2ecc71", 
        color: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px", textAlign: "center", boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ margin: 0, opacity: 0.9 }}>LIVE FINANCIAL IMPACT</h2>
        <h1 style={{ margin: "5px 0", fontSize: "3rem" }}>€{totalLoss.toLocaleString()} <span style={{fontSize: "1rem"}}>/ Hour</span></h1>
      </div>

      <header style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ color: "#2c3e50", margin: 0 }}>ResilienceOS</h1>
          <p style={{ color: "#7f8c8d", margin: 0 }}>Strategic Risk Simulation</p>
        </div>
        
        {/* BUTTON GROUP */}
        <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => navigate('/analytics')} 
              style={{ padding: "15px 25px", backgroundColor: "#8e44ad", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              📊 Analytics
            </button>
            <button 
              onClick={() => navigate('/graph')} 
              style={{ padding: "15px 25px", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              🕸️ Network Graph
            </button>
        </div>
      </header>
      
      {/* MAIN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "30px" }}>
        
        {/* CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {nodes.map(node => (
            <div key={node.id} style={{ 
              backgroundColor: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
              borderLeft: node.resilienceScore === 0 ? "6px solid #e74c3c" : (node.isCritical ? "6px solid #f1c40f" : "6px solid #2ecc71"),
              opacity: node.resilienceScore === 0 ? 0.7 : 1,
              position: 'relative'
            }}>
              {/* EDIT BUTTON (Top Right) */}
              <button 
                onClick={() => handleEditClick(node)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                ✏️
              </button>

              <h3 style={{ margin: "0 0 10px 0", fontSize: "1.1rem", color: "#34495e", paddingRight: "20px" }}>{node.name}</h3>
              <div style={{ marginBottom: "15px", fontSize: "0.9rem", color: "#7f8c8d" }}>
                 <p>Health: <strong style={{ color: node.resilienceScore === 0 ? "#e74c3c" : "#2ecc71" }}>{node.resilienceScore}%</strong></p>
                 <p>Loss/Hr: <strong>€{node.downtimeCostPerHour.toLocaleString()}</strong></p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {node.resilienceScore > 0 ? (
                  <button onClick={() => killNode(node.id, node.name)} style={{ flex: 1, padding: "8px", backgroundColor: "#ffebee", color: "#c0392b", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>💥 FAIL</button>
                ) : (
                  <button onClick={() => repairNode(node.id, node.name)} style={{ flex: 1, padding: "8px", backgroundColor: "#e8f8f5", color: "#16a085", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>🔧 REPAIR</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* LOGS */}
        <div style={{ backgroundColor: "#2c3e50", borderRadius: "15px", padding: "20px", color: "#ecf0f1", height: "fit-content", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <h3 style={{ borderBottom: "1px solid #7f8c8d", paddingBottom: "10px", marginTop: 0 }}>📟 System Logs</h3>
            <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
                {logs.length === 0 && <p style={{ color: "#7f8c8d" }}>System operating normally...</p>}
                {logs.map((log, i) => (
                    <p key={i} style={{ margin: "10px 0", color: log.includes("ALERT") ? "#e74c3c" : (log.includes("✅") ? "#2ecc71" : log.includes("UPDATE") ? "#f1c40f" : "#ecf0f1") }}>
                        {log}
                    </p>
                ))}
            </div>
        </div>
      </div>

      {/* --- EDIT MODAL (POPUP) --- */}
      {editingNode && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Edit Node Scenario</h2>
            
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Asset Name</label>
            <input 
              type="text" 
              value={editForm.name} 
              onChange={e => setEditForm({...editForm, name: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Financial Impact (€/Hr)</label>
            <input 
              type="number" 
              value={editForm.cost} 
              onChange={e => setEditForm({...editForm, cost: parseFloat(e.target.value)})}
              style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Health Score (%)</label>
            <input 
              type="number" 
              value={editForm.score} 
              onChange={e => setEditForm({...editForm, score: parseFloat(e.target.value)})}
              style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saveEdit} style={{ flex: 1, padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>💾 Save Changes</button>
              <button onClick={() => setEditingNode(null)} style={{ flex: 1, padding: '10px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;