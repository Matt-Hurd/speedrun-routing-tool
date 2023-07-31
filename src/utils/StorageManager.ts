class StorageManager {
  static setItem(key: string, value: any) {
    if (process.env.NODE_ENV !== "production") { // Prevent current "Production" build from leaving a mess for testers
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static getItem(key: string) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}

export default StorageManager;
