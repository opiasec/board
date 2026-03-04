import React from 'react';
import { User, Box, Database, Layout, Coins, AlertTriangle, ShieldCheck } from 'lucide-react';

const c4NodeTypes = [
  { type: 'person', label: 'Person', icon: <User size={18} />, color: 'bg-slate-700' },
  { type: 'softwareSystem', label: 'Software System', icon: <Box size={18} />, color: 'bg-slate-600' },
  { type: 'container', label: 'Container', icon: <Database size={18} />, color: 'bg-slate-500' },
  { type: 'boundary', label: 'Boundary', icon: <Layout size={18} />, color: 'bg-slate-50 border-dashed border-slate-300 text-slate-500' },
];

const threatNodeTypes = [
  { type: 'asset', label: 'Asset', icon: <Coins size={18} />, color: 'bg-amber-100 border-amber-500 text-amber-800' },
  { type: 'threat', label: 'Threat', icon: <AlertTriangle size={18} />, color: 'bg-red-100 border-red-500 text-red-800' },
  { type: 'control', label: 'Control', icon: <ShieldCheck size={18} />, color: 'bg-emerald-100 border-emerald-500 text-emerald-800' },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r bg-white p-4 flex flex-col gap-6 shadow-sm z-10">
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">C4 Model Elements</div>
        <div className="flex flex-col gap-2">
          {c4NodeTypes.map((node) => (
            <div
              key={node.type}
              className={`flex items-center gap-3 p-3 rounded-md cursor-grab active:cursor-grabbing text-xs font-medium transition-all hover:ring-2 hover:ring-slate-200 ${
                node.type === 'boundary' ? 'bg-gray-50 border-2 border-dashed border-gray-300' : `${node.color} text-white shadow-sm`
              }`}
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
            >
              {node.icon}
              {node.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Threat Modeling</div>
        <div className="flex flex-col gap-2">
          {threatNodeTypes.map((node) => (
            <div
              key={node.type}
              className={`flex items-center gap-3 p-3 rounded-md cursor-grab active:cursor-grabbing text-xs font-medium transition-all border shadow-sm hover:ring-2 hover:ring-gray-200 ${node.color}`}
              onDragStart={(event) => onDragStart(event, node.type)}
              draggable
            >
              {node.icon}
              {node.label}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto text-[10px] text-gray-400 text-center italic leading-tight">
        Drag elements to add.<br/>Drop on nodes to attach.
      </div>
    </aside>
  );
}
