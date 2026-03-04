import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function ContainerNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={`px-4 py-4 shadow-xl rounded-md bg-[#438dd5] border-2 text-white min-w-[180px] text-center transition-all ${selected ? 'border-blue-300 ring-4 ring-blue-300/30 shadow-blue-300/20' : 'border-[#3c7ebe]'}`}>
      <div className="font-bold text-base leading-tight">{data.label}</div>
      <div className="text-[10px] opacity-90 mt-1 uppercase tracking-wider font-semibold">[Container: {data.technology || 'Technology'}]</div>
      {data.description && (
        <div className="text-[11px] mt-3 border-t border-white/20 pt-2 opacity-80">{data.description}</div>
      )}

      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-100" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-blue-100" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-blue-100" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-100" />
    </div>
  );
}
