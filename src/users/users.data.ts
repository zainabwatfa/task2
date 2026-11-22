import type { User } from './users.types.js';

// In-memory data: lives only while the program is running.
export const users: User[] = [
  { id: 1, name: 'Zainab', email: 'zainab@example.com' },
  { id: 2, name: 'Nour', email: 'nour@example.com' },
];
