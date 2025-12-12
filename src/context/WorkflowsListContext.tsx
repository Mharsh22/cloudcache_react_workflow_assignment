/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SavedWorkflow } from '../types';
import { getWorkflows, saveWorkflow as saveToStorage, deleteWorkflow as deleteFromStorage } from '../utils/storage';

interface WorkflowsListContextType {
    workflows: SavedWorkflow[];
    refreshWorkflows: () => void;
    saveWorkflow: (workflow: SavedWorkflow) => void;
    deleteWorkflow: (workflowId: string) => void;
}

const WorkflowsListContext = createContext<WorkflowsListContextType | null>(null);

export function WorkflowsListProvider({ children }: { children: ReactNode }) {
    // Use lazy initialization to load workflows on mount
    const [workflows, setWorkflows] = useState<SavedWorkflow[]>(() => getWorkflows());

    const refreshWorkflows = () => {
        const saved = getWorkflows();
        setWorkflows(saved);
    };

    const saveWorkflow = (workflow: SavedWorkflow) => {
        saveToStorage(workflow);
        refreshWorkflows();
    };

    const deleteWorkflow = (workflowId: string) => {
        deleteFromStorage(workflowId);
        refreshWorkflows();
    };

    return (
        <WorkflowsListContext.Provider
            value={{
                workflows,
                refreshWorkflows,
                saveWorkflow,
                deleteWorkflow,
            }}
        >
            {children}
        </WorkflowsListContext.Provider>
    );
}

export function useWorkflowsList() {
    const context = useContext(WorkflowsListContext);
    if (!context) {
        throw new Error('useWorkflowsList must be used within a WorkflowsListProvider');
    }
    return context;
}
