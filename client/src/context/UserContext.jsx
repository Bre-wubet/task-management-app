import { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';
import { apiPaths } from '../utils/apiPaths';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) return;
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        
        const fetchUser = async () => {
            try {
                const response = await api.get(apiPaths.AUTH.GET_USER_PROFILE);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const updateUser = (userData) => {
        setUser(userData)
        localStorage.setItem('token', userData.token)
        setLoading(false)
    }

    const clearUser = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <UserContext.Provider value={{user, loading, updateUser, clearUser}}>
        {children}
        </UserContext.Provider>
    );
}

export default UserProvider;