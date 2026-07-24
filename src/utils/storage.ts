console.log("storage.ts loaded");

export const test = "OK";

export function loadData<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

export function saveData<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}