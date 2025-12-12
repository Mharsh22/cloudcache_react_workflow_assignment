/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    Connection,
    NodeChange,
    EdgeChange,
} from '@xyflow/react';
import { WorkflowNode, WorkflowEdge, NodeType, SavedWorkflow } from '../types';
import { canConnect } from '../utils/validation';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface WorkflowContextType {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    currentWorkflow: SavedWorkflow | null;
    setCurrentWorkflow: (workflow: SavedWorkflow | null) => void;
    onNodesChange: (changes: NodeChange<WorkflowNode>[]) => void;
    onEdgesChange: (changes: EdgeChange<WorkflowEdge>[]) => void;
    onConnect: (connection: Connection) => void;
    addNode: (type: NodeType, position: { x: number; y: number }) => void;
    updateNodeData: (nodeId: string, data: Partial<WorkflowNode['data']>) => void;
    deleteNode: (nodeId: string) => void;
    clearWorkflow: () => void;
    loadWorkflow: (workflow: SavedWorkflow) => void;
    getWorkflowData: () => { nodes: WorkflowNode[]; edges: WorkflowEdge[] };
}

const WorkflowContext = createContext<WorkflowContextType | null>(null);

const initialStartNode: WorkflowNode = {
    id: 'start-1',
    type: NodeType.START_TRIGGER,
    position: { x: 250, y: 50 },
    data: { label: 'Start Trigger', triggerType: 'manual' },
};

export function WorkflowProvider({ children }: { children: ReactNode }) {
    const [nodes, setNodes] = useState<WorkflowNode[]>([initialStartNode]);
    const [edges, setEdges] = useState<WorkflowEdge[]>([]);
    const [currentWorkflow, setCurrentWorkflow] = useState<SavedWorkflow | null>(null);

    const onNodesChange = useCallback((changes: NodeChange<WorkflowNode>[]) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);

    const onEdgesChange = useCallback((changes: EdgeChange<WorkflowEdge>[]) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    const onConnect = useCallback(
        (connection: Connection) => {
            const validation = canConnect(connection.source!, connection.target!, nodes, edges);

            if (!validation.isValid) {
                validation.errors.forEach(error => toast.error(error));
                return;
            }

            setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
        },
        [nodes, edges]
    );

    const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
        if (type === NodeType.START_TRIGGER) {
            const hasStartTrigger = nodes.some(n => n.type === NodeType.START_TRIGGER);
            if (hasStartTrigger) {
                toast.error('Only one Start Trigger is allowed per workflow');
                return;
            }
        }

        const nodeId = uuidv4();
        const newNode: WorkflowNode = {
            id: nodeId,
            type,
            position,
            data: getDefaultNodeData(type),
        };

        setNodes((nds) => [...nds, newNode]);
    }, [nodes]);

    const updateNodeData = useCallback((nodeId: string, data: Partial<WorkflowNode['data']>) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
            )
        );
    }, []);

    const deleteNode = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    }, []);

    const clearWorkflow = useCallback(() => {
        setNodes([initialStartNode]);
        setEdges([]);
        setCurrentWorkflow(null);
    }, []);

    const loadWorkflow = useCallback((workflow: SavedWorkflow) => {
        setNodes(workflow.nodes);
        setEdges(workflow.edges);
        setCurrentWorkflow(workflow);
    }, []);

    const getWorkflowData = useCallback(() => {
        return { nodes, edges };
    }, [nodes, edges]);

    return (
        <WorkflowContext.Provider
            value={{
                nodes,
                edges,
                currentWorkflow,
                setCurrentWorkflow,
                onNodesChange,
                onEdgesChange,
                onConnect,
                addNode,
                updateNodeData,
                deleteNode,
                clearWorkflow,
                loadWorkflow,
                getWorkflowData,
            }}
        >
            {children}
        </WorkflowContext.Provider>
    );
}

export function useWorkflow() {
    const context = useContext(WorkflowContext);
    if (!context) {
        throw new Error('useWorkflow must be used within a WorkflowProvider');
    }
    return context;
}

function getDefaultNodeData(type: NodeType): WorkflowNode['data'] {
    switch (type) {
        case NodeType.START_TRIGGER:
            return { label: 'Start Trigger', triggerType: 'manual' };
        case NodeType.SEND_MESSAGE:
            return { label: 'Send Message', username: '', message: '' };
        case NodeType.CONDITION:
            return { label: 'Condition', conditionType: '', conditionValue: '' };
        case NodeType.WAIT_TIMER:
            return { label: 'Wait Timer', hours: 0, minutes: 0 };
        case NodeType.FOLLOW_USER:
            return { label: 'Follow User', username: '' };
        default:
            return { label: 'Unknown' };
    }
}
