import React, { useEffect, useState } from 'react';
import { X, Settings } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useWorkflow } from '../context/WorkflowContext';
import { NodeType } from '../types';

export function ConfigPanel() {
    const { selectedNode, isConfigPanelOpen, setIsConfigPanelOpen, setSelectedNode } = useUI();
    const { updateNodeData, nodes } = useWorkflow();

    const [formData, setFormData] = useState<Record<string, unknown>>({});

    useEffect(() => {
        if (selectedNode) {
            const node = nodes.find(n => n.id === selectedNode.id);
            if (node) {
                setFormData({ ...node.data });
            }
        }
    }, [selectedNode, nodes]);

    useEffect(() => {
        if (selectedNode && Object.keys(formData).length > 0) {
            const timeoutId = setTimeout(() => {
                updateNodeData(selectedNode.id, formData);
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [formData, selectedNode, updateNodeData]);

    const handleClose = () => {
        setIsConfigPanelOpen(false);
        setSelectedNode(null);
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (!isConfigPanelOpen || !selectedNode) {
        return null;
    }

    const inputStyle = { padding: '16px 20px' };
    const labelStyle = { marginBottom: '12px' };

    const renderFields = () => {
        switch (selectedNode.type) {
            case NodeType.START_TRIGGER:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                                Trigger Type
                            </label>
                            <select
                                value={(formData.triggerType as string) || 'manual'}
                                onChange={(e) => handleInputChange('triggerType', e.target.value)}
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                style={inputStyle}
                            >
                                <option value="manual">Manual Trigger</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="webhook">Webhook</option>
                                <option value="event">Event Based</option>
                            </select>
                        </div>
                    </div>
                );

            case NodeType.SEND_MESSAGE:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                                Username <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={(formData.username as string) || ''}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                placeholder="@username"
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                                Message <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={(formData.message as string) || ''}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                placeholder="Enter your message..."
                                rows={4}
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                );

            case NodeType.CONDITION:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                                Condition Type
                            </label>
                            <select
                                value={(formData.conditionType as string) || ''}
                                onChange={(e) => handleInputChange('conditionType', e.target.value)}
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                style={inputStyle}
                            >
                                <option value="">Select condition...</option>
                                <option value="user_follows">User Follows</option>
                                <option value="message_contains">Message Contains</option>
                                <option value="time_passed">Time Passed</option>
                                <option value="user_replied">User Replied</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                                Condition Value
                            </label>
                            <input
                                type="text"
                                value={(formData.conditionValue as string) || ''}
                                onChange={(e) => handleInputChange('conditionValue', e.target.value)}
                                placeholder="Enter value..."
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                );

            case NodeType.WAIT_TIMER:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                                    Hours
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="168"
                                    value={(formData.hours as number) || 0}
                                    onChange={(e) => handleInputChange('hours', parseInt(e.target.value) || 0)}
                                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                                    Minutes
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={(formData.minutes as number) || 0}
                                    onChange={(e) => handleInputChange('minutes', parseInt(e.target.value) || 0)}
                                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50" style={{ padding: '16px' }}>
                            <p className="text-sm text-slate-400">
                                Total wait time: <span className="text-white font-semibold">{(formData.hours as number) || 0}h {(formData.minutes as number) || 0}m</span>
                            </p>
                        </div>
                    </div>
                );

            case NodeType.FOLLOW_USER:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                                Username <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={(formData.username as string) || ''}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                placeholder="@username"
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <p className="text-slate-400 text-sm">No configuration available for this node.</p>
                );
        }
    };

    const getNodeTitle = () => {
        switch (selectedNode.type) {
            case NodeType.START_TRIGGER:
                return 'Start Trigger';
            case NodeType.SEND_MESSAGE:
                return 'Send Message';
            case NodeType.CONDITION:
                return 'Condition';
            case NodeType.WAIT_TIMER:
                return 'Wait Timer';
            case NodeType.FOLLOW_USER:
                return 'Follow User';
            default:
                return 'Node Configuration';
        }
    };

    return (
        <div className="w-96 h-full bg-slate-900/95 backdrop-blur-sm border-l border-slate-700/50 flex flex-col animate-slide-in">
            <div
                className="flex items-center justify-between border-b border-slate-700/50"
                style={{ padding: '20px 24px' }}
            >
                <div className="flex items-center" style={{ gap: '16px' }}>
                    <div className="bg-indigo-600/20 rounded-2xl" style={{ padding: '12px' }}>
                        <Settings className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg">{getNodeTitle()}</h2>
                        <p className="text-sm text-slate-500">Configure settings</p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="hover:bg-slate-800 rounded-xl transition-colors"
                    style={{ padding: '12px' }}
                >
                    <X className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <label className="block text-sm font-semibold text-slate-300" style={labelStyle}>
                        Node Label
                    </label>
                    <input
                        type="text"
                        value={(formData.label as string) || ''}
                        onChange={(e) => handleInputChange('label', e.target.value)}
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        style={inputStyle}
                    />
                </div>

                <div className="border-t border-slate-700/50" style={{ paddingTop: '32px' }}>
                    {renderFields()}
                </div>
            </div>

            <div
                className="border-t border-slate-700/50"
                style={{ padding: '20px 24px' }}
            >
                <div
                    className="flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
                    style={{ padding: '16px', gap: '8px' }}
                >
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <p className="text-sm text-emerald-400 font-medium">
                        Changes saved automatically
                    </p>
                </div>
            </div>
        </div>
    );
}
