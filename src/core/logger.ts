export function logInfo(message: string): void {
  console.log(message);
}

export function logWarn(message: string): void {
  console.warn(`warn: ${message}`);
}

export function logError(message: string): void {
  console.error(`error: ${message}`);
}
