import { Handle, Position, NodeResizer } from '@xyflow/react';

export function SoftwareSystemNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={`w-full h-full px-4 py-4 shadow-xl rounded-md bg-slate-600 border-2 text-white min-w-[180px] min-h-[100px] text-center transition-all ${selected ? 'border-slate-300 ring-4 ring-slate-300/30 shadow-slate-300/20' : 'border-slate-700'}`}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={180} 
        minHeight={100} 
        lineClassName="border-slate-300"
        handleClassName="w-3 h-3 bg-white border-2 border-slate-300 rounded-sm"
      />
      
      <div className="font-bold text-base leading-tight">{data.label}</div>
      <div className="text-[10px] opacity-90 mt-1 uppercase tracking-wider font-semibold">[Software System]</div>
      {data.description && (
        <div className="text-[11px] mt-3 border-t border-white/20 pt-2 opacity-80">{data.description}</div>
      )}

      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-200" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-200" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-slate-200" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-200" />
    </div>
  );
}
