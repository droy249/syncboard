import { io } from 'socket.io-client';

// Connect to the server (uses env variable or localhost default)
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const socket = io(SERVER_URL);