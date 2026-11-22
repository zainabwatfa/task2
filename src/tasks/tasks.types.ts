export interface Task {
  id: number;
  title: string;
  completed: boolean;
  // Links the task to its owner in the users module.
  userId: number;
}
