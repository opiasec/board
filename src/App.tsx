import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  Connection,
  Edge,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Panel,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Download, Upload, Trash2, Undo2, Redo2 } from 'lucide-react';

import { PersonNode } from './components/nodes/PersonNode';
import { SoftwareSystemNode } from './components/nodes/SoftwareSystemNode';
import { ContainerNode } from './components/nodes/ContainerNode';
import { BoundaryNode } from './components/nodes/BoundaryNode';
import { AssetNode } from './components/nodes/AssetNode';
import { ThreatNode } from './components/nodes/ThreatNode';
import { ControlNode } from './components/nodes/ControlNode';
import { Sidebar } from './components/Sidebar';
import { EditPanel } from './components/EditPanel';

const STORAGE_KEY = 'c4-model-board-state';
const MAX_HISTORY = 50;

const nodeTypes = {
  person: PersonNode,
  softwareSystem: SoftwareSystemNode,
  container: ContainerNode,
  boundary: BoundaryNode,
  asset: AssetNode,
  threat: ThreatNode,
  control: ControlNode,
};

const getInitialState = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        nodes: parsed.nodes || [],
        edges: parsed.edges || [],
      };
    } catch (e) {
      console.error('Failed to parse storage', e);
    }
  }
  return { nodes: [], edges: [] };
};

const initialState = getInitialState();

