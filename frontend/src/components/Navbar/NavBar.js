/**
 * Author : Sruthi Shaji, Nikita Davies
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate, useLocation } from "react-router-dom";
import UserDropdown from "../UserDropdown/UserDropdown";
import axios from "axios";
import {
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

const NavBar = () => {
  const [role, setRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingTickets, setPendingTickets] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage?.getItem("token");
  const userId = localStorage?.getItem("userId");

  const location = useLocation();
  const adminPath = '/signup/admin';

  const isAdminPath = location.pathname.includes(adminPath);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Get user role from local storage
  const getRole = () => {
    const storedRole = localStorage.getItem("role");
    if (!storedRole && !isAdminPath) {
      navigate("/");
    } else {
      setRole(storedRole);
    }
  };

  // Fetch pending tickets from the backend
  const fetchPendingTickets = async () => {
    try {
      const response = await axios.get(
        "https://event-aura-yt4akn7xpq-uc.a.run.app/api/ticket/pending"
      );
      setPendingTickets(response.data);
    } catch (error) {
      console.error("Error fetching pending tickets", error);
    }
  };

  // Assign ticket to the current admin
  const assignTicketToMe = async (ticketId) => {
    try {
      await axios.post(
        `https://event-aura-yt4akn7xpq-uc.a.run.app/api/ticket/${ticketId}/assign`,
        {
          userId,
        }
      );
      fetchPendingTickets(); // Refresh the list after assigning
    } catch (error) {
      console.error("Error assigning ticket", error);
    }
  };

  // Fetch role and pending tickets on component mount
  useEffect(() => {
    getRole();
    if (role === "ADMIN") {
      fetchPendingTickets();
    }
  }, [role]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-brand-link">
          Event Aura
        </Link>
      </div>
      <div className="navbar-links">
        {role === "ADMIN" && pendingTickets.length > 0 && token && (
          <Tooltip
            open={tooltipOpen}
            onClose={() => setTooltipOpen(false)}
            onOpen={() => setTooltipOpen(true)}
            title={
              <List>
                {pendingTickets.map((ticket) => (
                  <ListItem
                    key={ticket.id}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <ListItemText primary={ticket.name} />
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      fontSize="100px"
                      onClick={() => assignTicketToMe(ticket.id)}
                    >
                      Assign to Me
                    </Button>
                  </ListItem>
                ))}
              </List>
            }
            interactive
            classes={{ width: "custom-tooltip" }}
          >
            <IconButton
              color="inherit"
              style={{ color: "bisque", marginBottom: "15px" }}
            >
              <NotificationsIcon />
              {pendingTickets.length > 0 && (
                <span className="notification-badge">
                  {pendingTickets.length}
                </span>
              )}
            </IconButton>
          </Tooltip>
        )}
         {token && (
          <p onClick={() => navigate("/support")}>Help</p>
        )}
        {role !== "ADMIN" &&  token &&(
          <p onClick={() => navigate("/event-history")}>Events</p>
        )}
        <p onClick={() => navigate("/faq")}>FAQs</p>
        <p onClick={() => navigate("/contact")}>Contact Us</p>
        {role === "ADMIN" && (
          <p onClick={() => navigate("/approvals")}>Approvals</p>
        )}
        {!token ? (
          <p>
            <button
              className="login-register-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        ) : (
          <UserDropdown handleLogout={handleLogout} />
        )}
      </div>
      <div className="navbar-menu-icon" onClick={toggleMenu}>
        <MenuIcon fontSize="large" style={{ color: "#FF9A00" }} />
      </div>
      {isMenuOpen && (
        <div className="navbar-dropdown">
          {role !== "ADMIN" && (
            <Link to="/event-history" onClick={toggleMenu}>
              Events
            </Link>
          )}
          <Link to="/faq" onClick={toggleMenu}>
            FAQ
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            Contact
          </Link>
          {role === "ADMIN" && (
            <Link to="/approvals" onClick={toggleMenu}>
              Approvals
            </Link>
          )}
          {!token ? (
            <Link to="/login" onClick={toggleMenu}>
              Login
            </Link>
          ) : (
            <UserDropdown />
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
