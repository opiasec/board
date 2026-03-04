import { Handle, Position } from '@xyflow/react';
import { ShieldCheck } from 'lucide-react';

export function ControlNode({ data, selected }: { data: any, selected: boolean }) {
  return (
    <div className={`group flex items-center bg-emerald-100 border text-emerald-800 rounded-full p-1.5 transition-all duration-300 ease-in-out max-w-[32px] hover:max-w-[200px] shadow-sm overflow-hidden whitespace-nowrap cursor-pointer hover:shadow-md ${selected ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-emerald-500'}`}>
      <ShieldCheck size={16} className="flex-shrink-0" />
      <span className="ml-2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {data.label}
      </span>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}
