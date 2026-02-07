import { useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation

function GraphView() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const navigate = useNavigate();

  const getPosition = (type, index) => {
    let x = 0;
    if (['Utilities', 'IT_Infrastructure', 'Supplier', 'Security'].includes(type)) x = 0;
    else if (['Manufacturing', 'R&D', 'Legal', 'HR', 'Facility'].includes(type)) x = 400;
    else x = 800;
    return { x: x, y: index * 100 };
  };

  const fetchData = useCallback(() => {
    Promise.all([
      axios.get('http://localhost:8080/api/nodes'),
      axios.get('http://localhost:8080/api/nodes/dependencies')
    ]).then(([nodesRes, depsRes]) => {
      const rawNodes = nodesRes.data;
      const rawLinks = depsRes.data;

      const flowNodes = rawNodes.map((node, i) => ({
        id: node.id.toString(),
        position: getPosition(node.nodeType, i % 10),
        data: { 
          label: (
            <div style={{ 
              padding: '10px', 
              border: node.resilienceScore === 0 ? '3px solid red' : '1px solid #777',
              backgroundColor: node.resilienceScore === 0 ? '#ffcccb' : 'white',
              borderRadius: '5px',
              width: '180px',
              textAlign: 'center',
              fontSize: '12px'
            }}>
              <strong>{node.name}</strong>
              <div style={{marginTop: '5px'}}>
                 {node.resilienceScore === 0 ? '❌ FAILED' : '✅ ONLINE'}
              </div>
            </div>
          ) 
        },
        type: 'default',
      }));

      const flowEdges = rawLinks.map((link) => ({
        id: `e${link.nodeId}-${link.dependsOnId}`,
        source: link.dependsOnId.toString(),
        target: link.nodeId.toString(),
        animated: true,
        style: { stroke: rawNodes.find(n => n.id === link.dependsOnId)?.resilienceScore === 0 ? 'red' : '#b1b1b7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    });
  }, [setNodes, setEdges]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '15px', backgroundColor: '#34495e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>🕸️ Supply Chain Network Graph</h2>
        <button 
          onClick={() => navigate('/')} 
          style={{ padding: '10px 20px', backgroundColor: '#ecf0f1', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          ⬅ Back to Dashboard
        </button>
      </div>
      <div style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default GraphView;