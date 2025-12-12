import { Node, Edge } from '@xyflow/react';

export interface BaseNodeData {
    label: string;
    [key: string]: unknown;
}

export interface SendMessageNodeData extends BaseNodeData {
    username: string;
    message: string;
}

export interface ConditionNodeData extends BaseNodeData {
    conditionType: string;
    conditionValue: string;
}

export interface WaitTimerNodeData extends BaseNodeData {
    hours: number;
    minutes: number;
}

export interface FollowUserNodeData extends BaseNodeData {
    username: string;
}

export interface StartTriggerNodeData extends BaseNodeData {
    triggerType: string;
}

export type WorkflowNodeData =
    | SendMessageNodeData
    | ConditionNodeData
    | WaitTimerNodeData
    | FollowUserNodeData
    | StartTriggerNodeData
    | BaseNodeData;

export enum NodeType {
    START_TRIGGER = 'startTrigger',
    CONDITION = 'condition',
    WAIT_TIMER = 'waitTimer',
    SEND_MESSAGE = 'sendMessage',
    FOLLOW_USER = 'followUser',
}

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface SavedWorkflow {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
    createdAt: string;
    updatedAt: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

export interface NodePaletteItem {
    type: NodeType;
    label: string;
    icon: string;
    description: string;
}
