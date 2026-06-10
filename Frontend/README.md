# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



main README - 
# AI Interview Platform - Frontend 

This is the client-side repository for the AI Interview Platform, built using **React.js (Vite)** and optimized for high-performance user interactions and dynamic AI conversational flows.

---

##  Tech Stack & Libraries Used

* **Core Framework:** React.js (Vite)
* **Styling:** SCSS (Sass) for component-scoped structure, mixins, and variables.
* **Routing:** React Router DOM (v6) for seamless multi-page transitions.
* **State Management:** React Context API for global state (Authentication state, UI themes).
* **HTTP Client:** Axios / Fetch API for seamless integration with the Node.js backend.

---

##  Architectural Layout (Within `src/`)

The frontend follows a **Feature-Based (Slice) Architecture** which makes the codebase modular, clean, and highly scalable:

```text
src/
├── features/          # Core modules grouped by functional business logic
│   ├── auth/          # Authentication flows
│   │   ├── components/# Login, Register, Input cards
│   │   ├── hooks/     # Custom authentication hooks (useAuth)
│   │   ├── pages/     # Auth specific layout components
│   │   ├── services/  # API calls pointing to /api/auth
│   │   ├── auth.context.jsx  # Global authentication context store
│   │   └── auth.form.scss    # Component-isolated styling
│   │
│   └── interview/     # Core AI Interview module
│       ├── hooks/     # Custom hook managing conversational loop (useInterview)
│       ├── pages/     # Home dashboard & main interactive Interview Arena
│       ├── services/  # Connectors targeting /api/interview endpoint
│       └── style/     # Visual elements for the chat and score feeds
│
├── style/             # Application-wide global sheets, resets, and variables
├── App.jsx            # Layout wrapper injecting routers and global providers
├── app.routes.jsx     # Master declarations for client-side navigation
└── main.jsx           # Mounting node orchestrator
