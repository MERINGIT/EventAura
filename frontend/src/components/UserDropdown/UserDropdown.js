import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserDropdown.css";

const UserDropdown = ({ handleLogout }) => {
  const [userMeta, setUserMeta] = useState(null);
  useEffect(() => {
    setUserMeta(localStorage.getItem("email"));
  }, []);

  return (
    <>
      {userMeta && (
        <>
          <p onClick={() => { }} data-bs-toggle="dropdown" style={{ color: "white", backgroundColor: "orange", fontWeight: "bold", width: "32px", height: "32px", borderRadius: "15px", textAlign: "center" }}>
            {(userMeta)?.charAt(0).toUpperCase()}
          </p>
          <div className="dropdown-menu dropdown-menu-end">
            <Link to="/profile" className="dropdown-item">
              Profile
            </Link>
            <Link to="/new-messages" className="dropdown-item">
              My Messages
            </Link>
            <a className="dropdown-item" onClick={handleLogout} href="/">
              Logout
            </a>
          </div>
        </>
      )}

    </>
  );
};

export default UserDropdown;

