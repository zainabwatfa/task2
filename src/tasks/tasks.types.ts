export interface Task {
  id: number;
  title: string;
  completed: boolean;
  // Links the task to its owner in the users module.
  userId: number;
}

// What the caller provides to create a task. The service fills in `id` and `completed`.
export type NewTask = Pick<Task, 'title' | 'userId'>;
