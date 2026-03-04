# GEMINI.md

## Project Overview
**opiasec Board** is a simplified, web-based system modeling board designed for **C4 Architecture** and **Threat Modeling**. It allows security engineers and architects to diagram systems and map assets, threats, and security controls interactively.

The project is built with **React**, **TypeScript**, and **Vite**, utilizing **React Flow (@xyflow/react)** for the diagramming canvas and **Tailwind CSS** for styling.

### Core Technologies
-   **Frontend Framework:** React 18
-   **Build Tool:** Vite
-   **Language:** TypeScript
-   **Diagramming Library:** React Flow (@xyflow/react v12)
-   **State Management:** Zustand (Dependency present, but state currently managed in `App.tsx`)
-   **Icons:** Lucide React
-   **Styling:** Tailwind CSS

## Architecture and Key Files
-   `src/App.tsx`: The heart of the application. Manages the React Flow state (nodes/edges), history (undo/redo), local storage persistence, and the main layout.
-   `src/components/Sidebar.tsx`: Contains the list of draggable elements (C4 nodes and Threat Modeling badges).
-   `src/components/EditPanel.tsx`: A side panel that appears when a node or edge is selected, allowing users to modify labels, descriptions, and other metadata.
-   `src/components/nodes/`: Directory containing custom node implementations:
    -   `PersonNode`, `SoftwareSystemNode`, `ContainerNode`, `BoundaryNode` (C4 Model)
    -   `AssetNode`, `ThreatNode`, `ControlNode` (Threat Modeling)

## Building and Running

### Development
```bash
npm install
npm run dev
```
Starts the development server at `http://localhost:5173/`.

### Production
```bash
npm run build
```
Builds the application for production in the `dist/` folder.

### Linting
```bash
npm run lint
```
Runs ESLint to check for code quality and style issues.

## Development Conventions

-   **Functional Components:** Use React functional components with hooks.
-   **TypeScript:** Ensure all components and state objects are properly typed.
-   **Tailwind CSS:** Use Tailwind utility classes for styling. Avoid writing custom CSS in `App.css` unless necessary.
-   **State Management:** Currently, `App.tsx` handles most of the state. If complexity increases, consider migrating the state to a dedicated **Zustand** store.
-   **React Flow Integration:** Follow the `@xyflow/react` patterns for custom nodes and edge handling.
-   **Persistence:** State is automatically saved to `localStorage` under the key `c4-model-board-state`.
-   **Undo/Redo:** History is manually managed in `App.tsx` with a `MAX_HISTORY` limit (currently 50). Ensure `takeSnapshot()` is called before state modifications.
