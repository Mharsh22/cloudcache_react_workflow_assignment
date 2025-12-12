import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useWorkflow } from '../../context/WorkflowContext';
import { useWorkflowsList } from '../../context/WorkflowsListContext';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export function SaveWorkflowModal() {
    const { isSaveModalOpen, setIsSaveModalOpen } = useUI();
    const { nodes, edges, currentWorkflow, setCurrentWorkflow } = useWorkflow();
    const { saveWorkflow } = useWorkflowsList();
    const [workflowName, setWorkflowName] = useState('');

    useEffect(() => {
        if (isSaveModalOpen && currentWorkflow) {
            setWorkflowName(currentWorkflow.name);
        } else if (isSaveModalOpen) {
            setWorkflowName('');
        }
    }, [isSaveModalOpen, currentWorkflow]);

    if (!isSaveModalOpen) {
        return null;
    }

    const handleClose = () => {
        setIsSaveModalOpen(false);
        setWorkflowName('');
    };

    const handleSave = () => {
        if (!workflowName.trim()) {
            toast.error('Please enter a workflow name');
            return;
        }

        const workflow = {
            id: currentWorkflow?.id || uuidv4(),
            name: workflowName.trim(),
            nodes,
            edges,
            createdAt: currentWorkflow?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        saveWorkflow(workflow);
        setCurrentWorkflow(workflow);
        toast.success(currentWorkflow ? 'Workflow updated successfully!' : 'Workflow saved successfully!');
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ padding: '16px' }}>
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative bg-slate-900 border-2 border-slate-700 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in">
                <div
                    className="flex items-center justify-between border-b border-slate-700/50"
                    style={{ padding: '20px 24px' }}
                >
                    <div className="flex items-center" style={{ gap: '16px' }}>
                        <div className="bg-indigo-500/20 rounded-2xl" style={{ padding: '12px' }}>
                            <Save className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            {currentWorkflow ? 'Update Workflow' : 'Save Workflow'}
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="hover:bg-slate-800 rounded-xl transition-colors"
                        style={{ padding: '8px' }}
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div style={{ padding: '24px' }}>
                    <label className="block text-sm font-semibold text-slate-300" style={{ marginBottom: '12px' }}>
                        Workflow Name
                    </label>
                    <input
                        type="text"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        placeholder="Enter workflow name..."
                        autoFocus
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
                        style={{ padding: '16px 20px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }}
                    />
                    <p className="text-sm text-slate-500" style={{ marginTop: '12px' }}>
                        {nodes.length} nodes • {edges.length} connections
                    </p>
                </div>

                <div
                    className="flex items-center justify-end border-t border-slate-700/50"
                    style={{ padding: '20px 24px', gap: '16px' }}
                >
                    <button
                        onClick={handleClose}
                        className="bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all duration-200 border-2 border-slate-600 hover:border-slate-500 font-semibold"
                        style={{ padding: '12px 24px' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/30 font-semibold"
                        style={{ padding: '12px 24px' }}
                    >
                        {currentWorkflow ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
