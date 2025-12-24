export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const STORAGE_KEYS = {
  USERS: 'bma_users',
  TICKETS: 'bma_tickets',
  CURRENT_USER: 'bma_current_user'
};

export const getStorageData = (key, defaultValue = null) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export const setStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};
