import { useState } from "react";
import { Routes, Route } from "react-router";
import Search from "./pages/Search";
import Navbar from "./common/NavBar";
import LogIn from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import "./components/styling/navbar.css"; //


function App() {
  const [user, setUser] = useState(localStorage.getItem("token"));

  const logIn = (data) => {
    localStorage.setItem("token", data);
    setUser(data);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser("");
  };
  return (
    <>
    <div className="navbar-container"><Navbar signOut={signOut} user={user} /></div>
      
      <Routes>
        <Route
          path="/add-stocks"
          element={<Search logIn={logIn} user={user} />}
        />
        <Route
          path="/Dashboard"
          element={<Dashboard logIn={logIn} user={user} />}
        />
        <Route path="/signup" element={<SignUp logIn={logIn} />} />
        <Route path="/" element={<LogIn logIn={logIn} />} />
      </Routes>
    </>
  );
}

export default App;
