import React from "react";
import { useAuth } from "../../context/AuthContext";
import "./style.css"

function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="nav">
      <h2 className="nav_title">Quiz game</h2>
      <button onClick={logout} className="nav_button">Logout</button>
    </div>
  );
}

export default Navbar;
