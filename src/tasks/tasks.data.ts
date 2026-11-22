import type { Task } from './tasks.types.js';

// In-memory data: lives only while the program is running.
export const tasks: Task[] = [
  { id: 1, title: 'Learn TypeScript interfaces', completed: true, userId: 1 },
  { id: 2, title: 'Write async task operations', completed: false, userId: 1 },
  { id: 3, title: 'Write the README', completed: false, userId: 2 },
];
