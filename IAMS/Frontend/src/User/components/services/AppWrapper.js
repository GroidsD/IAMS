import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const AppWrapper = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300); // simulate delay
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      {loading && <LoadingSpinner />}
      {children}
    </>
  );
};

export default AppWrapper;
