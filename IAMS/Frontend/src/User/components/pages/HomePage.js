import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login", { replace: true });
      } else if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (user.role === "auditor" || user.role === "auditee") {
        navigate("/user", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return null;
};

export default HomePage;
