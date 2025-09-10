import { useUser } from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
const PublicRoute = ({ children }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === "/login") {
      console.log("Redirecting from /login due to existing user");
      if (user.role === "admin") navigate("/admin");
      else navigate("/user");
    }
  }, [user, navigate, location.pathname]);

  if (loading) return null;

  if (user && location.pathname === "/login") {
    return null; // Chặn render khi đã đăng nhập
  }

  return children;
};

export default PublicRoute;
