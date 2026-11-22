// Base class for failures this app expects and knows how to report.
// Anything else that gets thrown is a bug and should not be hidden.
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

// The caller sent data the app cannot accept.
export class ValidationError extends AppError {}

// The caller asked for something that does not exist.
export class NotFoundError extends AppError {}
