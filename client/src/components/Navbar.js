import React from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();

  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;
