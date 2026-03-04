import React from 'react';
import { NodeResizer } from '@xyflow/react';

export function BoundaryNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className="group relative w-full h-full min-w-[200px] min-h-[150px] border-2 border-dashed border-gray-400 bg-gray-50/5 rounded-lg pointer-events-none">
      <NodeResizer 
        isVisible={selected} 
        minWidth={200} 
        minHeight={150} 
        lineClassName="border-blue-400"
        handleClassName="w-3 h-3 bg-white border-2 border-blue-400 rounded-sm pointer-events-auto"
      />
      
      <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 border border-gray-300 rounded text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-auto">
        {data.label || 'Boundary'}
      </div>
    </div>
  );
}
