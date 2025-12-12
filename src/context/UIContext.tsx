/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkflowNode } from '../types';

interface UIContextType {
    selectedNode: WorkflowNode | null;
    setSelectedNode: (node: WorkflowNode | null) => void;
    isConfigPanelOpen: boolean;
    setIsConfigPanelOpen: (open: boolean) => void;
    isSaveModalOpen: boolean;
    setIsSaveModalOpen: (open: boolean) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
    deleteTarget: { type: 'node' | 'workflow'; id: string; name: string } | null;
    setDeleteTarget: (target: { type: 'node' | 'workflow'; id: string; name: string } | null) => void;
}

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
    const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'node' | 'workflow'; id: string; name: string } | null>(null);

    return (
        <UIContext.Provider
            value={{
                selectedNode,
                setSelectedNode,
                isConfigPanelOpen,
                setIsConfigPanelOpen,
                isSaveModalOpen,
                setIsSaveModalOpen,
                isDeleteModalOpen,
                setIsDeleteModalOpen,
                deleteTarget,
                setDeleteTarget,
            }}
        >
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
