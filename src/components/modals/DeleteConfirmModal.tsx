import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useWorkflow } from '../../context/WorkflowContext';
import { useWorkflowsList } from '../../context/WorkflowsListContext';
import toast from 'react-hot-toast';

export function DeleteConfirmModal() {
    const { isDeleteModalOpen, setIsDeleteModalOpen, deleteTarget, setDeleteTarget } = useUI();
    const { deleteNode, clearWorkflow, currentWorkflow } = useWorkflow();
    const { deleteWorkflow } = useWorkflowsList();

    if (!isDeleteModalOpen || !deleteTarget) {
        return null;
    }

    const handleClose = () => {
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
    };

    const handleConfirm = () => {
        if (deleteTarget.type === 'node') {
            deleteNode(deleteTarget.id);
            toast.success(`Node "${deleteTarget.name}" deleted`);
        } else if (deleteTarget.type === 'workflow') {
            deleteWorkflow(deleteTarget.id);
            if (currentWorkflow?.id === deleteTarget.id) {
                clearWorkflow();
            }
            toast.success(`Workflow "${deleteTarget.name}" deleted`);
        }
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
                        <div className="bg-red-500/20 rounded-2xl" style={{ padding: '12px' }}>
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
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
                    <p className="text-slate-300 text-lg">
                        Are you sure you want to delete the {deleteTarget.type}{' '}
                        <span className="font-bold text-white">"{deleteTarget.name}"</span>?
                    </p>
                    <p className="text-sm text-slate-500" style={{ marginTop: '12px' }}>
                        This action cannot be undone.
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
                        onClick={handleConfirm}
                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-2xl transition-all duration-200 shadow-lg shadow-red-500/30 font-semibold"
                        style={{ padding: '12px 24px' }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
