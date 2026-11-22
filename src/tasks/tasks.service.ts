import { delay } from '../utils/delay.js';
import { tasks } from './tasks.data.js';
import type { NewTask, Task } from './tasks.types.js';

// How long each operation pretends to take, in milliseconds.
const DB_DELAY_MS = 300;

export async function getAllTasks(): Promise<Task[]> {
  await delay(DB_DELAY_MS);
  // Return a copy so callers cannot change the stored array by accident.
  return [...tasks];
}

export async function getTaskById(id: number): Promise<Task | undefined> {
  await delay(DB_DELAY_MS);
  return tasks.find((task) => task.id === id);
}

export async function getTasksByUserId(userId: number): Promise<Task[]> {
  await delay(DB_DELAY_MS);
  return tasks.filter((task) => task.userId === userId);
}

export async function addTask(newTask: NewTask): Promise<Task> {
  await delay(DB_DELAY_MS);

  const highestId = Math.max(0, ...tasks.map((task) => task.id));
  const task: Task = {
    id: highestId + 1,
    title: newTask.title,
    completed: false,
    userId: newTask.userId,
  };

  tasks.push(task);
  return task;
}

export async function completeTask(id: number): Promise<Task | undefined> {
  await delay(DB_DELAY_MS);

  const task = tasks.find((item) => item.id === id);
  if (task) {
    task.completed = true;
  }
  return task;
}

export async function deleteTask(id: number): Promise<boolean> {
  await delay(DB_DELAY_MS);

  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) {
    return false;
  }

  tasks.splice(index, 1);
  return true;
}
