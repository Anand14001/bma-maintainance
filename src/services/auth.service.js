import { delay, setStorageData, getStorageData, STORAGE_KEYS } from './api';
import { MOCK_USERS } from './mockData';

export const authService = {
    login: async (email, password) => {
        await delay(800); // Simulate network latency
        const user = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const { password: _, ...userWithoutPassword } = user;
        setStorageData(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
        return userWithoutPassword;
    },

    logout: async () => {
        await delay(400);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        return true;
    },

    getCurrentUser: async () => {
        // Check if we have a session
        await delay(200);
        return getStorageData(STORAGE_KEYS.CURRENT_USER);
    }
};
