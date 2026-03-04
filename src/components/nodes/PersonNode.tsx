import { Handle, Position, NodeResizer } from '@xyflow/react';
import { User } from 'lucide-react';

export function PersonNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={`w-full h-full px-4 py-3 shadow-lg rounded-md bg-slate-700 border-2 text-white min-w-[150px] min-h-[80px] text-center transition-all ${selected ? 'border-slate-400 ring-4 ring-slate-400/30 shadow-slate-400/20' : 'border-slate-800'}`}>
      <NodeResizer 
        isVisible={selected} 
        minWidth={150} 
        minHeight={80} 
        lineClassName="border-slate-400"
        handleClassName="w-3 h-3 bg-white border-2 border-slate-400 rounded-sm"
      />
      
      <div className="flex justify-center mb-1">
        <User size={20} />
      </div>
      <div className="font-bold text-sm">{data.label}</div>
      <div className="text-[10px] opacity-80 mt-1 uppercase tracking-wider font-semibold">[Person]</div>
      {data.description && (
        <div className="text-[10px] mt-2 border-t border-white/20 pt-1 italic">{data.description}</div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-300" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-300" />
    </div>
  );
}
