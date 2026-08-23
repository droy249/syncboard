import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables before initializing the Neon client
dotenv.config();

// Connect to Neon using the DATABASE_URL from .env
export const sql = neon(process.env.DATABASE_URL!);

// Create the tasks table if it doesn't exist yet
export async function initDb() {
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