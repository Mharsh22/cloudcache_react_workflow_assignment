# React Automation Workflow Builder

A **visual automation workflow builder** (similar to Zapier / Make.com) built with **React + React Flow + TypeScript + Vite**.

Users can **create, connect, configure, validate, save, edit, delete, and export** workflows visually.

---

## Features

### Workflow Canvas (React Flow)
- Drag & drop nodes onto the canvas
- Visual connection of nodes with edges
- Zoom & pan support
- Custom node components with:
  - Icon
  - Title
  - Edit button
  - Delete button

### Node Types
| Node Type | Description |
|-----------|-------------|
| **Start Trigger** | Entry point (only one allowed per workflow) |
| **Condition** | Conditional logic node |
| **Wait Timer** | Delay/timer node |
| **Send Message** | Action to send a message |
| **Follow User** | Action to follow a user |

### Sidebar (Left Panel)
Provides **draggable predefined nodes**:
- Condition
- Send Message
- Follow User
- Wait Timer

### Configuration Panel (Right Panel)
- Opens when a node is selected
- Shows fields depending on node type
- Supports real-time validation
- Auto-save functionality

---

## Workflow Rules

### Allowed
- Exactly **one Start Trigger** per workflow
- **Linear workflows only** (max 1 incoming + 1 outgoing edge per node)
- All nodes must be **connected** (no isolated nodes)

### Not Allowed
- Branching (multiple outgoing edges)
- Loops / cycles
- Multiple outgoing edges from any node

> **Note:** Invalid actions trigger a toast notification.

---

## CRUD Operations

| Operation | Description |
|-----------|-------------|
| **Create** | Build workflow visually on the canvas |
| **Read** | Display list of saved workflows |
| **Update** | Open, edit nodes/config/connections, and save |
| **Delete** | Remove workflow (with confirmation modal) |

---

## Save & Export

- **Validation** before saving (workflow must pass all rules)
- **Storage**: LocalStorage or IndexedDB
- **Export**: Download workflow as a JSON file

### Sample Export JSON
```json
{
  "name": "My First Automation",
  "nodes": [],
  "edges": []
}
```

---

## Tech Stack

| Technology | Version |
|------------|---------|
| React | 18+ |
| React Flow | 11+ |
| TypeScript | Recommended |
| TailwindCSS | Recommended |
| State Management | Zustand / Context / Jotai |
| Build Tool | Vite |

---

## UI/UX Requirements

- Modern, clean UI
- Responsive layout
- Smooth animations
- Proper empty & error states

---

## Evaluation Criteria

| Category | Weight |
|----------|--------|
| UI Quality | 20% |
| Functionality | 25% |
| Workflow Logic & Validation | 20% |
| Code Structure | 15% |
| State Management | 10% |
| React Flow Implementation | 10% |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## License

This project is for demonstration/assignment purposes.
