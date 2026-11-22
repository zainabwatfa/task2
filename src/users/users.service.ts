import { delay } from '../utils/delay.js';
import { NotFoundError } from '../utils/errors.js';
import { users } from './users.data.js';
import type { User } from './users.types.js';

// How long each operation pretends to take, in milliseconds.
const DB_DELAY_MS = 300;

export async function getAllUsers(): Promise<User[]> {
  await delay(DB_DELAY_MS);
  // Return a copy so callers cannot change the stored array by accident.
  return [...users];
}

// Rejects with NotFoundError when no user has this id.
export async function getUserById(id: number): Promise<User> {
  await delay(DB_DELAY_MS);

  const user = users.find((item) => item.id === id);
  if (!user) {
    throw new NotFoundError(`User #${id} was not found`);
  }
  return user;
}
