import React from 'react';
import { Save, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';
import { useUI } from '../context/UIContext';
import { validateWorkflow } from '../utils/validation';
import { exportWorkflowAsJson } from '../utils/storage';
import toast from 'react-hot-toast';

export function Toolbar() {
    const { nodes, edges, currentWorkflow, getWorkflowData } = useWorkflow();
    const { setIsSaveModalOpen } = useUI();

    const validation = validateWorkflow(nodes, edges);

    const handleSave = () => {
        if (!validation.isValid) {
            validation.errors.forEach(error => toast.error(error));
            return;
        }
        setIsSaveModalOpen(true);
    };

    const handleExport = () => {
        if (!validation.isValid) {
            validation.errors.forEach(error => toast.error(error));
            return;
        }

        const { nodes, edges } = getWorkflowData();
        const workflow = {
            id: currentWorkflow?.id || 'export',
            name: currentWorkflow?.name || 'Exported Workflow',
            nodes,
            edges,
            createdAt: currentWorkflow?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        exportWorkflowAsJson(workflow);
        toast.success('Workflow exported successfully!');
    };

    return (
        <div
            className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between"
            style={{ padding: '20px 24px' }}
        >
            <div className="flex items-center" style={{ gap: '16px' }}>
                <div>
                    <h2 className="text-white font-bold text-lg">
                        {currentWorkflow?.name || 'Untitled Workflow'}
                    </h2>
                    <p className="text-sm text-slate-400" style={{ marginTop: '4px' }}>
                        {nodes.length} nodes • {edges.length} connections
                    </p>
                </div>
            </div>

            <div className="flex items-center" style={{ gap: '8px' }}>
                {validation.isValid ? (
                    <div
                        className="flex items-center bg-emerald-500/15 border-2 border-emerald-500/30 rounded-2xl"
                        style={{ gap: '12px', padding: '12px 20px' }}
                    >
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="text-sm text-emerald-400 font-semibold">Valid Workflow</span>
                    </div>
                ) : (
                    <div
                        className="flex items-center bg-amber-500/15 border-2 border-amber-500/30 rounded-2xl"
                        style={{ gap: '12px', padding: '12px 20px' }}
                    >
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        <span className="text-sm text-amber-400 font-semibold">
                            {validation.errors.length} issue{validation.errors.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center" style={{ gap: '16px' }}>
                <button
                    onClick={handleExport}
                    className="flex items-center bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all duration-200 border-2 border-slate-600 hover:border-slate-500 font-semibold shadow-lg"
                    style={{ gap: '12px', padding: '12px 20px' }}
                >
                    <Download className="w-5 h-5" />
                    <span>Export JSON</span>
                </button>
                <button
                    onClick={handleSave}
                    className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 font-semibold hover:-translate-y-0.5"
                    style={{ gap: '12px', padding: '12px 24px' }}
                >
                    <Save className="w-5 h-5" />
                    <span>Save Workflow</span>
                </button>
            </div>
        </div>
    );
}
