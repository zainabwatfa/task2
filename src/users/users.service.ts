import { delay } from '../utils/delay.js';
import { users } from './users.data.js';
import type { User } from './users.types.js';

// How long each operation pretends to take, in milliseconds.
const DB_DELAY_MS = 300;

export async function getAllUsers(): Promise<User[]> {
  await delay(DB_DELAY_MS);
  // Return a copy so callers cannot change the stored array by accident.
  return [...users];
}

export async function getUserById(id: number): Promise<User | undefined> {
  await delay(DB_DELAY_MS);
  return users.find((user) => user.id === id);
}
