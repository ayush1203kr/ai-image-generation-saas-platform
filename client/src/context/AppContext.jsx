import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// 1. Initialize with an empty object to prevent destructuring errors
export const AppContext = createContext({});

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
            if (err.response?.status === 401) logout();
        }
    };

    // 2. ADDED: generateImage function. 
    // Your Result page is looking for this. If it's missing, you get the 'y' error.
    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/image/generate-image`, 
                { prompt }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                loadCreditsData(); // Refresh credits after successful generation
                return data.image; // Return the image URL/base64
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Generation failed");
            return null;
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
        setShowLogin,
        generateImage, // 3. CRITICAL: Pass this so Result.jsx can use it
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;