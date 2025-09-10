import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./User/components/pages/Login";
import AdminPage from "./Admin/components/pages/AdminPage";
import UserPage from "./User/components/pages/UserPage";
import PrivateRoute from "./User/components/routes/PrivateRoute";
// import AdminRoute from "./User/components/services/AdminRoute";
import AppWrapper from "./User/components/services/AppWrapper";
import GoTop from "./User/components/services/goTop";
import ScrollToTop from "./User/components/services/ScrollToTop";
import HomePage from "./User/components/pages/HomePage";
import { UserProvider } from "./User/components/context/UserContext";
// import { EquipmentProvider } from "./User/components/context/EquipmentContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const AppWithProviders = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        {isLoginPage ? (
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        ) : (
          <>
            <ScrollToTop />
            <AppWrapper>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/admin/*"
                  element={
                    <PrivateRoute allowedRoles={["admin"]}>
                      <AdminPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/user/*"
                  element={
                    <PrivateRoute allowedRoles={["auditee", "auditor"]}>
                      <UserPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </AppWrapper>
            <GoTop />
          </>
        )}
      </UserProvider>
    </QueryClientProvider>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <AppWithProviders />
      </Router>
    </div>
  );
}

export default App;
