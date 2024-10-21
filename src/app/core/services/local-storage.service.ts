export class LocalStorageService {
  static getFromLocalStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static saveToLocalStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
