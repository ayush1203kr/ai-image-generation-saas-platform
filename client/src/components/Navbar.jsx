import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Navbar() {
  const { user, setShowLogin, logout, credit } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/">
        <img src={assets.logo} className="w-32" alt="Logo" />
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/buy")}
            className="flex items-center gap-2 bg-blue-100 px-5 py-2 rounded-full"
          >
            <img src={assets.credit_star} className="w-5" />
            <span className="text-sm">Credits: {credit}</span>
          </button>

          <p className="hidden sm:block">Hi, {user.name}</p>

          <div className="relative group">
            <img
              src={assets.profile_icon}
              className="w-10 cursor-pointer"
              alt=""
            />
            <div className="absolute hidden group-hover:block right-0 pt-2">
              <div className="bg-white border rounded-md">
                <p
                  onClick={logout}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <button onClick={() => navigate("/buy")}>Pricing</button>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-black text-white px-6 py-2 rounded-full"
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
