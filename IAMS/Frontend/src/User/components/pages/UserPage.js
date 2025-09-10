import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuditorsPage from "../ManagmentAuditors/AuditorsPage";
import AuditeePage from "../ManagmentAuditee/AuditeePage";
import DepartmentManagerPage from "../ManagmentDepartment/DepartmentManagerPage";
import ResponeAuditors from "../ManagmentAuditors/ResponeAuditors";
import ChangePassword from "../services/ChangePassword";
import Manual from "./Manual";
import api from "../../../API/axios";
import {
  FaBox,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaReply,
  FaCheckCircle,
  FaChartLine,
  FaLock,
  FaTools,
} from "react-icons/fa";
import { useUser } from "../context/UserContext";

const UserPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Error when log out:", err);
    }
  };

  if (!user || !user.role) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-gray-600">
        Loading user information...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans antialiased overflow-x-hidden">
      <aside
        className={`bg-white text-black shadow-xl p-6 flex flex-col fixed h-full z-20 rounded-r-xl transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0 -translate-x-full"
        } overflow-hidden`}
      >
        {isSidebarOpen && (
          <>
            <div className="mb-8">
              <img
                src="image.png"
                alt="XP Power Logo"
                className="w-auto h-auto max-w-full"
              />
              <div className="text-lg font-semibold text-gray-700 text-center mt-2">
                Welcome, {user.name}
              </div>
              <div className="text-sm font-semibold text-gray-700 text-center mt-2">
                {user.email}
              </div>
            </div>
            <ul className="space-y-4 flex-1 overflow-y-auto pr-2">
              <li>
                <div
                  onClick={() => setActiveTab("Dashboard")}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                    activeTab === "Dashboard"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  <FaChartLine className="text-lg" />
                  Dashboard
                </div>
              </li>
              {(user.role === "admin" || user.role === "auditor") && (
                <li>
                  <div
                    onClick={() => setActiveTab("Auditor")}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                      activeTab === "Auditor"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <FaCheckCircle className="text-lg" />
                    New Audits
                  </div>
                </li>
              )}
              {(user.role === "admin" || user.role === "auditor") && (
                <li>
                  <div
                    onClick={() => setActiveTab("AuditorResponses")}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                      activeTab === "AuditorResponses"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <FaReply className="text-lg" />
                    Respond Audits
                  </div>
                </li>
              )}

              {(user.role === "admin" || user.role === "auditee") && (
                <li>
                  <div
                    onClick={() => setActiveTab("Auditee")}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                      activeTab === "Auditee"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <FaCheckCircle className="text-lg" /> Planned Audits
                  </div>
                </li>
              )}

              {user.role === "departmentManager" && (
                <li>
                  <div
                    onClick={() => setActiveTab("DepartmentManager")}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                      activeTab === "DepartmentManager"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <FaBox className="text-lg" /> Department Manager
                  </div>
                </li>
              )}
              <li>
                <div
                  onClick={() => setActiveTab("ChangePassword")}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                    activeTab === "ChangePassword"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  <FaLock className="text-lg" />
                  Change Password
                </div>
              </li>
              <li>
                <div
                  onClick={() => setActiveTab("Manual")}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                    activeTab === "Manual"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-500 hover:text-white"
                  }`}
                >
                  <FaTools className="text-lg" />
                  User Manual
                </div>
              </li>
            </ul>

            <div
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-red-600 hover:bg-red-600 hover:text-white mt-auto font-semibold"
            >
              <FaSignOutAlt className="text-lg" /> Sign Out
            </div>
          </>
        )}
      </aside>

      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className={`fixed top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform ${
          isSidebarOpen ? "left-[calc(16rem-12px)]" : "left-4"
        }`}
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? (
          <FaChevronLeft className="text-xl" />
        ) : (
          <FaChevronRight className="text-xl" />
        )}
      </button>

      <main
        className={`flex-1 px-8 py-4 overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } transition-all duration-300 ease-in-out`}
      >
        {/* {activeTab === "Dashboard" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Dashboard</h2>
            <DashBoard />
          </>
        )} */}
        {activeTab === "Auditor" &&
          (user.role === "admin" || user.role === "auditor") && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Audits</h2>
              <AuditorsPage currentUserId={user.userId} />
            </>
          )}
        {activeTab === "AuditorResponses" &&
          (user.role === "admin" || user.role === "auditor") && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Audits</h2>
              <ResponeAuditors currentUserId={user.userId} />
            </>
          )}

        {activeTab === "Auditee" &&
          (user.role === "admin" || user.role === "auditee") && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Planned Audits
              </h2>
              <AuditeePage currentUserId={user.userId} />
            </>
          )}
        {activeTab === "DepartmentManager" &&
          user.role === "departmentManager" && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Department Manager
              </h2>
              <DepartmentManagerPage currentUserId={user.userId} />
            </>
          )}
        {activeTab === "ChangePassword" && (
          <>
            {/* <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Change Password
            </h2> */}
            <ChangePassword />
          </>
        )}
        {activeTab === "Manual" && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Manual</h2>
            <Manual />
          </>
        )}
      </main>
    </div>
  );
};

export default UserPage;
