import React, { createContext, useContext, useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import api from "../../../API/axios";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const isLoginPage = location.pathname === "/login";
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await api.get("/api/me");
        setUser(res.data.user);
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error("Error fetching /api/me:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [location.pathname]);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
