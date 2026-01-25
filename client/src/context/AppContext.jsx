import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const AppContext = createContext({});

const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [credit, setCredit] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  /* ===============================
     LOAD CREDITS (LOGIN / REFRESH)
  ================================ */
  const loadCreditsData = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/users/credits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success && typeof data.credits === "number") {
        setCredit(data.credits);
        setUser(data.user);
      }
    } catch (err) {
      console.error("Credit load error:", err);
      if (err.response?.status === 401) logout();
    }
  };

  /* ===============================
     GENERATE IMAGE (IMAGE FIRST)
  ================================ */
  const generateImage = async (prompt) => {
    if (!token) {
      toast.error("Please login first");
      return null;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/image/generate-image`,
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("GENERATE IMAGE RESPONSE:", data);

      // ✅ IMAGE GENERATION MUST NOT DEPEND ON CREDIT
      if (data.success) {
        if (typeof data.creditBalance === "number") {
          setCredit(data.creditBalance);
        }
        return data.image; // 🔥 ALWAYS RETURN IMAGE
      }

      toast.error(data.message || "Image generation failed");
      return null;

    } catch (err) {
      toast.error(err.response?.data?.message || "Image generation failed");
      return null;
    }
  };

  /* ===============================
     LOGOUT
  ================================ */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCredit(0);
    navigate("/");
  };

  /* ===============================
     INIT
  ================================ */
  useEffect(() => {
    if (token) loadCreditsData();
  }, [token]);

  return (
    <AppContext.Provider
      value={{
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
        generateImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
