export function getFromStorage(key, defaultValue) {
  try {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return defaultValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error reading ${key} from LocalStorage:`, error);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to LocalStorage:`, error);
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from LocalStorage:`, error);
  }
}