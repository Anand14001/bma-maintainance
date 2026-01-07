import { db } from '../lib/firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    addDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';

const COLLECTION_NAME = 'tickets';
const LOG_COLLECTION_NAME = 'activity_log';

export const ticketService = {
    getAll: async (filters = {}) => {
        try {
            const ticketsRef = collection(db, COLLECTION_NAME);
            let q = query(ticketsRef);

            // Apply filters
            const constraints = [];
            if (filters.status && filters.status !== 'All') {
                constraints.push(where('status', '==', filters.status));
            }
            if (filters.priority && filters.priority !== 'All') {
                constraints.push(where('priority', '==', filters.priority));
            }

            if (constraints.length > 0) {
                q = query(ticketsRef, ...constraints);
            }

            const querySnapshot = await getDocs(q);
            let tickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Client-side sort to avoid index issues initially (Created At desc)
            tickets.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            return tickets;
        } catch (error) {
            console.error("Error fetching tickets:", error);
            throw new Error("Failed to fetch tickets");
        }
    },

    getById: async (id) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Ticket not found');
            }

            const ticketData = { id: docSnap.id, ...docSnap.data() };

            // Fetch activity log subcollection
            const logsRef = collection(docRef, LOG_COLLECTION_NAME);
            // Sort by timestamp desc (newest first)
            // Note: This needs an index if compound queries are used, but here it's simple collection ordering
            // However, for subcollections we might need to manually sort if not indexed yet.
            const q = query(logsRef);
            const logSnapshot = await getDocs(q);

            const activity_log = logSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            activity_log.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            return { ...ticketData, activity_log };
        } catch (error) {
            console.error("Error fetching ticket details:", error);
            throw error;
        }
    },

    create: async (ticketData, userName) => {
        try {
            const customId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;

            const newTicket = {
                ...ticketData,
                created_at: new Date().toISOString(),
                status: 'Open',
                // activity_log array removed from main doc
            };

            const ticketRef = doc(db, COLLECTION_NAME, customId);
            await setDoc(ticketRef, newTicket);

            // Add initial log entry to subcollection
            const initialLog = {
                action: 'Ticket Created',
                timestamp: new Date().toISOString(),
                user_id: ticketData.created_by,
                user_name: userName || 'Unknown User'
            };
            await addDoc(collection(ticketRef, LOG_COLLECTION_NAME), initialLog);

            return { id: customId, ...newTicket, activity_log: [initialLog] };
        } catch (error) {
            console.error("Error creating ticket:", error);
            throw error;
        }
    },

    updateStatus: async (ticketId, newStatus, userId, userName) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, ticketId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error('Ticket not found');

            const ticketData = docSnap.data();

            if (ticketData.status !== newStatus) {
                // Update status on main doc
                await updateDoc(docRef, { status: newStatus });

                // Add log entry to subcollection
                const newActivity = {
                    action: `Status updated to ${newStatus}`,
                    timestamp: new Date().toISOString(),
                    user_id: userId,
                    user_name: userName || 'Unknown User'
                };
                await addDoc(collection(docRef, LOG_COLLECTION_NAME), newActivity);

                // We need to return the full object with logs for the UI to update immediately
                // To save a read, we can just append to what we assume is the current state or fetch
                // For correctness in this refactor, let's just return the result of getById to be safe/simple, 
                // OR construct it manually to save reads (faster).
                // Let's construct manually:

                // Note: We don't have the old logs here unless we fetch them or pass them in.
                // Re-fetching full ticket is safer to ensuring UI state consistency.
                return await ticketService.getById(ticketId);
            }

            return await ticketService.getById(ticketId);
        } catch (error) {
            console.error("Error updating status:", error);
            throw error;
        }
    },

    addComment: async (ticketId, commentText, userId, userName) => {
        try {
            const docRef = doc(db, COLLECTION_NAME, ticketId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) throw new Error('Ticket not found');

            const newActivity = {
                action: 'Comment Added',
                details: commentText,
                type: 'comment',
                timestamp: new Date().toISOString(),
                user_id: userId,
                user_name: userName || 'Unknown User'
            };

            await addDoc(collection(docRef, LOG_COLLECTION_NAME), newActivity);

            return await ticketService.getById(ticketId);
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    }
};
