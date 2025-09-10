// // import React from "react";
// // import { Navigate } from "react-router-dom";

// // const PrivateRoute = ({ children }) => {
// //   const user = localStorage.getItem("user");

// //   if (!user) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   return children;
// // };

// // export default PrivateRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
