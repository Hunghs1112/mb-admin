import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(true); // Default to true
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUser = localStorage.getItem('user');
        if (storedAuth === 'true' && storedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
            // Check stored unlock status or set based on user data
            const storedUnlock = localStorage.getItem('isUnlocked');
            if (storedUnlock !== null) {
                setIsUnlocked(JSON.parse(storedUnlock));
            } else if (storedUser) {
                const storedUserData = JSON.parse(storedUser);
                setIsUnlocked(storedUserData.locked === 0); // Set based on locked field
            }
        }
    }, []);

    const login = async (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        // Set isUnlocked based on locked field from userData
        const unlocked = userData.locked === 0; // 0 = unlocked, 1 = locked
        setIsUnlocked(unlocked);
        localStorage.setItem('isUnlocked', JSON.stringify(unlocked));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setIsUnlocked(true);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('isUnlocked');
    };

    const setAuthMessage = (msg) => {
        setMessage(msg);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isUnlocked, login, logout, message, setAuthMessage }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);