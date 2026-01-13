import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Ensure you use your toast library

// 1. CREATE AND EXPORT THE CONTEXT OBJECT
export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [credit, setCredit] = useState(0);
    const [showLogin, setShowLogin] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

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
        if (token) loadCreditsData();
    }, [token]);

    // 2. PASS ALL VALUES INTO THE PROVIDER
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
        setShowLogin, // This is what Navbar and Header are looking for
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;