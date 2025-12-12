import React from 'react';
import {
    Plus,
    GitBranch,
    MessageSquare,
    UserPlus,
    Clock,
    FolderOpen,
    Trash2,
    Workflow,
} from 'lucide-react';
import { NodeType, SavedWorkflow } from '../types';
import { useWorkflow } from '../context/WorkflowContext';
import { useWorkflowsList } from '../context/WorkflowsListContext';
import { useUI } from '../context/UIContext';

const nodeItems = [
    { type: NodeType.CONDITION, label: 'Condition', icon: GitBranch, color: 'from-amber-500 to-orange-600', desc: 'Add logic branch' },
    { type: NodeType.SEND_MESSAGE, label: 'Send Message', icon: MessageSquare, color: 'from-purple-500 to-pink-600', desc: 'Send a message' },
    { type: NodeType.FOLLOW_USER, label: 'Follow User', icon: UserPlus, color: 'from-indigo-500 to-violet-600', desc: 'Follow a user' },
    { type: NodeType.WAIT_TIMER, label: 'Wait Timer', icon: Clock, color: 'from-cyan-500 to-blue-600', desc: 'Add delay' },
];

export function Sidebar() {
    const { loadWorkflow, clearWorkflow, currentWorkflow } = useWorkflow();
    const { workflows } = useWorkflowsList();
    const { setDeleteTarget, setIsDeleteModalOpen } = useUI();

    const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleLoadWorkflow = (workflow: SavedWorkflow) => {
        loadWorkflow(workflow);
    };

    const handleDeleteWorkflow = (e: React.MouseEvent, workflow: SavedWorkflow) => {
        e.stopPropagation();
        setDeleteTarget({ type: 'workflow', id: workflow.id, name: workflow.name });
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="w-80 h-full bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 flex flex-col overflow-hidden">
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <div className="flex items-center" style={{ gap: '16px' }}>
                    <div
                        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30"
                        style={{ padding: '12px' }}
                    >
                        <Workflow className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Flow Builder</h1>
                        <p className="text-sm text-slate-400" style={{ marginTop: '4px' }}>Visual Automation</p>
                    </div>
                </div>
            </div>

            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ marginBottom: '16px' }}>
                    Drag & Drop Nodes
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {nodeItems.map((item) => (
                        <div
                            key={item.type}
                            draggable
                            onDragStart={(e) => onDragStart(e, item.type)}
                            className={`node-draggable flex items-center bg-gradient-to-r ${item.color} shadow-lg`}
                            style={{ gap: '16px' }}
                        >
                            <div className="bg-white/20 rounded-xl" style={{ padding: '10px' }}>
                                <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <span className="text-white font-semibold text-sm block">{item.label}</span>
                                <span className="text-white/70 text-xs block" style={{ marginTop: '2px' }}>{item.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {currentWorkflow && (
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ marginBottom: '12px' }}>
                        Current Workflow
                    </h2>
                    <div className="flex items-center justify-between bg-slate-800/80 rounded-2xl border border-slate-700/50" style={{ padding: '16px' }}>
                        <span className="text-white font-medium truncate">{currentWorkflow.name}</span>
                        <button
                            onClick={clearWorkflow}
                            style={{ padding: '8px 16px' }}
                            className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all"
                        >
                            New
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Saved Workflows
                    </h2>
                    <FolderOpen className="w-4 h-4 text-slate-500" />
                </div>

                {workflows.length === 0 ? (
                    <div className="text-center" style={{ padding: '40px 0' }}>
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center border border-slate-700/50" style={{ marginBottom: '16px' }}>
                            <Plus className="w-7 h-7 text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-400 font-medium">No workflows saved yet</p>
                        <p className="text-xs text-slate-500" style={{ marginTop: '8px' }}>Create and save your first workflow</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {workflows.map((workflow) => (
                            <div
                                key={workflow.id}
                                onClick={() => handleLoadWorkflow(workflow)}
                                className={`workflow-item group flex items-center justify-between cursor-pointer ${currentWorkflow?.id === workflow.id
                                    ? 'bg-indigo-600/20 border-2 border-indigo-500/50'
                                    : 'bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600/50'
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium text-sm truncate">{workflow.name}</p>
                                    <p className="text-xs text-slate-500" style={{ marginTop: '6px' }}>
                                        {workflow.nodes.length} nodes • {new Date(workflow.updatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteWorkflow(e, workflow)}
                                    className="opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded-xl transition-all"
                                    style={{ padding: '10px', marginLeft: '12px' }}
                                >
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(51, 65, 85, 0.5)' }}>
                <button
                    onClick={clearWorkflow}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl text-white font-semibold transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                    style={{ padding: '16px', gap: '12px' }}
                >
                    <Plus className="w-5 h-5" />
                    New Workflow
                </button>
            </div>
        </div>
    );
}
