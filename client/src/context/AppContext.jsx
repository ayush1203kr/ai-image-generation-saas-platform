import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// 1. FIX: Initialize with an empty object {} instead of null.
// This prevents components from crashing if they load before the provider.
export const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [credit, setCredit] = useState(0);
    const [showLogin, setShowLogin] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // 2. STRENGTHEN: Added error handling to prevent "Loading Forever" 
    // if the backend is unreachable or returns a 404.
    const loadCreditsData = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(`${backendUrl}/users/credits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
        } catch (err) {
            console.error("Credit load error:", err);
            // If the token is expired/invalid, clear it so the app stops trying to load
            if (err.response?.status === 401) {
                logout();
            }
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setCredit(0);
        navigate("/");
    };

    useEffect(() => {
        if (token) {
            loadCreditsData();
        }
    }, [token]);

    // 3. SECURE VALUE OBJECT: 
    // We ensure every key used in your components is explicitly passed here.
    const value = {
        backendUrl,
        token,
        setToken,
        user,
        setUser,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        showLogin,
        setShowLogin, // Minifier (y) will now always find this as a function
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;