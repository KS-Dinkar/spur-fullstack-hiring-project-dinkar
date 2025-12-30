Spur Fullstack Hiring Project - Chat Agent

This is a full-stack e-commerce support chat application built with React (Frontend), Express/TypeScript (Backend), and SQLite (Database). It utilizes Google's Gemini 2.5 Flash to provide automated customer support.

🚀 Getting Started Locally

Follow these steps to get the project running on your machine.

Prerequisites

Node.js (v18 or higher recommended)

npm or yarn

A Google Gemini API Key (Get one at Google AI Studio)

1. Backend Setup

Navigate to the backend directory:

cd SpurBackend


Install dependencies:

npm install


Create a .env file in the SpurBackend root:

PORT=3000
GENAI_API_KEY=your_gemini_api_key_here


Start the development server:

npm run dev


Note: The server will automatically initialize the SQLite database (data.db) and create the necessary tables on the first run.

2. Frontend Setup

Navigate to the frontend directory:

cd SpurFrontend


Install dependencies:

npm install


Create a .env file in the SpurFrontend root:

REACT_APP_API_BASE_URL=http://localhost:3000


Start the React app:

npm start


🗄️ Database Management

The project uses SQLite with the better-sqlite3 driver for high performance and zero-config setup.

Initialization: The schema is defined in src/db/sqlite.ts. It runs automatically when the backend starts.

Migrations: Since it's a lightweight project, schema updates are handled via CREATE TABLE IF NOT EXISTS checks.

Structure:

conversations: Stores sessionId to persist chat history across refreshes.

messages: Stores individual chat bubbles (user or ai) linked to a conversation.

🏗️ Architecture Overview

The backend follows a Service-Oriented Architecture (SOA) pattern to separate concerns:

Routes Layer (src/routes): Defines HTTP endpoints and handles basic request validation (e.g., ensuring sessionId exists).

Service Layer (src/services): Contains the core business logic. It coordinates between the LLM provider and the database.

Data Access Layer (src/db): Manages the SQLite connection and raw SQL execution.

Key Design Decisions

Session Persistence: Used sessionStorage on the frontend combined with a unique sessionId to ensure users don't lose their chat history when navigating or refreshing, without requiring a full login system.

Atomic Transactions: Message insertion is wrapped in a db.transaction() to ensure that either both the user message and AI response are saved, or neither is, preventing "half-saved" states.

Modern UI: Used a dark-mode centered CSS design with pill-shaped inputs and CSS transitions for a "premium" chat feel.

🤖 LLM Implementation

Provider

Model: gemini-2.5-flash

Why? It offers a high context window and extremely low latency, making the "Agent is typing..." state feel brief and responsive.

Prompting Strategy

The agent is configured using a System Instruction to maintain a specific persona:

Tone: Helpful, clear, and concise.

Constraints: Operates 9 AM - 5 PM, Monday to Friday.

Policies: Explicit instructions on 30-day refunds for electronics and clothing items.

🛠️ Trade-offs & Future Improvements ("If I had more time...")

Context Memory: Currently, each query is sent individually. I would implement a "sliding window" of the last 5-10 messages from the DB to send back to Gemini so the agent remembers the context of the conversation.

WebSockets: Switching from REST polling/requests to Socket.io would allow for real-time streaming of AI responses (word-by-word) instead of waiting for the full block.

Unit Testing: Adding Vitest for backend services and React Testing Library for the message bubbles.

Error Handling: Implementing more robust UI feedback for network timeouts or API rate limits.
