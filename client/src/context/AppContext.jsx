import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [credit, setCredit] = useState(0);

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
    } catch (error) {
      console.error("Error loading credits:", error);
    }
  };

  const generateImage = async (prompt) => {
    if (!prompt || !token) {
        toast.error("Please login to generate images");
        return null;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/image/generate-image`,
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        await loadCreditsData();
        return data.resultImage;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Image generation failed");
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCredit(0);
    navigate("/");
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    if (token) {
      loadCreditsData();
    }
  }, [token]);

  const value = {
    user, setUser,
    showLogin, setShowLogin,
    backendUrl,
    token, setToken,
    credit, setCredit,
    loadCreditsData,
    logout,
    generateImage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;