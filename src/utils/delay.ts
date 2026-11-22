// Waits for the given time, then resolves. Used to imitate a slow database call.
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