let idCounter = Date.now();
const getId = () => `node_${idCounter++}`;

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clipboard = useRef<{ nodes: Node[], edges: Edge[] } | null>(null);
  
  const [nodes, setNodes] = useState<Node[]>(initialState.nodes);
  const [edges, setEdges] = useState<Edge[]>(initialState.edges);
  
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
    edgesRef.current = edges;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  const [past, setPast] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
  const [future, setFuture] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);

  const { screenToFlowPosition, setViewport, getInternalNode } = useReactFlow();
  const [selectedElement, setSelectedElement] = useState<Node | Edge | null>(null);

  const takeSnapshot = useCallback(() => {
    const snapshot = {
      nodes: JSON.parse(JSON.stringify(nodesRef.current)),
      edges: JSON.parse(JSON.stringify(edgesRef.current)),
    };
    setPast((prev) => {
      const newPast = [...prev, snapshot];
      if (newPast.length > MAX_HISTORY) newPast.shift();
      return newPast;
    });
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, prevPast.length - 1);
      setFuture((prevFuture) => [{ nodes: JSON.parse(JSON.stringify(nodesRef.current)), edges: JSON.parse(JSON.stringify(edgesRef.current)) }, ...prevFuture]);
      setNodes(previous.nodes);
      setEdges(previous.edges);
      return newPast;
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);
      setPast((prevPast) => [...prevPast, { nodes: JSON.parse(JSON.stringify(nodesRef.current)), edges: JSON.parse(JSON.stringify(edgesRef.current)) }]);
      setNodes(next.nodes);
      setEdges(next.edges);
      return newFuture;
    });
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params: Connection) => {
    takeSnapshot();
    setEdges((eds) => addEdge({ 
      ...params, 
      label: 'Uses', 
      type: 'smoothstep',
      labelStyle: { fill: '#666', fontWeight: 700, fontSize: 10 },
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 4,
      labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
    }, eds));
  }, [takeSnapshot]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      
      // Check if we dropped over an existing node
      const targetNode = nodes.find((node) => {
        const nodeInternal = getInternalNode(node.id);
        if (!nodeInternal) return false;
        
        const { x, y } = node.position;
        const width = nodeInternal.measured.width || 0;
        const height = nodeInternal.measured.height || 0;

        return (
          position.x >= x &&
          position.x <= x + width &&
          position.y >= y &&
          position.y <= y + height &&
          node.type !== 'boundary' &&
          node.type !== 'asset' &&
          node.type !== 'threat' &&
          node.type !== 'control'
        );
      });

      const isThreatModelingType = ['asset', 'threat', 'control'].includes(type);

      // Validation: Threat modeling elements MUST be attached to valid parents
      if (isThreatModelingType) {
        if (!targetNode || !['softwareSystem', 'container'].includes(targetNode.type || '')) {
          alert('Asset, Threat and Control elements must be attached to a Software System or Container.');
          return;
        }
      }

      takeSnapshot();

      const newNode: any = {
        id: getId(),
        type,
        position: targetNode 
          ? { x: 10, y: 10 + (nodes.filter(n => n.parentId === targetNode.id).length * 32) } 
          : position,
        data: { label: `New ${type}`, description: '' },
      };

      if (type === 'boundary') {
        newNode.style = { width: 300, height: 200, zIndex: -1 };
      } else if (type === 'asset' || type === 'threat' || type === 'control') {
        newNode.style = { zIndex: 10 };
        if (targetNode) {
          newNode.parentId = targetNode.id;
          newNode.extent = 'parent';
        }
      } else {
        newNode.style = { zIndex: 1 };
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, takeSnapshot, nodes, getInternalNode]
  );

  const updateElementData = useCallback((id: string, newData: any, isEdge = false) => {
    takeSnapshot();
    if (isEdge) {
      setEdges((eds) => eds.map((edge) => (edge.id === id ? { ...edge, ...newData } : edge)));
    } else {
      setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...newData } } : node)));
    }
  }, [takeSnapshot]);

  const deleteElement = useCallback((id: string, isEdge = false) => {
    takeSnapshot();
    if (isEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== id));
    } else {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    }
    setSelectedElement(null);
  }, [takeSnapshot]);

  const onCopy = useCallback(() => {
    const selectedNodes = nodesRef.current.filter((n) => n.selected);
    const selectedEdges = edgesRef.current.filter((e) => e.selected);
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      clipboard.current = { nodes: JSON.parse(JSON.stringify(selectedNodes)), edges: JSON.parse(JSON.stringify(selectedEdges)) };
    }
  }, []);

  const onPaste = useCallback(() => {
    if (!clipboard.current) return;
    takeSnapshot();
    const { nodes: nodesToPaste, edges: edgesToPaste } = clipboard.current;
    const idMap: Record<string, string> = {};
    const newNodes = nodesToPaste.map((node) => {
      const newId = getId();
      idMap[node.id] = newId;
      return { ...node, id: newId, position: { x: node.position.x + 40, y: node.position.y + 40 }, selected: true };
    });
    const newEdges = edgesToPaste.map((edge) => ({ ...edge, id: `e_${getId()}`, source: idMap[edge.source] || edge.source, target: idMap[edge.target] || edge.target, selected: true }));
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })).concat(newNodes));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: false })).concat(newEdges));
  }, [takeSnapshot]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) return;
      const isCmd = event.metaKey || event.ctrlKey;
      const isShift = event.shiftKey;
      if (isCmd && event.key === 'z' && !isShift) { event.preventDefault(); undo(); }
      if (isCmd && (event.key === 'y' || (event.key === 'z' && isShift))) { event.preventDefault(); redo(); }
      if (isCmd && event.key === 'c') { event.preventDefault(); onCopy(); }
      if (isCmd && event.key === 'v') { event.preventDefault(); onPaste(); }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodesRef.current.filter((n) => n.selected);
        const selectedEdges = edgesRef.current.filter((e) => e.selected);
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          takeSnapshot();
          selectedNodes.forEach((n) => deleteElement(n.id, false));
          selectedEdges.forEach((e) => deleteElement(e.id, true));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, onCopy, onPaste, deleteElement, takeSnapshot]);

  return (
    <div className="flex w-screen h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={(_, n) => setSelectedElement(n)}
          onEdgeClick={(_, e) => setSelectedElement(e)}
          onPaneClick={() => setSelectedElement(null)}
          onNodeDragStart={takeSnapshot}
          onSelectionDragStart={takeSnapshot}
          nodeTypes={nodeTypes}
          fitView
          selectionOnDrag
          selectionMode={'pointer' as any}
          selectNodesOnDrag={false}
          multiSelectionKeyCode="Shift"
          deleteKeyCode={['Delete', 'Backspace']}
        >
          <Background color="#ccc" variant={'dots' as any} />
          <Controls />
          <Panel position="top-right" className="flex gap-2 bg-white p-2 rounded-md shadow-md border border-gray-200">
            <div className="flex border-r pr-2 gap-1 mr-1">
              <button onClick={undo} disabled={past.length === 0} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)"><Undo2 size={16} /></button>
              <button onClick={redo} disabled={future.length === 0} className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 transition-colors" title="Redo (Ctrl+Y)"><Redo2 size={16} /></button>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                try {
                  const data = JSON.parse(ev.target?.result as string);
                  takeSnapshot();
                  if (data.nodes) setNodes(data.nodes);
                  if (data.edges) setEdges(data.edges);
                  setTimeout(() => setViewport({ x: 0, y: 0, zoom: 0.8 }, { duration: 800 }), 100);
                } catch { alert('Invalid JSON format'); }
              };
              reader.readAsText(file);
              e.target.value = '';
            }} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Import JSON"><Upload size={14} /> Import</button>
            <button onClick={() => {
              const flow = { nodes: nodesRef.current, edges: edgesRef.current, version: '1.0.0', timestamp: new Date().toISOString() };
              const link = document.createElement('a');
              link.href = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(flow, null, 2))}`;
              link.download = `threat-model-${Date.now()}.json`;
              link.click();
            }} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors" title="Export to JSON"><Download size={14} /> Export</button>
            <button onClick={() => { if (window.confirm('Clear board?')) { takeSnapshot(); setNodes([]); setEdges([]); localStorage.removeItem(STORAGE_KEY); } }} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded transition-colors" title="Clear Board"><Trash2 size={14} /> Clear</button>
          </Panel>
        </ReactFlow>
      </div>
      <EditPanel selectedElement={selectedElement} onUpdate={updateElementData} onDelete={deleteElement} onClose={() => setSelectedElement(null)} />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
