import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { AlertTriangle } from 'lucide-react';

export function ThreatNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={`group flex items-center bg-red-100 border text-red-800 rounded-full p-1.5 transition-all duration-300 ease-in-out max-w-[32px] hover:max-w-[200px] shadow-sm overflow-hidden whitespace-nowrap cursor-pointer hover:shadow-md ${selected ? 'border-red-600 ring-2 ring-red-400' : 'border-red-500'}`}>
      <AlertTriangle size={16} className="flex-shrink-0" />
      <span className="ml-2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {data.label}
      </span>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
