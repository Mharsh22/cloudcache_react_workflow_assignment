import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Clock, Pencil, Trash2 } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useWorkflow } from '../../context/WorkflowContext';
import { WorkflowNode } from '../../types';

export function WaitTimerNode({ id, data, selected }: NodeProps) {
    const { setSelectedNode, setIsConfigPanelOpen, setDeleteTarget, setIsDeleteModalOpen } = useUI();
    const { nodes } = useWorkflow();

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        const node = nodes.find(n => n.id === id);
        if (node) {
            setSelectedNode(node as WorkflowNode);
            setIsConfigPanelOpen(true);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteTarget({ type: 'node', id, name: data.label as string });
        setIsDeleteModalOpen(true);
    };

    const hours = (data as { hours?: number }).hours || 0;
    const minutes = (data as { minutes?: number }).minutes || 0;
    const timeDisplay = hours > 0 || minutes > 0 ? `${hours}h ${minutes}m` : 'Not set';

    return (
        <div
            className={`group relative rounded-2xl min-w-[200px] transition-all duration-300 ${selected
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/40 scale-105'
                    : 'bg-gradient-to-br from-cyan-600 to-blue-700 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02]'
                }`}
            style={{ padding: '20px 24px' }}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="!w-4 !h-4 !bg-cyan-300 !border-[3px] !border-white !-top-2"
            />

            <div className="flex items-center" style={{ gap: '16px' }}>
                <div className="bg-white/20 rounded-xl backdrop-blur-sm" style={{ padding: '12px' }}>
                    <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-xs text-cyan-100 uppercase tracking-wider font-medium">Timer</p>
                    <p className="text-white font-bold text-lg">{data.label as string}</p>
                    <p className="text-sm text-cyan-200" style={{ marginTop: '4px' }}>{timeDisplay}</p>
                </div>
            </div>

            <div
                className="absolute flex opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{ top: '-12px', right: '-12px', gap: '8px' }}
            >
                <button
                    onClick={handleEdit}
                    className="bg-blue-500 rounded-xl hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/50"
                    style={{ padding: '8px' }}
                >
                    <Pencil className="w-4 h-4 text-white" />
                </button>
                <button
                    onClick={handleDelete}
                    className="bg-red-500 rounded-xl hover:bg-red-400 transition-colors shadow-lg shadow-red-500/50"
                    style={{ padding: '8px' }}
                >
                    <Trash2 className="w-4 h-4 text-white" />
                </button>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-4 !h-4 !bg-cyan-300 !border-[3px] !border-white !-bottom-2"
            />
        </div>
    );
}
