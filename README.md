# Task 2 — Node.js Backend with TypeScript and ESM

A small Node.js backend that manages tasks and users in memory. It is written in TypeScript with strict mode on, uses ES Modules (`import` / `export`), and every operation is asynchronous: it returns a Promise that either fulfills with a result or rejects with a typed error.

There is no HTTP server. `src/index.ts` runs each operation and prints the outcome to the console.

## Requirements

- Node.js and npm. The project was developed and tested with Node.js 26.13 and npm 11.20.

## Getting started

```bash
git clone https://github.com/zainabwatfa/task2.git
cd task2
npm install
npm start
```

## Scripts

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run build`     | Compiles `src/` to JavaScript in `dist/` with `tsc`                 |
| `npm start`         | Builds first (`prestart`), then runs `node dist/index.js`           |
| `npm run dev`       | Runs `src/index.ts` directly with `tsx` and restarts on file changes |
| `npm run typecheck` | Checks the types without writing any files (`tsc --noEmit`)         |

## Project structure

```
task2/
├── package.json          # "type": "module" enables ESM; npm scripts
├── tsconfig.json         # Compiler options, strict mode
└── src/
    ├── index.ts          # Entry point: runs every operation and prints the result
    ├── tasks/
    │   ├── tasks.types.ts    # Task and NewTask types
    │   ├── tasks.data.ts     # In-memory tasks array
    │   └── tasks.service.ts  # Async task operations
    ├── users/
    │   ├── users.types.ts    # User interface
    │   ├── users.data.ts     # In-memory users array
    │   └── users.service.ts  # Async user lookups
    └── utils/
        ├── delay.ts          # Promise-based wait that imitates a database call
        └── errors.ts         # AppError, ValidationError, NotFoundError
```

Each module has a `types` file for its shape, a `data` file that holds the array, and a `service` file that holds the functions working on it. `index.ts` only talks to the service files.

## Types

```ts
interface Task {
  id: number;
  title: string;
  completed: boolean;
  userId: number; // the user who owns the task
}

interface User {
  id: number;
  name: string;
  email: string;
}

// What a caller provides to create a task. The service sets `id` and `completed`.
type NewTask = Pick<Task, 'title' | 'userId'>;
```

## Operations

Every function is `async` and waits 300 ms before answering, to imitate a database call.

Task operations, exported from `src/tasks/tasks.service.ts`:

| Function                     | Fulfills with                 | Rejects with                                                        |
| ---------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| `getAllTasks()`              | `Task[]`                      | —                                                                   |
| `getTaskById(id)`            | `Task`                        | `NotFoundError` if the task does not exist                          |
| `getTasksByUserId(userId)`   | `Task[]` (empty if none)      | —                                                                   |
| `addTask({ title, userId })` | The new `Task`                | `ValidationError` if the title is empty; `NotFoundError` if the user does not exist |
| `completeTask(id)`           | The updated `Task`            | `NotFoundError` if the task does not exist                          |
| `deleteTask(id)`             | nothing                       | `NotFoundError` if the task does not exist                          |

User operations, exported from `src/users/users.service.ts`:

| Function          | Fulfills with | Rejects with                               |
| ----------------- | ------------- | ------------------------------------------ |
| `getAllUsers()`   | `User[]`      | —                                          |
| `getUserById(id)` | `User`        | `NotFoundError` if the user does not exist |

## Success and failure handling

- A function that succeeds returns its value, so its Promise fulfills.
- A function that cannot do its job throws a `ValidationError` or a `NotFoundError`, so its Promise rejects. Both extend `AppError`, which marks a failure the app expects.
- `index.ts` runs each operation through a small `attempt` helper that wraps it in `try` / `catch` and prints `SUCCESS` or `FAILED`. It reports only `AppError` failures; any other error is thrown again so that a real bug still stops the program.
- `Promise.all` loads users and tasks at the same time. `Promise.allSettled` looks up three tasks together and reports each result separately, including the one that fails.

## TypeScript configuration

`tsconfig.json` keeps these options on:

| Option                                     | Effect                                                                |
| ------------------------------------------ | --------------------------------------------------------------------- |
| `"strict": true`                           | All strict checks: no implicit `any`, `null` / `undefined` must be handled, `catch` errors are `unknown` |
| `"noEmitOnError": true`                    | `dist/` is not written if there is a type error                       |
| `"module"` / `"moduleResolution": "NodeNext"` | TypeScript follows Node's own ESM rules, so relative imports end in `.js` |

## Example output

`npm start` prints the users and the initial tasks, then:

```
Success cases:
SUCCESS  Add a task for user #2
SUCCESS  Complete task #2
SUCCESS  Delete task #1
SUCCESS  Find user #2
Failure cases:
FAILED   Add a task with an empty title -> ValidationError: Task title cannot be empty
FAILED   Add a task for user #99 -> NotFoundError: User #99 was not found
FAILED   Complete task #99 -> NotFoundError: Task #99 was not found
FAILED   Delete task #1 a second time -> NotFoundError: Task #1 was not found
FAILED   Find user #99 -> NotFoundError: User #99 was not found
Looking up tasks #2, #99 and #3 together:
fulfilled -> "Write async task operations"
rejected  -> Task #99 was not found
fulfilled -> "Write the README"
Final tasks:
┌─────────┬────┬───────────────────────────────┬───────────┬────────┐
│ (index) │ id │ title                         │ completed │ userId │
├─────────┼────┼───────────────────────────────┼───────────┼────────┤
│ 0       │ 2  │ 'Write async task operations' │ true      │ 1      │
│ 1       │ 3  │ 'Write the README'            │ false     │ 2      │
│ 2       │ 4  │ 'Push the project to GitHub'  │ false     │ 2      │
└─────────┴────┴───────────────────────────────┴───────────┴────────┘
```

## Note on data

The data lives only in memory. Nothing is saved to a file or a database, so every run starts again from the same initial tasks and users.

## AI use

I built this project with [Claude Code](https://claude.com/claude-code), Anthropic's AI coding assistant (model: Claude Fable 5.2).

**How I used it**

- I gave Claude Code the six requirements of the task and asked to work through them one step at a time, with an explanation in Arabic after each step.
- Claude Code wrote the code, the configuration files and this README.
- After each step it explained what it had done and why (ESM, interfaces, Promises and `async` / `await`, rejected Promises and `try` / `catch`, strict mode, npm scripts) before we moved to the next step.
- The commits it created are marked with a `Co-Authored-By: Claude` line in the Git history.

**What I decided myself**

- The requirements and the step-by-step pace.
- The GitHub repository, which I created and provided.

**How the result was checked**

- After every step the project was compiled with `tsc` and run, and the output was read to confirm the expected result.
- Strict mode was tested by adding a temporary file with two deliberate mistakes (an untyped parameter and an unchecked `undefined`); `npm run typecheck` reported both, and the file was removed.
- The failure cases were confirmed to leave the data unchanged: the two rejected `addTask` calls add no task to the final list.
- The published repository was cloned into an empty folder, installed with `npm install`, and run with `npm start`.
