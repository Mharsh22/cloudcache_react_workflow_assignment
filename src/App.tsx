import React from 'react';
import { Toaster } from 'react-hot-toast';
import { WorkflowProvider } from './context/WorkflowContext';
import { UIProvider } from './context/UIContext';
import { WorkflowsListProvider } from './context/WorkflowsListContext';
import { Sidebar } from './components/Sidebar';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { ConfigPanel } from './components/ConfigPanel';
import { Toolbar } from './components/Toolbar';
import { DeleteConfirmModal, SaveWorkflowModal } from './components/modals';

function App() {
  return (
    <WorkflowsListProvider>
      <WorkflowProvider>
        <UIProvider>
          <div className="h-screen w-screen flex overflow-hidden bg-slate-950">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '12px 16px',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#f1f5f9',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#f1f5f9',
                  },
                },
              }}
            />

            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
              <Toolbar />

              <div className="flex-1 flex overflow-hidden">
                <WorkflowCanvas />
                <ConfigPanel />
              </div>
            </div>

            <DeleteConfirmModal />
            <SaveWorkflowModal />
          </div>
        </UIProvider>
      </WorkflowProvider>
    </WorkflowsListProvider>
  );
}

export default App;
