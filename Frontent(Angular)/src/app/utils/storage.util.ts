export class StorageUtil {
  static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static getItem(key: string): string | null {
    return this.isBrowser() ? localStorage.getItem(key) : null;
  }

  static setItem(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  static removeItem(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }
}
