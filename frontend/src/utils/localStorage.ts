import { IListOption } from "../context/ListOptionContext";

export type IListOptionsLocalStorage = Omit<IListOption, "page" | "pageSize">;

export function saveData<T>(key: string, data: T): void {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving data to localStorage: ${error}`);
  }
}

export function getData<T>(
  key: string,
  defaultValue: T | null = null
): T | null {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error(`Error getting data from localStorage: ${error}`);
    return defaultValue;
  }
}

export function updateData<T>(
  key: string,
  updateFunction: (currentData: T | null) => T | null
): void {
  try {
    const currentData = getData<T>(key);
    const updatedData = updateFunction(currentData);
    saveData<T>(key, updatedData);
  } catch (error) {
    console.error(`Error updating data in localStorage: ${error}`);
  }
}
