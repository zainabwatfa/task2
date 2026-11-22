import {
  addTask,
  completeTask,
  deleteTask,
  getAllTasks,
  getTasksByUserId,
} from './tasks/tasks.service.js';
import { getAllUsers } from './users/users.service.js';

// The two reads do not depend on each other, so they run at the same time.
const [users, initialTasks] = await Promise.all([getAllUsers(), getAllTasks()]);

console.log('Users:');
console.table(users);

console.log('Initial tasks:');
console.table(initialTasks);

const newTask = await addTask({ title: 'Push the project to GitHub', userId: 2 });
console.log(`Added task #${newTask.id}: "${newTask.title}"`);

const completed = await completeTask(2);
console.log(`Completed task #2: ${completed?.completed}`);

console.log(`Deleted task #1: ${await deleteTask(1)}`);

console.log('Tasks for user #2:');
console.table(await getTasksByUserId(2));

console.log('Final tasks:');
console.table(await getAllTasks());
