import React, { useState, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { X, Trash2, Link as LinkIcon } from 'lucide-react';

interface EditPanelProps {
  selectedElement: Node | Edge | null;
  onUpdate: (id: string, data: any, isEdge?: boolean) => void;
  onDelete: (id: string, isEdge?: boolean) => void;
  onClose: () => void;
}

export function EditPanel({ selectedElement, onUpdate, onDelete, onClose }: EditPanelProps) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [technology, setTechnology] = useState('');

  const isEdge = selectedElement && 'source' in selectedElement;

  useEffect(() => {
    if (selectedElement) {
      if (isEdge) {
        setLabel((selectedElement as Edge).label as string || '');
      } else {
        const node = selectedElement as Node;
        setLabel(node.data.label as string || '');
        setDescription(node.data.description as string || '');
        setTechnology(node.data.technology as string || '');
      }
    }
  }, [selectedElement, isEdge]);

  if (!selectedElement) return null;

  const handleSave = () => {
    if (isEdge) {
      onUpdate(selectedElement.id, { label }, true);
    } else {
      onUpdate(selectedElement.id, {
        ...selectedElement.data,
        label,
        description,
        technology,
      });
    }
  };

  return (
    <div className="w-80 border-l bg-white p-6 flex flex-col gap-6 shadow-lg z-10 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest flex items-center gap-2">
          {isEdge ? <LinkIcon size={14} /> : null}
          Edit {isEdge ? 'Relationship' : (selectedElement as Node).type}
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">
            {isEdge ? 'Description of Relationship' : 'Label'}
          </label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder={isEdge ? 'e.g. Uses, Sends data via, etc.' : ''}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>

        {!isEdge && (
          <>
            {(selectedElement as Node).type === 'container' && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Technology</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. React, Docker, SQL"
                  value={technology}
                  onChange={(e) => setTechnology(e.target.value)}
                  onBlur={handleSave}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <textarea
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => onDelete(selectedElement.id, !!isEdge)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} />
          Delete {isEdge ? 'Link' : ''}
        </button>
      </div>
    </div>
  );
}
