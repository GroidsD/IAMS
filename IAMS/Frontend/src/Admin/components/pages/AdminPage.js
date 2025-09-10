import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ManagmentUser from "../../../Admin/components/managment/ManagmentUser";
import ManagmentMaintenance from "../../../Admin/components/managment/ManagmentMaintenance";
// import ManagmentDashBoard from "../../../Admin/components/managment/ManagmentDashBoard";
import ManagementAudit from "../../../Admin/components/managment/ManagementAudit";
import Manual from "../managment/ManagementManual";
import {
  FaChartBar,
  FaUsers,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTools,
  FaFileSignature,
} from "react-icons/fa";

import { useUser } from "../../../User/components/context/UserContext";
import api from "../../../API/axios";
const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, setUser } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mainMenuTab, setMainMenuTab] = useState("dashboard");

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
        className={`
          bg-white text-black shadow-xl p-6 flex flex-col fixed h-full z-20 rounded-r-xl
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-64" : "w-0 -translate-x-full"} 
          overflow-hidden 
        `}
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
              <div className="text-lg font-semibold text-gray-700 text-center mt-2">
                {user.email}
              </div>
            </div>

            <ul className="space-y-4 flex-1 overflow-y-auto pr-2">
              {user.role === "admin" && (
                <li>
                  <div
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                      activeTab === "dashboard"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <FaChartBar className="text-lg" />
                    Dashboard
                  </div>
                </li>
              )}

              {user.role === "admin" && (
                <li>
                  <div
                    onClick={() => {
                      const isOpen = mainMenuTab === "Audit";
                      setMainMenuTab(isOpen ? "" : "Audit");
                      if (!isOpen) setActiveTab("Audit");
                    }}
                    className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                      mainMenuTab === "Audit"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FaFileSignature className="text-lg" />
                      Audit
                    </span>
                    <span>{mainMenuTab === "Audit" ? "▲" : "▼"}</span>
                  </div>

                  {mainMenuTab === "Audit" && (
                    <ul className="ml-6 mt-2 space-y-2">
                      {["OutstandingAudits", "AddAudit", "AuditReport"].map(
                        (subTab) => (
                          <li
                            key={subTab}
                            onClick={() => setActiveTab(subTab)}
                            className={`cursor-pointer px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between ${
                              activeTab === subTab
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-blue-200"
                            }`}
                          >
                            <span>
                              {subTab.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </li>
              )}

              {user.role === "admin" && (
                <li>
                  <div
                    onClick={() => {
                      const isOpen = mainMenuTab === "maintains";
                      setMainMenuTab(isOpen ? "" : "maintains");
                      if (!isOpen) setActiveTab("maintains");
                    }}
                    className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                      mainMenuTab === "maintains"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FaBars className="text-lg" />
                      Maintenance
                    </span>
                    <span>{mainMenuTab === "maintains" ? "▲" : "▼"}</span>
                  </div>

                  {mainMenuTab === "maintains" && (
                    <ul className="ml-6 mt-2 space-y-2">
                      {["Area", "Location", "Type", "Shift", "CheckList"].map(
                        (subTab) => (
                          <li
                            key={subTab}
                            onClick={() => setActiveTab(subTab)}
                            className={`cursor-pointer px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between ${
                              activeTab === subTab
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-blue-200"
                            }`}
                          >
                            <span>
                              {subTab.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </li>
              )}

              {user.role === "admin" && (
                <li>
                  <div
                    onClick={() => setActiveTab("users")}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                      activeTab === "users"
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    <FaUsers className="text-lg" />
                    User
                  </div>
                </li>
              )}

              {user.role === "admin" && (
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
              )}
            </ul>

            <div
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ease-in-out text-red-600 hover:bg-red-600 hover:text-white mt-auto font-semibold"
            >
              <FaSignOutAlt className="text-lg" />
              Sign Out
            </div>
          </>
        )}
      </aside>

      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className={`fixed top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform
                           ${isSidebarOpen ? "left-[calc(16rem-12px)]" : "left-0"} 
                           `}
        title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isSidebarOpen ? (
          <FaChevronLeft className="text-xl" />
        ) : (
          <FaChevronRight className="text-xl" />
        )}
      </button>

      <main
        className={`flex-1 px-5 py-2 overflow-y-auto 
          ${isSidebarOpen ? "ml-64" : "ml-0"} 
          transition-all duration-300 ease-in-out`}
      >
        <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center drop-shadow-sm">
          {activeTab === "dashboard" && "Dashboard"}
          {(activeTab === "Audit" ||
            ["OutstandingAudits", "AddAudit", "AuditReport"].includes(
              activeTab
            )) &&
            "Audit Management"}

          {(activeTab === "maintains" ||
            ["Area", "Location", "Type", "Shift", "CheckList"].includes(
              activeTab
            )) &&
            "Maintenance Management"}
          {activeTab === "users" && user.role === "admin" && "User Management"}
        </h2>

        {/* {activeTab === "dashboard" && user.role === "admin" && (
          <ManagmentDashBoard currentUserId={user.userId} />
        )} */}
        {["Audit", "OutstandingAudits", "AddAudit", "AuditReport"].includes(
          activeTab
        ) &&
          user.role === "admin" && (
            <ManagementAudit
              currentUserId={user.userId}
              activeTab={activeTab}
            />
          )}

        {[
          "maintains",
          "Area",
          "Location",
          "Type",
          "Shift",
          "CheckList",
        ].includes(activeTab) &&
          user.role === "admin" && (
            <ManagmentMaintenance
              currentUserId={user.userId}
              activeTab={activeTab}
            />
          )}

        {activeTab === "users" && user.role === "admin" && (
          <ManagmentUser
            goBack={() => setActiveTab("dashboard")}
            currentUserId={user.userId}
          />
        )}

        {activeTab === "Manual" && user.role === "admin" && (
          <Manual
            goBack={() => setActiveTab("Manual")}
            currentUserId={user.userId}
          />
        )}
      </main>
    </div>
  );
};

export default AdminPage;
