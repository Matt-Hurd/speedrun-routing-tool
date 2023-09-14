class StorageManager {
  static setItem(key: string, value: unknown) {
    localStorage.setItem("totum." + key, JSON.stringify(value));
  }

  static getItem(key: string) {
    const data = localStorage.getItem("totum." + key);
    return data ? JSON.parse(data) : null;
  }

  static removeItem(key: string) {
    localStorage.removeItem("totum." + key);
  }
}

export default StorageManager;
