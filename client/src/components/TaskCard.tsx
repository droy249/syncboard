import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  currentStatus: Task['status'];
  onMoveTask: (id: number, status: Task['status']) => void;
}

// Define the three column statuses in left-to-right order
const STATUS_ORDER: Task['status'][] = ['todo', 'in-progress', 'done'];

export function TaskCard({ task, currentStatus, onMoveTask }: TaskCardProps) {
  // Determine which directions this card can move
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < STATUS_ORDER.length - 1;

  return (
    <div className="task-card">
      <p className="task-title">{task.title}</p>
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
  );
}
