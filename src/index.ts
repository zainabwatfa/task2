import {
  addTask,
  completeTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  getTasksByUserId,
} from './tasks/tasks.service.js';
import { getAllUsers, getUserById } from './users/users.service.js';
import { AppError } from './utils/errors.js';

// Runs one operation and reports whether its Promise fulfilled or rejected.
async function attempt(label: string, operation: () => Promise<unknown>): Promise<void> {
  try {
    await operation();
    console.log(`SUCCESS  ${label}`);
  } catch (error) {
    // Only expected failures are reported here. A bug must still crash the program.
    if (!(error instanceof AppError)) {
      throw error;
    }
    console.log(`FAILED   ${label} -> ${error.name}: ${error.message}`);
  }
}

// The two reads do not depend on each other, so they run at the same time.
const [users, initialTasks] = await Promise.all([getAllUsers(), getAllTasks()]);

console.log('Users:');
console.table(users);

console.log('Initial tasks:');
console.table(initialTasks);

console.log('Success cases:');
await attempt('Add a task for user #2', () =>
  addTask({ title: 'Push the project to GitHub', userId: 2 }),
);
await attempt('Complete task #2', () => completeTask(2));
await attempt('Delete task #1', () => deleteTask(1));
await attempt('Find user #2', () => getUserById(2));

console.log('Failure cases:');
await attempt('Add a task with an empty title', () => addTask({ title: '   ', userId: 1 }));
await attempt('Add a task for user #99', () => addTask({ title: 'Ghost task', userId: 99 }));
await attempt('Complete task #99', () => completeTask(99));
await attempt('Delete task #1 a second time', () => deleteTask(1));
await attempt('Find user #99', () => getUserById(99));

// allSettled waits for every Promise and reports each result,
// while Promise.all would stop at the first rejection.
console.log('Looking up tasks #2, #99 and #3 together:');
const lookups = await Promise.allSettled([getTaskById(2), getTaskById(99), getTaskById(3)]);
for (const lookup of lookups) {
  if (lookup.status === 'fulfilled') {
    console.log(`fulfilled -> "${lookup.value.title}"`);
  } else {
    console.log(`rejected  -> ${lookup.reason instanceof Error ? lookup.reason.message : lookup.reason}`);
  }
}

console.log('Tasks for user #2:');
console.table(await getTasksByUserId(2));

console.log('Final tasks:');
console.table(await getAllTasks());
