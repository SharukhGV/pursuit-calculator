import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./components/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Calculator from "./components/Calculator";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import light from "./assets/light.png";
import dark from "./assets/dark.png";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

const App = () => {
  const { authToken, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState("light");
const[emailz,setEmailz]=useState("")
  // Change theme and apply it to the body class
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Dynamically render the logo based on the theme
  const renderLOGO = () => {
    if (theme === "light") {
      return <img onClick={toggleTheme} style={{ maxWidth: "30px", height: "30px",borderRadius:"50%" }} src={light} alt="Light theme logo" />;
    }
    return <img onClick={toggleTheme} style={{ maxWidth: "30px", height: "30px",borderRadius:"50%" }} src={dark} alt="Dark theme logo" />;
  };

  return (
    <Router>
      <nav>
        <ul>
          {renderLOGO()}
          {authToken ? (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/calculator">Calculator</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        {!authToken &&<Route path="/login"  element={<Login setEmailz={setEmailz} emailz={emailz}/>} />}
        {!authToken && <Route path="/register" element={<Register />} />}
        {authToken &&<Route path="/calculator"  element={<Calculator emailz={emailz}/>}/>}
        <Route path="/*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
};

export default App;
