import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { backendUrl, setToken, setUser, loadCreditsData, setShowLogin } =
    useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        state === "Login" ? "/users/login" : "/users/register";

      const payload =
        state === "Login"
          ? { email, password }
          : { name, email, password };

      const { data } = await axios.post(
        `${backendUrl}${endpoint}`,
        payload
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        await loadCreditsData();
        setShowLogin(false);
        toast.success(`Welcome ${data.user.name}`);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-10 rounded-xl w-full max-w-md relative"
      >
        <h2 className="text-2xl text-center mb-4">{state}</h2>

        {state !== "Login" && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 mb-3"
            required
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-3"
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {state}
        </button>

        <p className="text-center mt-4">
          {state === "Login" ? (
            <>
              New user?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-600 cursor-pointer"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-600 cursor-pointer"
              >
                Login
              </span>
            </>
          )}
        </p>

        <img
          src={assets.cross_icon}
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 cursor-pointer w-3"
        />
      </form>
    </div>
  );
}

export default Login;
