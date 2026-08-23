import { useState } from 'react';
import { Column } from './Column';
import type { Task } from '../types';

interface BoardProps {
  tasks: Task[];
  onCreateTask: (title: string) => void;
  onMoveTask: (id: number, status: Task['status']) => void;
  onEditTask: (id: number, title: string) => void;
  onDeleteTask: (id: number) => void;
}

// Map each column to its status value and display label
const COLUMNS: { status: Task['status']; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in-progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
];

export function Board({ tasks, onCreateTask, onMoveTask, onEditTask, onDeleteTask }: BoardProps) {
  const [newTitle, setNewTitle] = useState('');

  // Handle form submission to create a new task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onCreateTask(newTitle.trim());
      setNewTitle('');
    }
  };

    return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add Task</button>
      </form>
      <div className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.status}
            label={col.label}
            status={col.status}
            tasks={tasks.filter((t) => t.status === col.status)}
            onMoveTask={onMoveTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}