import { NodeResizer } from '@xyflow/react';

export function BoundaryNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className="group relative w-full h-full min-w-[200px] min-h-[150px] border-2 border-dashed border-slate-300 bg-slate-50/5 rounded-lg pointer-events-none">
      <NodeResizer 
        isVisible={selected} 
        minWidth={200} 
        minHeight={150} 
        lineClassName="border-slate-400 pointer-events-auto"
        handleClassName="w-3 h-3 bg-white border-2 border-slate-400 rounded-sm pointer-events-auto"
      />
      
      <div className="absolute -top-3 left-4 bg-white px-2 py-0.5 border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-auto">
        {data.label || 'Boundary'}
      </div>
    </div>
  );
}
