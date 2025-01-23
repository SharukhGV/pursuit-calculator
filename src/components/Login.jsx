// Login.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";

function Login({ setEmailz, emailz }) {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  useEffect(() => {
    setEmailz(email)

  }, [email])


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      login(response.data.token);
      navigate("/calculator")
    } catch (error) {
      console.error(error.response.data.message);
    }
  };



  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <div></div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <div></div>
        <button type="submit">Login</button>
      </form></div>
  );
};

export default Login;
