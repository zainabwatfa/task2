import { getUserById } from '../users/users.service.js';
import { delay } from '../utils/delay.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { tasks } from './tasks.data.js';
import type { NewTask, Task } from './tasks.types.js';

// How long each operation pretends to take, in milliseconds.
const DB_DELAY_MS = 300;

export async function getAllTasks(): Promise<Task[]> {
  await delay(DB_DELAY_MS);
  // Return a copy so callers cannot change the stored array by accident.
  return [...tasks];
}

// Rejects with NotFoundError when no task has this id.
export async function getTaskById(id: number): Promise<Task> {
  await delay(DB_DELAY_MS);

  const task = tasks.find((item) => item.id === id);
  if (!task) {
    throw new NotFoundError(`Task #${id} was not found`);
  }
  return task;
}

export async function getTasksByUserId(userId: number): Promise<Task[]> {
  await delay(DB_DELAY_MS);
  return tasks.filter((task) => task.userId === userId);
}

// Rejects with ValidationError for an empty title,
// and with NotFoundError when the owner does not exist.
export async function addTask(newTask: NewTask): Promise<Task> {
  const title = newTask.title.trim();
  if (title === '') {
    throw new ValidationError('Task title cannot be empty');
  }

  // Throws if the user is missing, which stops the task from being created.
  await getUserById(newTask.userId);
  await delay(DB_DELAY_MS);

  const highestId = Math.max(0, ...tasks.map((task) => task.id));
  const task: Task = {
    id: highestId + 1,
    title,
    completed: false,
    userId: newTask.userId,
  };

  tasks.push(task);
  return task;
}

// Rejects with NotFoundError when no task has this id.
export async function completeTask(id: number): Promise<Task> {
  const task = await getTaskById(id);
  task.completed = true;
  return task;
}

// Rejects with NotFoundError when no task has this id.
export async function deleteTask(id: number): Promise<void> {
  await delay(DB_DELAY_MS);

  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    throw new NotFoundError(`Task #${id} was not found`);
  }

  tasks.splice(index, 1);
}
