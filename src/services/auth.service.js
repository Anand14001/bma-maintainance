import { auth, db } from '../lib/firebase';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const authService = {
    login: async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let userData = {
                uid: user.uid,
                email: user.email,
                id: user.uid
            };

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();

                    // Normalize status
                    let status = data.status;
                    if (!status) {
                        status = data.isActive === false ? 'inactive' : 'active';
                    }

                    if (status === 'pending') {
                        await signOut(auth);
                        throw new Error("Your account is pending approval from an administrator.");
                    }
                    if (status === 'inactive') {
                        await signOut(auth);
                        throw new Error("Your account has been deactivated. Please contact the administrator.");
                    }

                    userData = { ...userData, ...data, status };
                }
            } catch (err) {
                if (err.message.includes("pending") || err.message.includes("deactivated")) throw err;
                console.error("Error fetching user profile", err);
            }

            return userData;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    register: async (email, password, name, role = 'resident') => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                uid: user.uid,
                email: user.email,
                name: name,
                role: role,
                id: user.uid,
                isActive: false, // Legacy verification
                status: 'pending', // Default for self-registration
                created_at: new Date().toISOString()
            };

            await setDoc(doc(db, 'users', user.uid), userData);

            return userData;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Admin only - create user (active by default if created by admin)
    createUser: async (email, password, name, role = 'resident') => {
        let secondaryApp = null;
        try {
            // Dynamically import to avoid top-level side effects
            const { initializeApp, deleteApp } = await import("firebase/app");
            const { getAuth: getAuthSecondary, createUserWithEmailAndPassword: createSecondary } = await import("firebase/auth");
            const { firebaseConfig } = await import("../lib/firebase");

            // 1. Initialize a secondary app instance
            secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
            const secondaryAuth = getAuthSecondary(secondaryApp);

            // 2. Create user on secondary auth
            const userCredential = await createSecondary(secondaryAuth, email, password);
            const newUser = userCredential.user;

            // 3. Create profile in MAIN Firestore (admin still logged in there)
            const userData = {
                uid: newUser.uid,
                email: newUser.email,
                name: name,
                role: role,
                id: newUser.uid,
                isActive: true,
                status: 'active', // Admin created users are active
                created_at: new Date().toISOString()
            };

            await setDoc(doc(db, 'users', newUser.uid), userData);

            return userData;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        } finally {
            // 4. Clean up secondary app
            if (secondaryApp) {
                const { deleteApp } = await import("firebase/app");
                await deleteApp(secondaryApp);
            }
        }
    },

    getAllUsers: async () => {
        try {
            const { collection, getDocs } = await import("firebase/firestore");
            const usersSnapshot = await getDocs(collection(db, 'users'));
            return usersSnapshot.docs.map(doc => {
                const data = doc.data();
                let status = data.status;
                if (!status) {
                    status = data.isActive === false ? 'inactive' : 'active';
                }
                return { id: doc.id, ...data, status };
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    updateUserStatus: async (userId, newStatus) => {
        try {
            // newStatus: 'active', 'inactive', 'pending'
            // Map to boolean for legacy support
            const isActive = newStatus === 'active';

            const { updateDoc } = await import("firebase/firestore");
            await updateDoc(doc(db, 'users', userId), {
                status: newStatus,
                isActive: isActive
            });
        } catch (error) {
            console.error("Error updating user status:", error);
            throw error;
        }
    },

    updateUserRole: async (userId, newRole) => {
        try {
            const { updateDoc } = await import("firebase/firestore");
            await updateDoc(doc(db, 'users', userId), { role: newRole });
        } catch (error) {
            console.error("Error updating user role:", error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            return true;
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser: () => {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe();
                if (user) {
                    try {
                        const userDoc = await getDoc(doc(db, 'users', user.uid));
                        let userData = {
                            uid: user.uid,
                            email: user.email,
                            id: user.uid
                        };
                        if (userDoc.exists()) {
                            const data = userDoc.data();
                            // If we want strict security, we could check isActive here too and logout,
                            // but usually checking on explicit login/refresh is enough for UX.
                            userData = { ...userData, ...data };
                        }
                        resolve(userData);
                    } catch (error) {
                        console.error("Error fetching user profile:", error);
                        resolve({ uid: user.uid, email: user.email, id: user.uid });
                    }
                } else {
                    resolve(null);
                }
            });
        });
    },

    onAuthStateChanged: (callback) => {
        return onAuthStateChanged(auth, callback);
    }
};
