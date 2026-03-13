<div align="center">

# Real Time Chat Application 

A simple real-time chat application built to learn WebSocket technology. Features user identification, timestamps, and emoji support. My personal project to understand bidirectional communication with React, TypeScript, and Node.js.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-89%25-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![WebSocket](https://img.shields.io/badge/WebSocket-ws-010101?style=flat&logo=socketdotio&logoColor=white)](https://github.com/websockets/ws)
[![Vite](https://img.shields.io/badge/Vite-⚡-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

A simple real-time chat application built to learn WebSocket technology. Features user identification, timestamps, and emoji support. My personal project to understand bidirectional communication with React, TypeScript, and Node.js.

## Features

- Real-time messaging using WebSocket
- User identification
- Message timestamps
- Emoji picker
- Clean, responsive UI
- Connection status indicators

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Vite
- **Backend:** Node.js, Express, WebSocket (ws)

## Project Structure

```
├── client_web/              # Frontend React application
│   └── chat_app/
│       ├── src/             # Source files
│       ├── public/          # Static files
│       └── package.json     # Frontend dependencies
└── server/                  # Backend WebSocket server
    ├── src/                 # Server source files
    └── package.json         # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation & Running

1. **Start the backend server:**

```bash
cd server
npm install
npm start
```

2. **Start the frontend client:**

```bash
cd client_web/chat_app
npm install
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually http://localhost:5173)

4. Open multiple browser windows to test the chat functionality between different users

## Learning Outcomes

- WebSocket implementation
- Real-time bidirectional communication
- React component state management
- TypeScript interfaces for type safety
