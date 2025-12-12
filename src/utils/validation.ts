import { WorkflowNode, WorkflowEdge, NodeType, ValidationResult } from '../types';

/**
 * Validates that there is exactly one Start Trigger node
 */
export function validateSingleStartTrigger(nodes: WorkflowNode[]): ValidationResult {
    const startNodes = nodes.filter(node => node.type === NodeType.START_TRIGGER);

    if (startNodes.length === 0) {
        return { isValid: false, errors: ['Workflow must have a Start Trigger node'] };
    }

    if (startNodes.length > 1) {
        return { isValid: false, errors: ['Workflow can only have one Start Trigger node'] };
    }

    return { isValid: true, errors: [] };
}

/**
 * Validates that workflow is linear (max 1 incoming + 1 outgoing edge per node)
 */
export function validateLinearWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult {
    const errors: string[] = [];

    for (const node of nodes) {
        const incomingEdges = edges.filter(edge => edge.target === node.id);
        const outgoingEdges = edges.filter(edge => edge.source === node.id);

        if (incomingEdges.length > 1) {
            errors.push(`Node "${node.data.label}" has multiple incoming connections`);
        }

        if (outgoingEdges.length > 1) {
            errors.push(`Node "${node.data.label}" has multiple outgoing connections`);
        }
    }

    return { isValid: errors.length === 0, errors };
}

/**
 * Validates that there are no loops/cycles in the workflow
 */
export function validateNoCycles(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const adjacencyList = new Map<string, string[]>();
    nodes.forEach(node => adjacencyList.set(node.id, []));
    edges.forEach(edge => {
        const neighbors = adjacencyList.get(edge.source) || [];
        neighbors.push(edge.target);
        adjacencyList.set(edge.source, neighbors);
    });

    function hasCycle(nodeId: string): boolean {
        visited.add(nodeId);
        recursionStack.add(nodeId);

        const neighbors = adjacencyList.get(nodeId) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                if (hasCycle(neighbor)) return true;
            } else if (recursionStack.has(neighbor)) {
                return true;
            }
        }

        recursionStack.delete(nodeId);
        return false;
    }

    for (const node of nodes) {
        if (!visited.has(node.id)) {
            if (hasCycle(node.id)) {
                return { isValid: false, errors: ['Workflow contains a cycle/loop which is not allowed'] };
            }
        }
    }

    return { isValid: true, errors: [] };
}

/**
 * Validates that all nodes are connected (no isolated nodes)
 */
export function validateAllNodesConnected(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult {
    if (nodes.length === 0) {
        return { isValid: false, errors: ['Workflow must have at least one node'] };
    }

    if (nodes.length === 1) {
        return { isValid: true, errors: [] };
    }

    const connectedNodes = new Set<string>();
    edges.forEach(edge => {
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
    });

    const isolatedNodes = nodes.filter(node => !connectedNodes.has(node.id));

    if (isolatedNodes.length > 0) {
        const nodeNames = isolatedNodes.map(n => `"${n.data.label}"`).join(', ');
        return {
            isValid: false,
            errors: [`Isolated nodes found: ${nodeNames}. All nodes must be connected.`]
        };
    }

    return { isValid: true, errors: [] };
}

/**
 * Validates node-specific fields
 */
export function validateNodeFields(node: WorkflowNode): ValidationResult {
    const errors: string[] = [];
    const data = node.data;

    switch (node.type) {
        case NodeType.SEND_MESSAGE:
            if (!('username' in data) || !(data as { username: string }).username?.trim()) {
                errors.push('Username is required for Send Message node');
            }
            if (!('message' in data) || !(data as { message: string }).message?.trim()) {
                errors.push('Message is required for Send Message node');
            }
            break;
        case NodeType.CONDITION:
            if (!('conditionType' in data) || !(data as { conditionType: string }).conditionType) {
                errors.push('Condition type is required');
            }
            break;
        case NodeType.FOLLOW_USER:
            if (!('username' in data) || !(data as { username: string }).username?.trim()) {
                errors.push('Username is required for Follow User node');
            }
            break;
    }

    return { isValid: errors.length === 0, errors };
}

/**
 * Validates the entire workflow
 */
export function validateWorkflow(nodes: WorkflowNode[], edges: WorkflowEdge[]): ValidationResult {
    const allErrors: string[] = [];

    const startTriggerResult = validateSingleStartTrigger(nodes);
    allErrors.push(...startTriggerResult.errors);

    const linearResult = validateLinearWorkflow(nodes, edges);
    allErrors.push(...linearResult.errors);

    const cycleResult = validateNoCycles(nodes, edges);
    allErrors.push(...cycleResult.errors);

    const connectedResult = validateAllNodesConnected(nodes, edges);
    allErrors.push(...connectedResult.errors);

    for (const node of nodes) {
        const nodeResult = validateNodeFields(node);
        allErrors.push(...nodeResult.errors);
    }

    return { isValid: allErrors.length === 0, errors: allErrors };
}

/**
 * Check if a new connection would create an invalid state
 */
export function canConnect(
    sourceId: string,
    targetId: string,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[]
): ValidationResult {
    const errors: string[] = [];

    const sourceOutgoing = edges.filter(e => e.source === sourceId);
    if (sourceOutgoing.length >= 1) {
        errors.push('Each node can only have one outgoing connection');
    }

    const targetIncoming = edges.filter(e => e.target === targetId);
    if (targetIncoming.length >= 1) {
        errors.push('Each node can only have one incoming connection');
    }

    const tempEdges = [...edges, { id: 'temp', source: sourceId, target: targetId }];
    const cycleResult = validateNoCycles(nodes, tempEdges);
    if (!cycleResult.isValid) {
        errors.push('This connection would create a loop');
    }

    return { isValid: errors.length === 0, errors };
}
