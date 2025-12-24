import { delay, getStorageData, setStorageData, STORAGE_KEYS } from './api';
import { MOCK_TICKETS } from './mockData';

// Initialize mock data if empty
const initData = () => {
    const existing = localStorage.getItem(STORAGE_KEYS.TICKETS);
    if (!existing) {
        setStorageData(STORAGE_KEYS.TICKETS, MOCK_TICKETS);
    }
};

initData();

export const ticketService = {
    getAll: async (filters = {}) => {
        await delay(600);
        let tickets = getStorageData(STORAGE_KEYS.TICKETS, []);

        // Apply client-side filtering
        if (filters.status && filters.status !== 'All') {
            tickets = tickets.filter(t => t.status === filters.status);
        }
        if (filters.priority && filters.priority !== 'All') {
            tickets = tickets.filter(t => t.priority === filters.priority);
        }

        // Sort by newest first
        return tickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    getById: async (id) => {
        await delay(400);
        const tickets = getStorageData(STORAGE_KEYS.TICKETS, []);
        const ticket = tickets.find(t => t.id === id);
        if (!ticket) throw new Error('Ticket not found');
        return ticket;
    },

    create: async (ticketData) => {
        await delay(800);
        const tickets = getStorageData(STORAGE_KEYS.TICKETS, []);

        const newTicket = {
            ...ticketData,
            id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            created_at: new Date().toISOString(),
            status: 'Open',
            activity_log: [{
                id: crypto.randomUUID(),
                action: 'Ticket Created',
                timestamp: new Date().toISOString(),
                user_id: ticketData.created_by
            }]
        };

        tickets.unshift(newTicket);
        setStorageData(STORAGE_KEYS.TICKETS, tickets);
        return newTicket;
    },

    updateStatus: async (ticketId, newStatus, userId) => {
        await delay(500);
        const tickets = getStorageData(STORAGE_KEYS.TICKETS, []);
        const index = tickets.findIndex(t => t.id === ticketId);

        if (index === -1) throw new Error('Ticket not found');

        const updatedTicket = { ...tickets[index] };

        // If status changed, log it
        if (updatedTicket.status !== newStatus) {
            updatedTicket.status = newStatus;
            updatedTicket.activity_log.unshift({
                id: crypto.randomUUID(),
                action: `Status updated to ${newStatus}`,
                timestamp: new Date().toISOString(),
                user_id: userId
            });
        }

        tickets[index] = updatedTicket;
        setStorageData(STORAGE_KEYS.TICKETS, tickets);
        return updatedTicket;
    },

    addComment: async (ticketId, commentText, userId) => {
        await delay(500);
        const tickets = getStorageData(STORAGE_KEYS.TICKETS, []);
        const index = tickets.findIndex(t => t.id === ticketId);

        if (index === -1) throw new Error('Ticket not found');

        const newActivity = {
            id: crypto.randomUUID(),
            action: 'Comment Added',
            details: commentText,
            type: 'comment',
            timestamp: new Date().toISOString(),
            user_id: userId
        };

        tickets[index].activity_log.unshift(newActivity);
        setStorageData(STORAGE_KEYS.TICKETS, tickets);
        return tickets[index];
    }
};
