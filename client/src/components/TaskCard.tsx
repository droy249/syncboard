import { useState } from 'react';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  currentStatus: Task['status'];
  onMoveTask: (id: number, status: Task['status']) => void;
  onEditTask: (id: number, title: string) => void;
  onDeleteTask: (id: number) => void;
}

const STATUS_ORDER: Task['status'][] = ['todo', 'in-progress', 'done'];

export function TaskCard({ task, currentStatus, onMoveTask, onEditTask, onDeleteTask }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < STATUS_ORDER.length - 1;

  const handleSave = () => {
    if (editText.trim() && editText.trim() !== task.title) {
      onEditTask(task.id, editText.trim());
    } else {
      setEditText(task.title); // Revert if input is empty
    }
    setIsEditing(false);
  };

  return (
    <div className="task-card">
      <div className="task-body">
        {isEditing ? (
          <input
            type="text"
            className="task-edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
          />
        ) : (
          <span 
            className="task-title" 
            onDoubleClick={() => setIsEditing(true)}
            title="Double-click to edit title"
          >
            {task.title}
          </span>
        )}
      </div>

      <div className="task-controls">
        <button 
          onClick={() => onDeleteTask(task.id)} 
          className="btn-delete" 
          title="Delete task"
        >
          &times;
        </button>
        <div className="task-actions">
          {canMoveLeft && (
            <button
              onClick={() => onMoveTask(task.id, STATUS_ORDER[currentIndex - 1])}
              title="Move left"
            >
              &larr;
            </button>
          )}
          {canMoveRight && (
            <button
              onClick={() => onMoveTask(task.id, STATUS_ORDER[currentIndex + 1])}
              title="Move right"
            >
              &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}