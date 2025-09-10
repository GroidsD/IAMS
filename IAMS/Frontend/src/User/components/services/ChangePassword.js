import React, { useState } from "react";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [logoutAllDevices, setLogoutAllDevices] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmNewPassword) {
      setMessage("Error: New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          logoutAllDevices,
        }),
      });

      if (!response.ok) {
        // This handles HTTP errors (e.g., 400, 500)
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errCode === 0) {
        if (logoutAllDevices) {
          setMessage(
            "Password changed successfully! Logging out of all devices."
          );
          document.cookie =
            "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/login";
        } else {
          setOldPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
          setMessage("Password changed successfully! You are still logged in.");
        }
      } else {
        setMessage(`Error: ${data.errMessage}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5 rounded-3xl "
      style={{
        backgroundImage: 'url("/password.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Change Password
        </h2>
        <input
          type="text"
          name="username"
          value="currentUserEmail@example.com"
          autoComplete="username"
          hidden
          readOnly
        />
        <div className="mb-6">
          <label
            htmlFor="old-password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Old Password:
          </label>
          <input
            id="old-password"
            type="password"
            name="old-password"
            autoComplete="current-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="new-password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            New Password:
          </label>
          <input
            id="new-password"
            type="password"
            name="new-password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>
        <div className="mb-8">
          <label
            htmlFor="confirm-new-password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Confirm New Password:
          </label>
          <input
            id="confirm-new-password"
            type="password"
            name="confirm-new-password"
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
        </div>

        {/* Option to log out of all other devices */}
        <div className="mb-6 flex items-center">
          <input
            id="logout-all"
            type="checkbox"
            checked={logoutAllDevices}
            onChange={(e) => setLogoutAllDevices(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="logout-all"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            Log out of all other devices
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Change Password
        </button>
      </form>
      {message && (
        <p
          className={`mt-6 text-center text-sm font-medium ${message.startsWith("Error:") ? "text-red-600" : "text-green-600"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ChangePassword;
