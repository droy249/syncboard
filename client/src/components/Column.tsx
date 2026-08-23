import { TaskCard } from './TaskCard';
import type { Task } from '../types';

interface ColumnProps {
  label: string;
  status: Task['status'];
  tasks: Task[];
  onMoveTask: (id: number, status: Task['status']) => void;
  onEditTask: (id: number, title: string) => void;
  onDeleteTask: (id: number) => void;
}

// Render a column header and its list of task cards
export function Column({ label, status, tasks, onMoveTask, onEditTask, onDeleteTask }: ColumnProps) {
  return (
    <div className="column">
      <h2 className="column-header">
        {label} <span className="task-count">{tasks.length}</span>
      </h2>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentStatus={status}
            onMoveTask={onMoveTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <p className="empty-message">No tasks</p>
        )}
      </div>
    </div>
  );
}