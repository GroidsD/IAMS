import React, { useState, useEffect, useRef, useMemo } from "react";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { FaEdit, FaTrashAlt, FaLock } from "react-icons/fa";
import api from "../../../API/axios";

const ManagmentUser = ({ goBack, currentUserId }) => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
    department: "",
  });

  const [filters, setFilters] = useState({
    role: "",
    name: "",
    department: "",
  });
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const [showResetModal, setShowResetModal] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [modalFormData, setModalFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const formRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/get-all-user");
      const userList = Array.isArray(response.data)
        ? response.data
        : response.data.users || [];
      setUsers(userList);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error", "Failed to fetch user data.", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = filters.role
        ? user.role.toLowerCase() === filters.role.toLowerCase()
        : true;
      const matchesName = user.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const matchesDepartment = user.department
        .toLowerCase()
        .includes(filters.department.toLowerCase());
      return matchesRole && matchesName && matchesDepartment;
    });
  }, [users, filters]);

  const pageCount = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const currentItems = filteredAndSortedUsers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const handleEdit = (user) => {
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
    });
    setUserId(user.userId);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setUserId(null);
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "",
      department: "",
    });
  };

  const handleResetPassword = (user) => {
    setUserToReset(user);
    setShowResetModal(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setModalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (modalFormData.newPassword !== modalFormData.confirmNewPassword) {
      Swal.fire("Error", "New passwords do not match!", "error");
      return;
    }
    if (modalFormData.newPassword.length < 6) {
      Swal.fire(
        "Error",
        "Password must be at least 6 characters long!",
        "error"
      );
      return;
    }

    try {
      const response = await api.post("/api/reset-password", {
        userId: userToReset.userId,
        newPassword: modalFormData.newPassword,
      });
      if (response.data.errCode === 0) {
        Swal.fire(
          "Success!",
          "Password has been reset successfully.",
          "success"
        );
        setShowResetModal(false);
        setModalFormData({ newPassword: "", confirmNewPassword: "" });
      } else {
        Swal.fire("Error!", response.data.errMessage, "error");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire("Error!", "Server error while resetting password.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const isDuplicate = users.some((user) => user.email === formData.email);
    if (isDuplicate) {
      Swal.fire("Error", "Email already exists in the system!", "error");
      return;
    }

    try {
      const response = await api.post("/api/create-new-user", formData);
      if (response.data.errCode !== 0) {
        Swal.fire(
          "Error",
          response.data.errMessage || "Failed to add user.",
          "error"
        );
        return;
      }
      fetchUsers();
      handleCancelEdit();
      Swal.fire({
        title: "Success!",
        text: "Add user successfully.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire(
        "Error",
        error.response?.data?.errMessage || "Server error while adding user.",
        "error"
      );
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/update-user", {
        ...formData,
        userId: userId,
      });
      if (response.data.errCode !== 0) {
        Swal.fire(
          "Error",
          response.data.errMessage || "Failed to update user.",
          "error"
        );
        return;
      }
      fetchUsers();
      handleCancelEdit();
      Swal.fire({
        title: "Success!",
        text: "User updated successfully.",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        title: "Error!",
        text: "Error updated .",
        icon: "Error",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  const handleDelete = async (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.get("/api/delete-user", {
            params: { userId },
          });
          fetchUsers();
          handleCancelEdit();
          Swal.fire({
            title: "Success!",
            text: "Delete successfully.",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire(
            "Error!",
            "Failed to delete user. Please try again.",
            "error"
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: " Cancelled",
          text: "Your user is safe!",
          icon: "info",
          timer: 1000,
          showConfirmButton: false,
          customClass: {
            popup: "rounded-lg shadow-md",
            title: "text-blue-700",
          },
        });
      }
    });
  };

  const getRoleBadgeClasses = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "auditor":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "auditee":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white shadow-2xl rounded-xl p-8 transform transition-all duration-300 hover:scale-[1.005]">
      {goBack && (
        <button
          onClick={goBack}
          className="mb-8 flex items-center px-5 py-2 rounded-full text-base font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Go Back
        </button>
      )}

      <div className="mb-6 flex flex-col md:flex-row justify-end items-center gap-4">
        <div className="flex items-center w-full md:w-auto">
          <label
            htmlFor="searchName"
            className="mr-3 font-semibold text-gray-700 whitespace-nowrap"
          >
            Search by Name:
          </label>
          <input
            id="searchName"
            type="text"
            name="name"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Search user by name..."
            className="border border-gray-300 px-4 py-2 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full"
          />
        </div>
        <div className="flex items-center w-full md:w-auto">
          <label
            htmlFor="sortRole"
            className="mr-3 font-semibold text-gray-700 whitespace-nowrap"
          >
            Sort by Role:
          </label>
          <select
            id="sortRole"
            name="role"
            value={filters.role}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, role: e.target.value }))
            }
            className="border border-gray-300 px-4 py-2 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="auditor">Auditor</option>
            <option value="auditee">Auditee</option>
          </select>
        </div>
        <div className="flex items-center w-full md:w-auto">
          <label
            htmlFor="searchDepartment"
            className="mr-3 font-semibold text-gray-700 whitespace-nowrap"
          >
            Sort by Department:
          </label>
          <select
            id="searchDepartment"
            name="department"
            value={filters.department}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, department: e.target.value }))
            }
            className="border border-gray-300 px-4 py-2 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm w-full"
          >
            <option value="">All Department</option>
            <option value="QA">QA</option>
            <option value="WH">WH</option>
            <option value="MF">MF</option>
            <option value="ME/ D&S">ME/ D&S</option>
            <option value="IT-ADMIN">IT-ADMIN</option>
          </select>
        </div>
      </div>

      {/* User Table Section */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider rounded-tl-xl">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider rounded-tr-xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm ${getRoleBadgeClasses(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                        title="Edit user"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className={`${
                          currentUserId === user.userId
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-red-600 hover:text-red-800"
                        } transition-all duration-200`}
                        title={
                          currentUserId === user.userId
                            ? "You can't delete yourself"
                            : "Delete user"
                        }
                        disabled={currentUserId === user.userId}
                      >
                        <FaTrashAlt className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="text-gray-600 hover:text-blue-600 transition-all duration-200"
                        title="Reset password"
                      >
                        <FaLock />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-500 text-lg"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< Previous"
        containerClassName="flex justify-center items-center mt-10 space-x-2"
        pageClassName="block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150 shadow-sm"
        activeClassName="!bg-blue-600 !text-white !border-blue-600 shadow-md"
        previousClassName="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150 shadow-sm"
        nextClassName="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 transition-colors duration-150 shadow-sm"
        disabledClassName="opacity-50 cursor-not-allowed"
      />

      {/* User Form Section */}
      <div className="mt-16 pt-10 border-t-2 border-blue-200" ref={formRef}>
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
          {userId ? "Edit User" : "Add New User"}
        </h2>
        <form
          onSubmit={userId ? handleUpdateUser : handleAddUser}
          className="space-y-8 p-6 bg-blue-50 rounded-xl shadow-inner border border-blue-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="mb-2 font-semibold text-gray-700 text-lg"
              >
                Email
              </label>
              <input
                autoComplete="email"
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm ${
                  userId ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={userId}
                required
                placeholder="user@example.com"
              />
            </div>
            {!userId && (
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="mb-2 font-semibold text-gray-700 text-lg"
                >
                  Password
                </label>
                <input
                  autoComplete="current-password"
                  name="password"
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                />
              </div>
            )}
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="mb-2 font-semibold text-gray-700 text-lg"
              >
                Name
              </label>
              <input
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                required
                placeholder="John Doe"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="role"
                className="mb-2 font-semibold text-gray-700 text-lg"
              >
                Role
              </label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
              >
                <option value="">-- Select Role --</option>
                <option value="admin">Admin</option>
                <option value="auditor">Auditor</option>
                <option value="auditee">Auditee</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="department"
              className="mb-2 font-semibold text-gray-700 text-lg"
            >
              Department
            </label>
            <select
              name="department"
              id="department"
              value={formData.department || ""}
              onChange={handleInputChange}
              required={formData.role !== "admin"}
              className="border border-gray-300 px-4 py-3 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
            >
              <option value="">-- Select Department --</option>
              <option value="QA">QA</option>
              <option value="WH">WH</option>
              <option value="MF">MF</option>
              <option value="ME/ D&S">ME/ D&S</option>
              <option value="IT-ADMIN">IT-ADMIN</option>
            </select>
          </div>

          <div className="flex justify-center flex-wrap gap-4 pt-6">
            <button
              type="submit"
              className={`px-10 py-3 rounded-lg font-bold text-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg
							${
                userId
                  ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {userId ? "Update User" : "Add User"}
            </button>
            {userId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-10 py-3 rounded-lg font-bold text-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal Reset Password */}
      {showResetModal && userToReset && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Reset Password for {userToReset.name}
              </h3>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={modalFormData.newPassword}
                  onChange={handleModalInputChange}
                  className="w-full px-4 py-3 rounded-lg border "
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={modalFormData.confirmNewPassword}
                  onChange={handleModalInputChange}
                  className="w-full px-4 py-3 rounded-lg border  "
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagmentUser;
