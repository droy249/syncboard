import { useState, useEffect } from 'react';
import { socket } from './socket';
import { Board } from './components/Board';
import { PresenceBar } from './components/PresenceBar';
import type { Task } from './types';
import './App.css';

function App() {
  // Store all tasks in a single array
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userCount, setUserCount] = useState(1);

  // // Create a new task with a unique ID and 'todo' status
  // const handleCreateTask = (title: string) => {
  //   const newTask: Task = {
  //     id: Date.now(),
  //     title,
  //     status: 'todo',
  //     created_at: new Date().toISOString(),
  //   };
  //   setTasks((prev) => [...prev, newTask]);
  // };

    // Fetch all tasks from the server when the component loads
  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}/api/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
          // Listen for new tasks from other users
    socket.on('task:created', (task: Task) => {
      setTasks((prev) => [...prev, task]);
    });

    // Listen for tasks moved by other users
    socket.on('task:moved', (updatedTask: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    });

    socket.on('presence:update', (data: { count: number }) => {
      setUserCount(data.count);
    });


    // Clean up listeners when component unmounts
    return () => {
      socket.off('task:created');
      socket.off('task:moved');
      socket.off('presence:update');
    };
  }, []);

  // Send a POST request to create a new task on the server
  // const handleCreateTask = async (title: string) => {
  //   const res = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}/api/tasks`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ title }),
  //   });
  //   const newTask = await res.json();
  //   setTasks((prev) => [...prev, newTask]);
  // };

    const handleCreateTask = (title: string) => {
    socket.emit('task:create', { title });
  };

  // Move a task by updating its status to a different column
  // const handleMoveTask = (id: number, status: Task['status']) => {
  //   setTasks((prev) =>
  //     prev.map((t) => (t.id === id ? { ...t, status } : t))
  //   );
  // };

    // Send a PATCH request to update a task's column
  // const handleMoveTask = async (id: number, status: Task['status']) => {
  //   const res = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}/api/tasks/${id}`, {
  //     method: 'PATCH',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ status }),
  //   });
  //   const updatedTask = await res.json();
  //   setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  // };
    const handleMoveTask = (id: number, status: Task['status']) => {
    socket.emit('task:move', { id, status });
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
      />
    </div>
  );
}

export default App;