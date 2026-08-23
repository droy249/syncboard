import path from 'path';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

// Create Express app and wrap it in an HTTP server
const app = express();
const server = createServer(app);
// Attach Socket.IO with CORS for the frontend
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Connect to Neon PostgreSQL
const sql = neon(process.env.DATABASE_URL!);


// Create the tasks table if it doesn't exist
async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'todo',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('Database initialized');
}

// Fetch all tasks for initial page load
app.get('/api/tasks', async (_req, res) => {
  const tasks = await sql`SELECT * FROM tasks ORDER BY created_at ASC`;
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  const result = await sql`
    INSERT INTO tasks (title, status) VALUES (${title}, 'todo') RETURNING *
  `;
  res.json(result[0]);
});

app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await sql`
    UPDATE tasks SET status = ${status} WHERE id = ${Number(id)} RETURNING *
  `;
  res.json(result[0]);
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Save new task to database, then broadcast to all clients
  socket.on('task:create', async (data: { title: string }) => {
    const result = await sql`
      INSERT INTO tasks (title, status) VALUES (${data.title}, 'todo') RETURNING *
    `;
    io.emit('task:created', result[0]);
  });

  // Update task status, then broadcast to all clients
  socket.on('task:move', async (data: { id: number; status: string }) => {
    const result = await sql`
      UPDATE tasks SET status = ${data.status} WHERE id = ${data.id} RETURNING *
    `;
    io.emit('task:moved', result[0]);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;

initDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});