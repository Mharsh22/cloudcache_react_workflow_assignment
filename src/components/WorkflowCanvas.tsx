import React, { useCallback, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflow } from '../context/WorkflowContext';
import { useUI } from '../context/UIContext';
import { NodeType, WorkflowNode } from '../types';
import {
    StartTriggerNode,
    ConditionNode,
    WaitTimerNode,
    SendMessageNode,
    FollowUserNode,
} from './nodes';

const nodeTypes = {
    [NodeType.START_TRIGGER]: StartTriggerNode,
    [NodeType.CONDITION]: ConditionNode,
    [NodeType.WAIT_TIMER]: WaitTimerNode,
    [NodeType.SEND_MESSAGE]: SendMessageNode,
    [NodeType.FOLLOW_USER]: FollowUserNode,
};

function WorkflowCanvasInner() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { screenToFlowPosition } = useReactFlow();
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
    } = useWorkflow();
    const { setSelectedNode, setIsConfigPanelOpen } = useUI();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow') as NodeType;

            if (!type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            addNode(type, position);
        },
        [screenToFlowPosition, addNode]
    );

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: WorkflowNode) => {
            setSelectedNode(node);
            setIsConfigPanelOpen(true);
        },
        [setSelectedNode, setIsConfigPanelOpen]
    );

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
        setIsConfigPanelOpen(false);
    }, [setSelectedNode, setIsConfigPanelOpen]);

    return (
        <div ref={reactFlowWrapper} className="flex-1 h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                defaultViewport={{ x: 200, y: 100, zoom: 0.5 }}
                snapToGrid
                snapGrid={[15, 15]}
                defaultEdgeOptions={{
                    animated: true,
                    style: { stroke: '#6366f1', strokeWidth: 2 },
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background
                    color="#334155"
                    gap={20}
                    size={1}
                />
                <Controls
                    className="!bg-slate-800 !border-slate-700 !rounded-xl !shadow-xl"
                    showInteractive={false}
                />
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case NodeType.START_TRIGGER:
                                return '#10b981';
                            case NodeType.CONDITION:
                                return '#f59e0b';
                            case NodeType.WAIT_TIMER:
                                return '#06b6d4';
                            case NodeType.SEND_MESSAGE:
                                return '#a855f7';
                            case NodeType.FOLLOW_USER:
                                return '#6366f1';
                            default:
                                return '#64748b';
                        }
                    }}
                    maskColor="rgba(15, 23, 42, 0.8)"
                    className="!bg-slate-800 !border-slate-700 !rounded-xl"
                />
            </ReactFlow>
        </div>
    );
}

export function WorkflowCanvas() {
    return (
        <ReactFlowProvider>
            <WorkflowCanvasInner />
        </ReactFlowProvider>
    );
}
