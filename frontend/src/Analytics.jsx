import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function Analytics() {
  const [nodes, setNodes] = useState([]);
  const [stats, setStats] = useState([]); // Pre-calculated stats from DB
  const [logs, setLogs] = useState([]);   // Raw logs for the table
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch Node Structure (for Pie Chart)
    axios.get('http://localhost:8080/api/nodes').then(res => setNodes(res.data));
    
    // 2. Fetch SMART Stats (Pre-calculated by Backend)
    axios.get('http://localhost:8080/api/nodes/analytics/stats').then(res => setStats(res.data));

    // 3. Fetch Recent Logs (for the Table only)
    axios.get('http://localhost:8080/api/nodes/history').then(res => setLogs(res.data));
  }, []);

  // --- DATA PREPARATION (Visuals Only) ---
  
  // No more math here! Just formatting.
  const frequencyData = stats.slice(0, 5).map(item => ({
      name: item.nodeName.split('(')[0], // Shorten name
      count: item.failureCount,
      lost: item.totalLost
  }));

  // Criticality Pie Chart
  const criticalCount = nodes.filter(n => n.isCritical).length;
  const nonCriticalCount = nodes.length - criticalCount;
  const pieData = [
    { name: 'Critical', value: criticalCount },
    { name: 'Support', value: nonCriticalCount },
  ];
  const COLORS = ['#e74c3c', '#3498db'];

  return (
    <div style={{ padding: "40px", fontFamily: "Segoe UI", backgroundColor: "#f4f7f6", minHeight: "100vh" }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
           <h1 style={{ color: "#2c3e50", margin: 0 }}>Risk Analytics</h1>
           <p style={{ color: "#7f8c8d", margin: 0 }}>Server-Side Processed Metrics</p>
        </div>
        <button onClick={() => navigate('/')} style={{ padding: "10px 20px", backgroundColor: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
          ⬅ Back to Dashboard
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* CHART 1: FAILURE FREQUENCY (Powered by SQL) */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📉 Top 5 Failure Points</h3>
          {frequencyData.length > 0 ? (
            <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequencyData} layout="vertical" margin={{ left: 30 }}>
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={150} style={{ fontSize: '12px' }} />
                    <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Failures' : '€ Lost']} />
                    <Bar dataKey="count" fill="#8e44ad" radius={[0, 5, 5, 0]} barSize={20} name="Failure Count" />
                </BarChart>
                </ResponsiveContainer>
            </div>
          ) : (
            <p style={{ color: "#7f8c8d", textAlign: "center", marginTop: "50px" }}>No data yet.</p>
          )}
        </div>

        {/* CHART 2: INFRASTRUCTURE CRITICALITY */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#2c3e50', marginTop: 0 }}>🛡️ Asset Distribution</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* RAW HISTORY TABLE */}
      <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📝 Recent Incident Logs</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                  <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>Asset</th>
                      <th style={{ padding: '10px' }}>Event Type</th>
                      <th style={{ padding: '10px' }}>Cost Impact</th>
                      <th style={{ padding: '10px' }}>Time</th>
                  </tr>
              </thead>
              <tbody>
                  {logs.slice().reverse().slice(0, 8).map((log, i) => ( 
                      <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px', fontWeight: 'bold' }}>{log.nodeName}</td>
                          <td style={{ padding: '10px' }}>
                              <span style={{ 
                                  backgroundColor: log.failureType === 'MANUAL_KILL' ? '#fadbd8' : (log.failureType === 'AUTO_RECOVERY' ? '#d5f5e3' : '#fff3cd'),
                                  color: log.failureType === 'MANUAL_KILL' ? '#c0392b' : (log.failureType === 'AUTO_RECOVERY' ? '#27ae60' : '#d35400'),
                                  padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem'
                              }}>
                                  {log.failureType}
                              </span>
                          </td>
                          <td style={{ padding: '10px' }}>€{log.costAtTimeOfFailure.toLocaleString()}</td>
                          <td style={{ padding: '10px', color: '#7f8c8d' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
}

export default Analytics;