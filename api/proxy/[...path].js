import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext(null);

const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [credit, setCredit] = useState(0);
  const [showLogin, setShowLogin] = useState(false); // New state

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
        showLogin,    // ADDED
        setShowLogin, // ADDED: This fixes the 'a is not a function' error
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;