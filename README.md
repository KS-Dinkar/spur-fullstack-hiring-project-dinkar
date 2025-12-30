**🤖 Spur Fullstack Chat Agent**

A high-performance, full-stack e-commerce support application. This project leverages \*\*Google Gemini 2.5 Flash\*\* to provide instant, automated customer service through a sleek, persistent chat interface.

**🚀 Key Features**

- **Real-time AI Interaction:** Low-latency responses using the gemini-2.5-flash model.
- **Session Persistence:** Intelligent chat state management using sessionStorage paired with unique DB identifiers.
- **Service-Oriented Architecture (SOA):** A clean, decoupled backend built for scalability.
- **Dark-Mode UI:** A modern, accessible interface featuring fluid CSS transitions and pill-shaped input fields.

**🛠️ Tech Stack**

**Frontend**

- **Framework:** React.js
- **Styling:** CSS3 (Custom Variables & Transitions)
- **Icons:** Lucide-React

**Backend**

- **Runtime:** Node.js (TypeScript)
- **Server:** Express.js
- **AI Integration:** Google Generative AI SDK

**Database**

- **Engine:** SQLite
- **Driver:** better-sqlite3 (High-performance, synchronous API)

**⚙️ Getting Started**

**1\. Backend Setup**

\# Navigate to the directory

cd SpurBackend

\# Install dependencies

npm install

\# Configure environment

cat &lt;<EOF &gt; .env

PORT=4000

GENAI_API_KEY=your_gemini_api_key_here

EOF

\# Start development server

npm run dev

**2\. Frontend Setup**

\# Navigate to the directory

cd SpurFrontend

\# Install dependencies

npm install

\# Configure API endpoint

echo "REACT_APP_API_BASE_URL=<http://localhost:4000>" > .env

\# Start the application

npm start

**🏗️ Architecture Detail**

The system is designed with a strict **separation of concerns** to facilitate easier testing and future migrations:

- **Routes Layer (/routes)**: Handles HTTP endpoints and input validation.
- **Service Layer (/services)**: Orchestrates business logic, AI prompt construction, and data flow.
- **Data Access Layer (/db)**: Manages raw SQL execution and the SQLite connection.

**🛡️ Reliability Features**

- **Atomic Transactions:** Message storage is wrapped in DB transactions to prevent desync between user input and AI output.
- **Persona Guardrails:** System instructions enforce business hours (9 AM - 5 PM) and specific refund policies.

**🔮 Future Roadmap**

- \[ \] **Streaming Responses:** Use WebSockets (Socket.io) for real-time, token-by-token text generation.
- \[ \] **Automated Testing:** Integration of Vitest for logic and React Testing Library for UI components.
- \[ \] **Advanced Error Recovery:** Implementation of exponential backoff for API rate-limiting.
