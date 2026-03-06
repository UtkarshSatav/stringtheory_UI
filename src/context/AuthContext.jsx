import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from '../firebaseConfig'; // Ensure this points to correct file

const auth = getAuth(app);
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    // Checking custom claim or the specific provided Admin UID
                    const idTokenResult = await user.getIdTokenResult();
                    const isAdminUser = !!idTokenResult.claims.admin || user.uid === 'bO4hxi9UxndcwtAit5hiy5FyVnD3';
                    setIsAdmin(isAdminUser);

                    // Also save token for axios
                    const token = await user.getIdToken();
                    localStorage.setItem('auth_token', token);
                } catch (error) {
                    console.error("Failed to get token:", error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
                localStorage.removeItem('auth_token');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ currentUser, isAdmin, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
