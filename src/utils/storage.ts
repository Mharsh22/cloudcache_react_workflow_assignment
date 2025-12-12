import { SavedWorkflow } from '../types';

const STORAGE_KEY = 'workflow-builder-workflows';

/**
 * Get all saved workflows from localStorage
 */
export function getWorkflows(): SavedWorkflow[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading workflows from storage:', error);
        return [];
    }
}

/**
 * Save a workflow to localStorage
 */
export function saveWorkflow(workflow: SavedWorkflow): void {
    try {
        const workflows = getWorkflows();
        const existingIndex = workflows.findIndex(w => w.id === workflow.id);

        if (existingIndex >= 0) {
            workflows[existingIndex] = { ...workflow, updatedAt: new Date().toISOString() };
        } else {
            workflows.push(workflow);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    } catch (error) {
        console.error('Error saving workflow to storage:', error);
        throw new Error('Failed to save workflow');
    }
}

/**
 * Delete a workflow from localStorage
 */
export function deleteWorkflow(workflowId: string): void {
    try {
        const workflows = getWorkflows();
        const filtered = workflows.filter(w => w.id !== workflowId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error deleting workflow from storage:', error);
        throw new Error('Failed to delete workflow');
    }
}

/**
 * Get a single workflow by ID
 */
export function getWorkflowById(workflowId: string): SavedWorkflow | null {
    const workflows = getWorkflows();
    return workflows.find(w => w.id === workflowId) || null;
}

/**
 * Export workflow as JSON file
 */
export function exportWorkflowAsJson(workflow: SavedWorkflow): void {
    const data = {
        name: workflow.name,
        nodes: workflow.nodes,
        edges: workflow.edges,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
