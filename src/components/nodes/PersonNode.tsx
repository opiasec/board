import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';

export function PersonNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={`px-4 py-3 shadow-lg rounded-md bg-[#08427b] border-2 text-white min-w-[150px] text-center transition-all ${selected ? 'border-blue-400 ring-4 ring-blue-400/30 shadow-blue-400/20' : 'border-[#073b6e]'}`}>
      <div className="flex justify-center mb-1">
        <User size={20} />
      </div>
      <div className="font-bold text-sm">{data.label}</div>
      <div className="text-[10px] opacity-80 mt-1 uppercase tracking-wider font-semibold">[Person]</div>
      {data.description && (
        <div className="text-[10px] mt-2 border-t border-white/20 pt-1 italic">{data.description}</div>
      )}
      
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-300" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-300" />
    </div>
  );
}
