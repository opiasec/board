# opiasec Board

A simplified, web-based system modeling board designed for **C4 Architecture** and **Threat Modeling**. This tool allows security engineers and architects to diagram systems and map assets, threats, and security controls in an interactive way.

Try it out: [board.opiasec.com](https://board.opiasec.com)

![Threat Modeling Header](https://img.shields.io/badge/Tech-React--Flow-blue)
![Styling](https://img.shields.io/badge/Styling-Tailwind--CSS-38bdf8)
![State](https://img.shields.io/badge/State-Zustand%20%2F%20React%20Hooks-indigo)

## 🚀 Purpose

The goal of this application is to bridge the gap between software architecture and security analysis. By using the **C4 Model** as a foundation, users can enrich their diagrams with security-specific metadata:

-   **Assets:** Identify what data or services are valuable.
-   **Threats:** Map potential risks directly to specific software systems or containers.
-   **Controls:** Visualize the security measures implemented to mitigate threats.

## ✨ Key Features

-   **C4 Model Support:** Dedicated nodes for Persons, Software Systems, Containers, and Boundaries.
-   **Security Badges:** Drag & drop Assets, Threats, and Controls directly onto architecture nodes to "attach" them.
-   **Interactive Canvas:**
    -   **Drag & Drop:** Build diagrams easily from a dedicated sidebar.
    -   **Multi-Selection:** Select multiple elements (Shift + Click or Box Selection) for batch actions.
    -   **Keyboard Shortcuts:** Full support for `Undo/Redo` (Ctrl+Z/Y), `Copy/Paste` (Ctrl+C/V), and `Delete`.
    -   **Hover Expansion:** Security badges are compact icons that expand to show labels on hover.
-   **Persistence:**
    -   **Local Storage:** Your progress is automatically saved in the browser.
    -   **JSON Import/Export:** Export your threat model to a JSON file and import it later.

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   npm (comes with Node.js)

### Installation

1.  Clone the repository or download the source code.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`.

## 📖 How to Use

1.  **Diagramming:** Drag C4 elements from the left sidebar to the canvas.
2.  **Connecting:** Click and drag from one node handle to another to create labeled relationships (e.g., "Uses", "HTTPS").
3.  **Threat Modeling:** Drag a **Threat**, **Asset**, or **Control** from the sidebar and drop it **inside** a Software System or Container node. It will become a child of that node and move with it.
4.  **Editing:** Click on any node or connection to open the **Edit Panel** on the right.
5.  **Saving:** Use the **Export** button to save your model as a JSON file for sharing or later use.

---

Built with ❤️ for Security Engineers.
