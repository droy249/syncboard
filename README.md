# SyncBoard — Real-Time Collaborative Kanban Board

SyncBoard is a full-stack, real-time collaborative Kanban board application that allows multiple users to manage and prioritize tasks concurrently. Built using **React**, **TypeScript**, **Node.js**, **Express**, and **Socket.IO**, the project features instant, bi-directional state synchronization, live user presence tracking, and durable persistence backed by a serverless **Neon PostgreSQL** database.

## 🚀 Live Demo & Repository
- **Live Application:** [https://syncboard-server-bc1t.onrender.com](https://syncboard-server-bc1t.onrender.com)
- **GitHub Repository:** [https://github.com/droy249/syncboard](https://github.com/droy249/syncboard)

## ✨ Key Features
- **Full Real-Time CRUD Operations:** Users can create, retrieve, update statuses (move across columns), edit titles dynamically (double-click on any task card), and delete tasks. Every operation is broadcasted and synchronized across all connected browser sessions in under 50ms.
- **Live User Presence Tracking:** Displays active online user counts and visual indicators. Employs an optimized, in-memory ephemeral state model using JavaScript **Sets** on the server to capture and handle WebSocket handshakes without unnecessary database read/write operations.
- **Durable Cloud Persistence:** Connects to a Neon serverless PostgreSQL database to persist board state across server restarts, utilizing parameterized raw SQL queries to secure the server against SQL Injection.
- **Robust Self-Healing State:** Gracefully recovers from unexpected socket dropouts. Browsers auto-reconnect, and the backend dynamically rebuilds the presence index.
- **Optimized UI Performance:** Implements localized component editing states in React to prevent global parent-level re-renders during active user editing sessions.

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite, CSS3
- **Backend:** Node.js, Express, Socket.IO, tsx (TypeScript Execute)
- **Database:** Neon Serverless PostgreSQL
- **Deployment:** Render (Unified client-server asset hosting)

## 📐 Architecture & Data Flow
The application architecture strictly decouples **durable persistent state** from **ephemeral user sessions**:

1. **Durable CRUD Lifecycle:**
   ```
   Client Action (e.g., Delete Card) 
     └── Emit Socket Event 'task:delete' with ID
           └── Express Server / Node.js
                 ├── Execute SQL 'DELETE FROM tasks...'
                 └── PostgreSQL Database (Neon)
                       └── Server emits 'task:deleted' to ALL clients
                             └── Clients filter local React State array
   ```

2. **Ephemeral Presence Lifecycle:**
   ```
   Browser Connection Event (Handshake)
     └── Server appends Socket ID to connectedUsers Set
           └── Server emits 'presence:update' with updated Set size
                 └── React Client updates PresenceBar UI
   ```

## 💻 Local Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/syncboard.git
cd syncboard
```

### 2. Configure Environment Variables
#### Server Configuration: Create `server/.env`
```env
PORT=3001
DATABASE_URL=postgres://your_neon_db_connection_string
CLIENT_URL=http://localhost:5173
```

#### Client Configuration: Create `client/.env`
```env
VITE_SERVER_URL=http://localhost:3001
```

### 3. Run the Project Locally
#### Run the Backend Server:
```bash
cd server
npm install
npm run dev
```

#### Run the Frontend Client:
```bash
cd ../client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser. Open multiple windows or tabs side-by-side to experience the instant, collaborative real-time sync!

## 🌐 Unified Production Deployment (Render)
To minimize hosting overhead and leverage Render's single-web-service model, the React client is bundled into static assets and served directly by the Express backend:

1. Compile the production React bundle:
   ```bash
   cd client
   npm run build
   ```
2. Copy the production assets into the server's public directory:
   ```powershell
   # On Windows (PowerShell):
   mkdir -Force ../server/public
   Copy-Item -Recurse -Force dist/* ../server/public/
   ```
3. Push code to GitHub to trigger Render's automated build and deployment pipelines.
