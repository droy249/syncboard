import { useState, useEffect } from 'react';
import { socket } from './socket';
import { Board } from './components/Board';
import { PresenceBar } from './components/PresenceBar';
import type { Task } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userCount, setUserCount] = useState(1);

  useEffect(() => {
    // Fetch all tasks from the server when the component loads
    fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}/api/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));

    // Listen for new tasks
    socket.on('task:created', (task: Task) => {
      setTasks((prev) => [...prev, task]);
    });

    // Listen for moved tasks
    socket.on('task:moved', (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    });

    // Listen for user presence updates
    socket.on('presence:update', (data: { count: number }) => {
      setUserCount(data.count);
    });

    // Listen for task deletions from the server
    socket.on('task:deleted', (data: { id: number }) => {
      setTasks((prev) => prev.filter((t) => t.id !== data.id));
    });

    // Listen for task title edits from the server
    socket.on('task:edited', (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    });

    // Clean up listeners when component unmounts
    return () => {
      socket.off('task:created');
      socket.off('task:moved');
      socket.off('presence:update');
      socket.off('task:deleted');
      socket.off('task:edited');
    };
  }, []);

  const handleCreateTask = (title: string) => {
    socket.emit('task:create', { title });
  };

  const handleMoveTask = (id: number, status: Task['status']) => {
    socket.emit('task:move', { id, status });
  };

  const handleDeleteTask = (id: number) => {
    socket.emit('task:delete', { id });
  };

  const handleEditTask = (id: number, title: string) => {
    socket.emit('task:edit', { id, title });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>SyncBoard</h1>
        <PresenceBar count={userCount} />
      </header>
      <Board
        tasks={tasks}
        onCreateTask={handleCreateTask}
        onMoveTask={handleMoveTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

export default App;