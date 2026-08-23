// Define the shape of a task on the board
export interface Task {
  id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
}