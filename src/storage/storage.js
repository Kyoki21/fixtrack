import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  settings: '@fixtrack/settings',
  orders: '@fixtrack/orders',
  clients: '@fixtrack/clients',
  lastSync: '@fixtrack/lastSync',
};

export async function loadJson(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export async function saveJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}
